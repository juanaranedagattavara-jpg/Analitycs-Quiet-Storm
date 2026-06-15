import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { HttpError } from '@/lib/auth/current-user'

export function jsonOk<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, init)
}

export function jsonError(status: number, message: string, details?: unknown): NextResponse {
  return NextResponse.json({ error: message, details }, { status })
}

export function handleError(err: unknown): NextResponse {
  if (err instanceof HttpError) {
    return jsonError(err.status, err.message)
  }
  if (err instanceof ZodError) {
    return jsonError(400, 'Datos inválidos', err.flatten())
  }
  console.error('[api error]', err)
  const msg = err instanceof Error ? err.message : 'Error interno'
  return jsonError(500, msg)
}

export function getClientIP(req: Request): string | null {
  const xf = req.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0].trim()
  return req.headers.get('x-real-ip')
}
