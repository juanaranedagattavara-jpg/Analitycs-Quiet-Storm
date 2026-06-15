'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { getReport, downloadUrl, inlineUrl, type ClientReport } from '@/lib/reports/client'
import { formatMonthYear } from '@/lib/export-utils'
import type { ReportType } from '@/lib/types'
import { PLAN_LABELS } from '@/lib/types'

function TypeBadge({ type }: { type: ReportType }) {
  const config: Record<ReportType, { label: string; className: string }> = {
    pdf: { label: 'PDF', className: 'bg-red-50 text-red-700' },
    excel: { label: 'Excel', className: 'bg-green-50 text-green-700' },
    dashboard: { label: 'Dashboard', className: 'bg-blue-50 text-blue-700' },
    'price-check': { label: 'Price Check', className: 'bg-amber-50 text-amber-700' },
  }
  const { label, className } = config[type]
  return (
    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', className)}>
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

function ReportFileViewer({ report }: { report: ClientReport }) {
  const previewSrc = inlineUrl(report.id)
  const dlSrc = downloadUrl(report.id)

  if (report.type === 'dashboard' || report.type === 'pdf') {
    return (
      <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
        <div className="px-6 py-3 border-b border-storm-foam flex items-center justify-between">
          <p className="text-xs text-storm-mist font-mono truncate">{report.title}</p>
          <a
            href={previewSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-storm-midnight hover:text-lightning whitespace-nowrap ml-3"
          >
            Abrir en pestaña nueva ↗
          </a>
        </div>
        <iframe
          src={previewSrc}
          title={report.title}
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-popups"
          className="w-full h-[80vh] bg-white"
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-storm-foam p-8 lg:p-12 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 rounded-2xl bg-green-50 mx-auto flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 4h14l8 8v20a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
          <path d="M22 4v8h8" />
          <path d="M13 18l5 5M18 18l-5 5" />
        </svg>
      </div>
      <h3 className="font-display text-xl font-semibold text-storm-midnight mb-2">
        Archivo {report.type === 'excel' ? 'Excel' : 'descargable'}
      </h3>
      <p className="text-sm text-storm-mist mb-6 leading-relaxed">{report.description}</p>
      <a
        href={dlSrc}
        className="btn-lightning rounded-full h-12 px-8 text-sm font-semibold inline-flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 14h8a1 1 0 001-1V5l-4-4H4a1 1 0 00-1 1v11a1 1 0 001 1z" />
          <path d="M9 1v4h4" />
          <path d="M8 8v4M6 10l2 2 2-2" />
        </svg>
        Descargar archivo
      </a>
    </div>
  )
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
          <p className="text-sm text-storm-mist">
            El informe que buscas no existe o ha sido removido.
          </p>
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

  return (
    <div className="space-y-6">
      <BackLink />

      <div className="bg-white rounded-2xl p-6 border border-storm-foam">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={report.type} />
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-storm-paper text-storm-steel">
                {INDUSTRY_LABELS[report.industry]}
              </span>
            </div>
            <h1 className="font-display text-xl lg:text-2xl font-bold text-storm-midnight">{report.title}</h1>
            <p className="text-sm text-storm-mist leading-relaxed max-w-2xl">{report.description}</p>
            <div className="flex items-center gap-3 text-xs text-storm-fog">
              <span>{formatMonthYear(report.month, report.year)}</span>
              {report.fileSize && (
                <>
                  <span className="text-storm-foam">|</span>
                  <span>{report.fileSize}</span>
                </>
              )}
              <span className="text-storm-foam">|</span>
              <span>Publicado: {report.uploadDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={downloadUrl(report.id)}
              className="btn-lightning rounded-lg h-9 px-4 text-sm font-semibold inline-flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M7 3v6M5 7l2 2 2-2" />
                <path d="M3 11h8" />
              </svg>
              Descargar
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-storm-foam/60">
          {report.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-storm-paper text-storm-steel"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <ReportFileViewer report={report} />
    </div>
  )
}
