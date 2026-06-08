'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global]', error)
  }, [error])

  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center bg-storm-paper p-6">
        <div className="bg-white rounded-2xl border border-storm-foam p-8 lg:p-12 text-center max-w-lg w-full">
          <div className="w-14 h-14 rounded-2xl bg-red-50 mx-auto flex items-center justify-center mb-5">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="14" cy="14" r="11" />
              <path d="M14 8v7M14 19h.01" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-semibold text-storm-midnight mb-2">
            Error inesperado
          </h1>
          <p className="text-sm text-storm-mist mb-6">
            Ocurrió un problema al cargar la aplicación.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="btn-lightning rounded-xl h-11 px-6 text-sm font-semibold"
            >
              Reintentar
            </button>
            <Link
              href="/"
              className="rounded-xl h-11 px-6 inline-flex items-center justify-center text-sm font-medium border border-storm-foam text-storm-steel hover:border-storm-spray hover:text-storm-midnight transition-colors"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
