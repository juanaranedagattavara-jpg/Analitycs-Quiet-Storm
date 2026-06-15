'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { usePlan } from '@/lib/plan-context'
import { getRealReport, type RealReport } from '@/lib/real-reports'
import { formatMonthYear } from '@/lib/export-utils'
import type { Report, ReportType, Plan } from '@/lib/types'
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

function canAccessReport(reportPlan: Report['plan'], userPlan: Plan): boolean {
  if (reportPlan === 'ambos') return true
  if (userPlan === 'enterprise') return true
  if (userPlan === 'profesional') return reportPlan !== 'enterprise'
  return reportPlan === 'pyme'
}

function ReportFileViewer({ report }: { report: RealReport }) {
  const isHtml = report.file.endsWith('.html')
  const isPdf = report.file.endsWith('.pdf')

  if (isHtml) {
    return (
      <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
        <div className="px-6 py-3 border-b border-storm-foam flex items-center justify-between">
          <p className="text-xs text-storm-mist font-mono">{report.file.split('/').pop()}</p>
          <a
            href={report.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-storm-midnight hover:text-lightning"
          >
            Abrir en pestaña nueva ↗
          </a>
        </div>
        <iframe
          src={report.file}
          title={report.title}
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-popups"
          className="w-full h-[80vh] bg-white"
        />
      </div>
    )
  }

  if (isPdf) {
    return (
      <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
        <div className="px-6 py-3 border-b border-storm-foam flex items-center justify-between">
          <p className="text-xs text-storm-mist font-mono">{report.file.split('/').pop()}</p>
          <a
            href={report.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-storm-midnight hover:text-lightning"
          >
            Abrir en pestaña nueva ↗
          </a>
        </div>
        <object
          data={report.file}
          type="application/pdf"
          className="w-full h-[80vh]"
        >
          <div className="p-8 text-center">
            <p className="text-sm text-storm-mist">
              Tu navegador no puede mostrar el PDF directamente.
            </p>
            <a
              href={report.file}
              download
              className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-lg bg-storm-midnight text-white text-sm font-medium"
            >
              Descargar PDF
            </a>
          </div>
        </object>
      </div>
    )
  }

  // Excel / other binary
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
        Archivo Excel
      </h3>
      <p className="text-sm text-storm-mist mb-6 leading-relaxed">
        {report.description}
      </p>
      <a
        href={report.file}
        download
        className="btn-lightning rounded-full h-12 px-8 text-sm font-semibold inline-flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 14h8a1 1 0 001-1V5l-4-4H4a1 1 0 00-1 1v11a1 1 0 001 1z" />
          <path d="M9 1v4h4" />
          <path d="M8 8v4M6 10l2 2 2-2" />
        </svg>
        Descargar Excel
      </a>
    </div>
  )
}

export default function ReportViewerPage() {
  const params = useParams()
  const reportId = params.id as string
  const { plan } = usePlan()

  const report = useMemo(() => getRealReport(reportId), [reportId])

  if (!report) {
    return (
      <div className="space-y-6">
        <Link
          href="/plataforma/informes"
          className="inline-flex items-center gap-2 text-sm text-storm-mist hover:text-storm-midnight transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Volver a informes
        </Link>
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

  const hasAccess = canAccessReport(report.plan, plan)

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <Link
          href="/plataforma/informes"
          className="inline-flex items-center gap-2 text-sm text-storm-mist hover:text-storm-midnight transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Volver a informes
        </Link>

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
          <p className="text-sm text-storm-mist mb-2 leading-relaxed">
            {report.title}
          </p>
          <p className="text-xs text-storm-fog mb-6">
            Este informe requiere el plan {report.plan === 'enterprise' ? PLAN_LABELS.enterprise : PLAN_LABELS.profesional}.
          </p>
          <button className="btn-lightning rounded-xl h-11 px-8 text-sm font-semibold inline-flex items-center gap-2">
            Mejorar mi plan
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        href="/plataforma/informes"
        className="inline-flex items-center gap-2 text-sm text-storm-mist hover:text-storm-midnight transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 12L6 8l4-4" />
        </svg>
        Volver a informes
      </Link>

      <div className="bg-white rounded-2xl p-6 border border-storm-foam">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={report.type} />
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-storm-paper text-storm-steel">
                {INDUSTRY_LABELS[report.industry]}
              </span>
            </div>
            <h1 className="font-display text-xl lg:text-2xl font-bold text-storm-midnight">
              {report.title}
            </h1>
            <p className="text-sm text-storm-mist leading-relaxed max-w-2xl">
              {report.description}
            </p>
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
              href={report.file}
              download
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
