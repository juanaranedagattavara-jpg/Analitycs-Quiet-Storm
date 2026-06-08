import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-3">
          Error 404
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-medium text-storm-midnight mb-4">
          Página no encontrada
        </h1>
        <p className="text-storm-steel leading-relaxed mb-8">
          La ruta que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="btn-lightning rounded-full h-12 px-8 inline-flex items-center justify-center font-semibold text-sm"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
