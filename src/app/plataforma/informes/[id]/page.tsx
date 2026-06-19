'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { getReport, downloadUrl, inlineUrl, type ClientReport } from '@/lib/reports/client'
import { formatMonthYear } from '@/lib/export-utils'
import { hasAnyBlock } from '@/lib/reports/data-types'
import { KPIGrid } from '@/components/reports/KPIGrid'
import { RankingTable } from '@/components/reports/RankingTable'
import { MarketShareChart } from '@/components/reports/MarketShareChart'
import { CalibresChart } from '@/components/reports/CalibresChart'
import type { ReportType } from '@/lib/types'
import { PLAN_LABELS } from '@/lib/types'

function TypeBadge({ type }: { type: ReportType }) {
  const config: Record<ReportType, { label: string; className: string }> = {
    pdf: { label: 'PDF', className: 'bg-red-50 text-red-700 ring-red-200' },
    excel: { label: 'Excel', className: 'bg-green-50 text-green-700 ring-green-200' },
    dashboard: { label: 'Dashboard', className: 'bg-blue-50 text-blue-700 ring-blue-200' },
    'price-check': { label: 'Price Check', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  }
  const { label, className } = config[type]
  return (
    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full ring-1', className)}>
      {label}
    </span>
  )
}

const INDUSTRY_LABELS: Record<string, string> = {
  mitilicultura: 'Mitilicultura',
  'erizos-jaibas': 'Erizos y Jaibas',
  algas: 'Algas y Musgos',
  general: 'General',
}

function BackLink() {
  return (
    <Link
      href="/plataforma/informes"
      className="inline-flex items-center gap-2 text-sm text-storm-mist hover:text-storm-midnight transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 12L6 8l4-4" />
      </svg>
      Volver a informes
    </Link>
  )
}

function ResumenCard({ resumen }: { resumen: string }) {
  return (
    <div className="bg-storm-midnight text-white rounded-2xl p-6 lg:p-8 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 rounded-full bg-gradient-to-br from-lightning/20 to-transparent blur-2xl"
      />
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-lightning mb-3 relative">
        Resumen ejecutivo
      </p>
      <p className="text-base lg:text-lg text-storm-spray leading-relaxed whitespace-pre-line relative">
        {resumen}
      </p>
    </div>
  )
}

function EmbedViewer({ report }: { report: ClientReport }) {
  return (
    <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
      <div className="px-6 py-3 border-b border-storm-foam flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5b7a8f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 2h6l3 3v9a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
            <path d="M10 2v3h3" />
          </svg>
          <p className="text-xs text-storm-mist font-mono truncate">Vista del archivo original</p>
        </div>
        <a
          href={inlineUrl(report.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-storm-midnight hover:text-lightning whitespace-nowrap ml-3"
        >
          Abrir en pestaña nueva ↗
        </a>
      </div>
      <iframe
        src={inlineUrl(report.id)}
        title={report.title}
        loading="lazy"
        sandbox="allow-same-origin allow-scripts allow-popups"
        className="w-full h-[70vh] bg-white"
      />
    </div>
  )
}

function FileOnlyHint({ report }: { report: ClientReport }) {
  return (
    <div className="bg-white rounded-2xl border border-storm-foam p-8 lg:p-12 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 rounded-2xl bg-storm-paper mx-auto flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#5b7a8f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 4h14l8 8v20a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
          <path d="M22 4v8h8" />
          <path d="M13 18l5 5M18 18l-5 5" />
        </svg>
      </div>
      <h3 className="font-display text-xl font-semibold text-storm-midnight mb-2">
        Archivo descargable
      </h3>
      <p className="text-sm text-storm-mist mb-6 leading-relaxed">
        Este informe está disponible solo como archivo. Descárgalo para verlo en detalle.
      </p>
      <a
        href={downloadUrl(report.id)}
        className="btn-lightning rounded-full h-12 px-8 text-sm font-semibold inline-flex items-center gap-2"
      >
        Descargar informe
      </a>
    </div>
  )
}

export default function ReportViewerPage() {
  const params = useParams()
  const reportId = params.id as string

  const [report, setReport] = useState<ClientReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [forbidden, setForbidden] = useState(false)

  useEffect(() => {
    getReport(reportId)
      .then(({ report }) => {
        setReport(report)
        if (report.accessible === false) setForbidden(true)
      })
      .catch((err: Error) => {
        const msg = err.message.toLowerCase()
        if (msg.includes('403') || msg.includes('restring') || msg.includes('plan')) {
          setForbidden(true)
        } else {
          setNotFound(true)
        }
      })
      .finally(() => setLoading(false))
  }, [reportId])

  if (loading) {
    return (
      <div className="space-y-6">
        <BackLink />
        <p className="text-sm text-storm-mist">Cargando informe…</p>
      </div>
    )
  }

  if (notFound || !report) {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="bg-white rounded-2xl border border-storm-foam p-12 text-center">
          <h2 className="font-display text-xl font-semibold text-storm-midnight mb-2">
            Informe no encontrado
          </h2>
          <p className="text-sm text-storm-mist">El informe que buscas no existe o ha sido removido.</p>
        </div>
      </div>
    )
  }

  if (forbidden) {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="bg-white rounded-2xl border border-storm-foam p-8 lg:p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-storm-paper mx-auto flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#5b7a8f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="13" width="18" height="12" rx="2" />
              <path d="M9 13V9a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-semibold text-storm-midnight mb-2">
            Informe exclusivo de plan superior
          </h2>
          <p className="text-sm text-storm-mist mb-2 leading-relaxed">{report.title}</p>
          <p className="text-xs text-storm-fog mb-6">
            Este informe requiere el plan {report.plan === 'enterprise' ? PLAN_LABELS.enterprise : PLAN_LABELS.profesional}.
          </p>
          <Link
            href="/plataforma/cuenta"
            className="btn-lightning rounded-xl h-11 px-8 text-sm font-semibold inline-flex items-center gap-2"
          >
            Mejorar mi plan
          </Link>
        </div>
      </div>
    )
  }

  const data = report.data
  const showDashboard = hasAnyBlock(data)

  return (
    <div className="space-y-6">
      <BackLink />

      {/* Header con metadata + descarga */}
      <div className="bg-gradient-to-br from-white to-storm-paper rounded-2xl p-6 lg:p-8 border border-storm-foam shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={report.type} />
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-storm-paper text-storm-steel ring-1 ring-storm-foam">
                {INDUSTRY_LABELS[report.industry]}
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-storm-midnight text-white">
                {formatMonthYear(report.month, report.year)}
              </span>
            </div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-storm-midnight leading-tight">
              {report.title}
            </h1>
            <p className="text-sm text-storm-mist leading-relaxed max-w-2xl">{report.description}</p>
            {report.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {report.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white text-storm-steel border border-storm-foam"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {report.hasFile && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={downloadUrl(report.id)}
                className="btn-lightning rounded-xl h-10 px-5 text-sm font-semibold inline-flex items-center gap-2 shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 1v9M3.5 6.5L7 10l3.5-3.5" />
                  <path d="M1 12h12" />
                </svg>
                Descargar
                {report.fileSize && (
                  <span className="font-mono text-[10px] opacity-70">({report.fileSize})</span>
                )}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Si hay datos estructurados: dashboard */}
      {showDashboard && data && (
        <>
          {data.resumen && <ResumenCard resumen={data.resumen} />}

          {data.kpis && data.kpis.length > 0 && (
            <section>
              <h2 className="sr-only">Indicadores</h2>
              <KPIGrid kpis={data.kpis} />
            </section>
          )}

          {data.marketShare && data.marketShare.length > 0 && (
            <MarketShareChart marketShare={data.marketShare} />
          )}

          {data.ranking && data.ranking.length > 0 && <RankingTable ranking={data.ranking} />}

          {data.calibres && data.calibres.length > 0 && <CalibresChart calibres={data.calibres} />}
        </>
      )}

      {/* Si NO hay dashboard pero hay archivo (PDF/HTML): embedido */}
      {!showDashboard && report.hasFile && (report.type === 'pdf' || report.type === 'dashboard') && (
        <EmbedViewer report={report} />
      )}

      {/* Si NO hay dashboard NI embed (excel/csv puros sin parsear): hint de descarga */}
      {!showDashboard && report.hasFile && !(report.type === 'pdf' || report.type === 'dashboard') && (
        <FileOnlyHint report={report} />
      )}

      {/* Si no hay nada de nada */}
      {!showDashboard && !report.hasFile && (
        <div className="bg-white rounded-2xl border border-storm-foam p-12 text-center">
          <p className="text-storm-steel font-medium">Este informe aún no tiene contenido</p>
          <p className="text-sm text-storm-mist mt-1">Vuelve más tarde o contacta con soporte.</p>
        </div>
      )}
    </div>
  )
}
