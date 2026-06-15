'use client'

import { useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { login, ApiError } from '@/lib/auth/client'

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/plataforma'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) {
      setError('Email y contraseña son obligatorios')
      return
    }
    setSubmitting(true)
    try {
      await login(email.trim().toLowerCase(), password)
      router.push(next)
      router.refresh()
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) setError('Email o contraseña incorrectos')
        else if (err.status === 429) setError('Demasiados intentos. Espera un momento.')
        else setError(err.message || 'No pudimos iniciar sesión')
      } else {
        setError('Hubo un problema. Verifica tu conexión.')
      }
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white border border-storm-foam p-8 shadow-sm" noValidate>
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label
            htmlFor="l-email"
            className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2"
          >
            Email
          </label>
          <input
            id="l-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@empresa.cl"
            className="w-full px-4 py-3 rounded-xl border border-storm-foam bg-white text-storm-midnight placeholder:text-storm-fog focus:ring-2 focus:ring-lightning/30 focus:border-lightning outline-none transition-all text-sm"
            autoFocus
          />
        </div>

        <div>
          <label
            htmlFor="l-password"
            className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2"
          >
            Contraseña
          </label>
          <input
            id="l-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            className="w-full px-4 py-3 rounded-xl border border-storm-foam bg-white text-storm-midnight placeholder:text-storm-fog focus:ring-2 focus:ring-lightning/30 focus:border-lightning outline-none transition-all text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={cn(
          'mt-7 w-full h-13 rounded-full font-semibold inline-flex items-center justify-center gap-2 transition-all py-3.5',
          submitting ? 'bg-storm-foam text-storm-fog cursor-not-allowed' : 'btn-lightning',
        )}
      >
        {submitting ? 'Iniciando sesión…' : 'Iniciar sesión →'}
      </button>

      <p className="text-center mt-5 text-sm text-storm-mist">
        ¿No tienes cuenta?{' '}
        <Link href="/registro" className="font-semibold text-storm-midnight hover:text-lightning">
          Crear cuenta gratis
        </Link>
      </p>
    </form>
  )
}
