-- Migration: Multitenant architecture
-- Run against your Neon Postgres database
-- This script is idempotent (safe to re-run)

BEGIN;

-- 1. Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  size TEXT,
  billing_email TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_org_name ON organizations(name);

-- 2. Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TEXT NOT NULL,
  UNIQUE(organization_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_memberships_org ON memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);

-- 3. Alter subscriptions: add organization_id, drop user_id dependency
--    Check if column exists before adding
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN organization_id TEXT;
  END IF;
END $$;

-- 4. Alter sessions: add organization_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sessions' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE sessions ADD COLUMN organization_id TEXT NOT NULL DEFAULT '';
  END IF;
END $$;

-- 5. Alter invoices: add organization_id, make user_id nullable
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE invoices ADD COLUMN organization_id TEXT;
  END IF;
END $$;

-- 6. Alter report_downloads: add organization_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'report_downloads' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE report_downloads ADD COLUMN organization_id TEXT NOT NULL DEFAULT '';
  END IF;
END $$;

-- 7. Alter audit_log: add organization_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'audit_log' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE audit_log ADD COLUMN organization_id TEXT;
  END IF;
END $$;

-- 8. Create new indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_org ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_log(organization_id);

-- 9. Migrate existing users → organizations + memberships
-- For each user that has company/industry/size, create an org and membership
-- This generates UUIDs using gen_random_uuid()
DO $$
DECLARE
  u RECORD;
  new_org_id TEXT;
  now_ts TEXT := to_char(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
BEGIN
  FOR u IN
    SELECT id, email, name, company, industry, size
    FROM users
    WHERE id NOT IN (SELECT user_id FROM memberships)
  LOOP
    new_org_id := gen_random_uuid()::TEXT;

    INSERT INTO organizations (id, name, industry, size, billing_email, created_at, updated_at)
    VALUES (
      new_org_id,
      COALESCE(u.company, u.name || '''s Org'),
      u.industry,
      u.size,
      u.email,
      now_ts,
      now_ts
    )
    ON CONFLICT DO NOTHING;

    INSERT INTO memberships (id, organization_id, user_id, role, joined_at)
    VALUES (gen_random_uuid()::TEXT, new_org_id, u.id, 'owner', now_ts)
    ON CONFLICT DO NOTHING;

    -- Link their subscription to the new org
    UPDATE subscriptions
    SET organization_id = new_org_id
    WHERE user_id = u.id AND (organization_id IS NULL OR organization_id = '');

    -- Link their sessions
    UPDATE sessions
    SET organization_id = new_org_id
    WHERE user_id = u.id AND (organization_id = '' OR organization_id IS NULL);

    -- Link their invoices
    UPDATE invoices
    SET organization_id = new_org_id
    WHERE user_id = u.id AND (organization_id IS NULL OR organization_id = '');

    -- Link their report_downloads
    UPDATE report_downloads
    SET organization_id = new_org_id
    WHERE user_id = u.id AND (organization_id = '' OR organization_id IS NULL);

    -- Link their audit_log entries
    UPDATE audit_log
    SET organization_id = new_org_id
    WHERE user_id = u.id AND (organization_id IS NULL OR organization_id = '');
  END LOOP;
END $$;

-- 10. Now we can safely drop old columns from users (if they exist)
-- Note: Only drop if they exist to make script idempotent
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'company'
  ) THEN
    ALTER TABLE users DROP COLUMN company;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'industry'
  ) THEN
    ALTER TABLE users DROP COLUMN industry;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'size'
  ) THEN
    ALTER TABLE users DROP COLUMN size;
  END IF;
END $$;

-- 11. Drop user_id from subscriptions (now org-level only)
-- First drop the old unique constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE subscriptions DROP COLUMN user_id;
  END IF;
END $$;

-- 12. Add NOT NULL + UNIQUE constraint on subscriptions.organization_id
DO $$
BEGIN
  ALTER TABLE subscriptions ALTER COLUMN organization_id SET NOT NULL;
EXCEPTION
  WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'subscriptions'::regclass
      AND contype = 'u'
      AND conkey = (SELECT array_agg(attnum) FROM pg_attribute
                    WHERE attrelid = 'subscriptions'::regclass
                      AND attname = 'organization_id')
  ) THEN
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_organization_id_unique UNIQUE (organization_id);
  END IF;
END $$;

-- 13. Add foreign key constraints to existing tables (where missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'subscriptions_organization_id_fkey'
  ) THEN
    ALTER TABLE subscriptions
      ADD CONSTRAINT subscriptions_organization_id_fkey
      FOREIGN KEY (organization_id) REFERENCES organizations(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'invoices_organization_id_fkey'
  ) THEN
    ALTER TABLE invoices
      ADD CONSTRAINT invoices_organization_id_fkey
      FOREIGN KEY (organization_id) REFERENCES organizations(id);
  END IF;
END $$;

COMMIT;
