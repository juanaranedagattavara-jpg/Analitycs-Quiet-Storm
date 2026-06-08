'use client'

import { useEffect } from 'react'

export default function PlataformaError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[plataforma]', error)
  }, [error])

  return (
    <div className="bg-white rounded-2xl border border-storm-foam p-8 lg:p-12 text-center max-w-lg mx-auto mt-12">
      <div className="w-14 h-14 rounded-2xl bg-red-50 mx-auto flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="14" cy="14" r="11" />
          <path d="M14 8v7M14 19h.01" />
        </svg>
      </div>
      <h2 className="font-display text-xl font-semibold text-storm-midnight mb-2">
        Algo salió mal
      </h2>
      <p className="text-sm text-storm-mist mb-6 leading-relaxed">
        No pudimos cargar esta sección. Si el problema persiste, recarga la página o vuelve al dashboard.
      </p>
      <button
        onClick={reset}
        className="btn-lightning rounded-xl h-11 px-6 text-sm font-semibold"
      >
        Reintentar
      </button>
    </div>
  )
}
