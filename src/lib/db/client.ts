import Database, { type Database as DB } from 'better-sqlite3'
import path from 'node:path'
import fs from 'node:fs'
import { SCHEMA_SQL } from './schema'

const globalForDb = globalThis as unknown as { __qsa_db?: DB }

function resolveDbPath(): string {
  const raw = process.env.DATABASE_PATH || './data/qsa.db'
  return path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw)
}

function createConnection(): DB {
  const file = resolveDbPath()
  const dir = path.dirname(file)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const db = new Database(file)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.exec(SCHEMA_SQL)
  return db
}

export function getDb(): DB {
  if (!globalForDb.__qsa_db) {
    globalForDb.__qsa_db = createConnection()
    // Seed real reports on first init. Lazy import to avoid cycles.
    queueMicrotask(() => {
      import('./seed').then(({ seedRealReportsIfEmpty }) => seedRealReportsIfEmpty())
    })
  }
  return globalForDb.__qsa_db
}
