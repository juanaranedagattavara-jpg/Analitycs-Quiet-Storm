import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { findUserByEmail, createUser } from '@/lib/db/users'
import { getDb, ensureDb } from '@/lib/db/client'

export async function GET(req: NextRequest) {
  const token = process.env.RESET_TOKEN
  if (!token || token.length < 8) {
    return NextResponse.json({ error: 'disabled' }, { status: 404 })
  }
  const { searchParams } = new URL(req.url)
  if (searchParams.get('token') !== token) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const email = searchParams.get('email') ?? ''
  const password = searchParams.get('password') ?? ''
  return handleReset(email, password)
}

export async function POST(req: NextRequest) {
  const token = process.env.RESET_TOKEN
  if (!token || token.length < 8) {
    return NextResponse.json({ error: 'disabled' }, { status: 404 })
  }

  const body = await req.json()
  if (body.token !== token) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { email, password } = body as { email: string; password: string }
  return handleReset(email, password)
}

async function handleReset(email: string, password: string) {
  if (!email || !password) {
    return NextResponse.json({ error: 'missing email or password' }, { status: 400 })
  }

  await ensureDb()
  const hash = await bcryptjs.hash(password, 12)
  const existing = await findUserByEmail(email)

  if (existing) {
    const sql = getDb()
    await sql`UPDATE users SET password_hash = ${hash}, role = 'admin', updated_at = ${new Date().toISOString()} WHERE id = ${existing.id}`
    return NextResponse.json({ ok: true, action: 'updated', email: existing.email })
  }

  const user = await createUser({
    email,
    passwordHash: hash,
    name: 'Juan Araneda',
    company: 'Quiet Storm Analytics',
    industry: 'seafood',
    size: 'enterprise',
    role: 'admin',
  })
  return NextResponse.json({ ok: true, action: 'created', email: user.email })
}

