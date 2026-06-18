import { neon } from '@neondatabase/serverless'
import { SCHEMA_STATEMENTS } from './schema'

export function getDb() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return neon(url)
}

let initialized = false

export async function ensureDb(): Promise<void> {
  if (initialized) return
  initialized = true
  const sql = getDb()
  for (const stmt of SCHEMA_STATEMENTS) {
    const s = stmt.trim()
    if (s && !s.startsWith('--')) {
      try {
        await sql.query(s, [])
      } catch {
        /* ignore if already exists */
      }
    }
  }
  try {
    const { seedRealReportsIfEmpty } = await import('./seed')
    await seedRealReportsIfEmpty()
  } catch {
    /* non-fatal */
  }
}
