import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const ROOT = path.resolve(process.cwd(), 'storage', 'reports')

async function ensureDir(): Promise<void> {
  await fs.mkdir(ROOT, { recursive: true })
}

function safeBaseName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || 'file'
}

export interface SavedFile {
  storageKey: string
  size: number
  originalName: string
}

export async function saveReportFile(file: File): Promise<SavedFile> {
  await ensureDir()
  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = path.extname(file.name)
  const base = safeBaseName(path.basename(file.name, ext))
  const key = `${randomUUID()}-${base}${ext}`
  const target = path.join(ROOT, key)
  await fs.writeFile(target, buffer)
  return { storageKey: key, size: buffer.length, originalName: file.name }
}

export async function readReportFile(storageKey: string): Promise<{ buffer: Buffer; size: number } | null> {
  const file = path.join(ROOT, path.basename(storageKey))
  try {
    const buf = await fs.readFile(file)
    return { buffer: buf, size: buf.length }
  } catch {
    return null
  }
}

export async function deleteReportFile(storageKey: string): Promise<void> {
  const file = path.join(ROOT, path.basename(storageKey))
  try {
    await fs.unlink(file)
  } catch {
    /* ignore */
  }
}

export function contentTypeFromName(name: string): string {
  const ext = name.toLowerCase().split('.').pop() || ''
  switch (ext) {
    case 'pdf':
      return 'application/pdf'
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    case 'xls':
      return 'application/vnd.ms-excel'
    case 'csv':
      return 'text/csv'
    case 'html':
    case 'htm':
      return 'text/html'
    case 'json':
      return 'application/json'
    default:
      return 'application/octet-stream'
  }
}
