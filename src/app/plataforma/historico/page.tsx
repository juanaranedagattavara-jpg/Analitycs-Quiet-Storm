'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { usePlan } from '@/lib/plan-context'
import { getKPIForMonth, getReportsForMonth } from '@/lib/mock-data'
import { formatPercent } from '@/lib/export-utils'
import type { Report } from '@/lib/types'

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const MONTH_ABBR_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

const CURRENT_YEAR = 2026
const CURRENT_MONTH = 6

function formatUSDShort(value: number): string {
  if (value >= 1_000_000) {
    return '$' + (value / 1_000_000).toFixed(1) + 'M'
  }
  return '$' + Math.round(value).toLocaleString('en-US')
}

function formatTonsShort(value: number): string {
  return Math.round(value).toLocaleString('en-US') + ' t'
}

function canAccessReport(reportPlan: Report['plan'], userPlan: 'grande' | 'chica'): boolean {
  if (reportPlan === 'ambos') return true
  return reportPlan === userPlan
}

const reportTypeLabels: Record<string, string> = {
  pdf: 'PDF',
  excel: 'Excel',
  dashboard: 'Dashboard',
  'price-check': 'Price Check',
}

const reportTypeColors: Record<string, string> = {
  pdf: 'bg-red-50 text-red-700 border-red-200',
  excel: 'bg-green-50 text-green-700 border-green-200',
  dashboard: 'bg-blue-50 text-blue-700 border-blue-200',
  'price-check': 'bg-amber-50 text-amber-700 border-amber-200',
}

const planLabels: Record<string, string> = {
  grande: 'Empresa Grande',
  chica: 'PYME',
  ambos: 'Todos',
}

export default function HistoricoPage() {
  const { plan } = usePlan()
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const isFuture =
        selectedYear > CURRENT_YEAR ||
        (selectedYear === CURRENT_YEAR && month > CURRENT_MONTH)
      const isCurrent =
        selectedYear === CURRENT_YEAR && month === CURRENT_MONTH
      const hasData =
        selectedYear < CURRENT_YEAR ||
        (selectedYear === CURRENT_YEAR && month <= CURRENT_MONTH)

      const kpi = hasData ? getKPIForMonth(month, selectedYear) : undefined
      const allReports = hasData ? getReportsForMonth(month, selectedYear) : []
      // Filter by plan access
      const reports = allReports.filter((r) => canAccessReport(r.plan, plan))

      return { month, isFuture, isCurrent, hasData, kpi, reports, allReportsCount: allReports.length }
    })
  }, [selectedYear, plan])

  const expandedData = useMemo(() => {
    if (selectedMonth === null) return null
    const kpi = getKPIForMonth(selectedMonth, selectedYear)
    const allReports = getReportsForMonth(selectedMonth, selectedYear)
    const reports = allReports.filter((r) => canAccessReport(r.plan, plan))
    const lockedCount = allReports.length - reports.length
    return { kpi, reports, lockedCount }
  }, [selectedMonth, selectedYear, plan])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-storm-midnight">
          Archivo Historico
        </h1>
        <p className="text-sm text-storm-mist mt-1">
          Accede a informes y datos de meses anteriores
          {plan === 'chica' && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-storm-paper text-storm-steel">
              4 informes/mes
            </span>
          )}
        </p>
      </div>

      {/* Year Tabs */}
      <div className="flex gap-2">
        {[2025, 2026].map((year) => (
          <button
            key={year}
            onClick={() => {
              setSelectedYear(year)
              setSelectedMonth(null)
            }}
            className={cn(
              'px-6 py-3 rounded-xl font-mono text-sm font-semibold transition-all',
              selectedYear === year
                ? 'bg-storm-midnight text-white shadow-lg'
                : 'bg-white border border-storm-foam text-storm-steel hover:bg-storm-foam hover:text-storm-midnight'
            )}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {months.map(({ month, isFuture, isCurrent, hasData, kpi, reports }) => (
          <button
            key={month}
            disabled={isFuture}
            onClick={() => {
              if (!isFuture) {
                setSelectedMonth(selectedMonth === month ? null : month)
              }
            }}
            className={cn(
              'relative rounded-2xl p-5 text-left transition-all',
              isFuture
                ? 'bg-storm-foam/50 cursor-not-allowed'
                : isCurrent
                ? 'bg-lightning/5 border-2 border-lightning shadow-md hover:shadow-lg'
                : selectedMonth === month
                ? 'bg-storm-midnight text-white shadow-lg'
                : 'bg-white border border-storm-foam hover:border-storm-spray hover:shadow-md card-lift'
            )}
          >
            {isCurrent && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-lightning text-storm-midnight font-mono text-[9px] uppercase tracking-wider font-bold">
                Actual
              </span>
            )}

            <div
              className={cn(
                'font-display text-lg font-medium',
                isFuture
                  ? 'text-storm-fog'
                  : selectedMonth === month
                  ? 'text-white'
                  : 'text-storm-midnight'
              )}
            >
              {MONTH_ABBR_ES[month - 1]}
            </div>

            {hasData && kpi ? (
              <>
                <div
                  className={cn(
                    'mt-2 font-mono text-xs',
                    selectedMonth === month ? 'text-storm-spray' : 'text-storm-mist'
                  )}
                >
                  {reports.length} informes
                </div>
                <div
                  className={cn(
                    'mt-1 font-mono text-sm font-semibold',
                    selectedMonth === month ? 'text-lightning' : 'text-storm-midnight'
                  )}
                >
                  {formatUSDShort(kpi.totalExportValue)}
                </div>
              </>
            ) : isFuture ? (
              <div className="mt-2 font-mono text-xs text-storm-fog">Sin datos</div>
            ) : null}
          </button>
        ))}
      </div>

      {/* Expanded View */}
      {selectedMonth !== null && expandedData && (
        <div className="rounded-2xl border border-storm-foam bg-white p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-medium text-storm-midnight">
                {MONTH_NAMES_ES[selectedMonth - 1]} {selectedYear}
              </h2>
              <p className="mt-1 text-storm-steel text-sm">
                {expandedData.reports.length} informes disponibles
                {plan === 'chica' && expandedData.lockedCount > 0 && (
                  <span className="text-storm-fog"> ({expandedData.lockedCount} adicionales en Plan Grande)</span>
                )}
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex gap-3">
              <Link
                href={`/plataforma?mes=${selectedYear}-${String(selectedMonth).padStart(2, '0')}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-storm-midnight text-white text-sm font-semibold hover:bg-storm-deep transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Ver dashboard completo
              </Link>
            </div>
          </div>

          {/* KPI Summary Cards */}
          {expandedData.kpi && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <KPICard
                label="Valor Exportaciones"
                value={formatUSDShort(expandedData.kpi.totalExportValue)}
                change={expandedData.kpi.variationValue}
              />
              <KPICard
                label="Volumen Total"
                value={formatTonsShort(expandedData.kpi.totalVolume)}
                change={expandedData.kpi.variationVolume}
              />
              <KPICard
                label="Precio Promedio"
                value={`$${expandedData.kpi.avgPrice.toFixed(2)}/kg`}
                change={undefined}
              />
              <KPICard
                label={plan === 'grande' ? 'Empresas Activas' : 'Destino Principal'}
                value={plan === 'grande' ? String(expandedData.kpi.numCompanies) : expandedData.kpi.topDestination}
                change={undefined}
              />
            </div>
          )}

          {/* Reports List */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-storm-mist mb-4">
              Informes disponibles
            </h3>
            {expandedData.reports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-storm-paper/50 border border-storm-foam hover:border-storm-spray transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        'inline-flex px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider border',
                        reportTypeColors[report.type]
                      )}
                    >
                      {reportTypeLabels[report.type]}
                    </span>
                    <span className="text-[10px] font-mono text-storm-fog">
                      {planLabels[report.plan]}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-storm-midnight truncate">
                    {report.title}
                  </h4>
                  <p className="text-xs text-storm-mist mt-0.5 line-clamp-1">
                    {report.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  {report.fileSize && (
                    <span className="font-mono text-xs text-storm-fog">
                      {report.fileSize}
                    </span>
                  )}
                  <Link
                    href={`/plataforma/informes/${report.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-storm-steel text-xs font-medium hover:bg-storm-foam transition-colors whitespace-nowrap border border-storm-foam"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Ver informe
                  </Link>
                </div>
              </div>
            ))}

            {/* Locked reports notice for chica */}
            {plan === 'chica' && expandedData.lockedCount > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-storm-midnight/5 border border-storm-foam text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5b7a8f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="7" width="10" height="7" rx="1.5" />
                    <path d="M5 7V5a3 3 0 016 0v2" />
                  </svg>
                  <span className="text-sm font-medium text-storm-steel">
                    {expandedData.lockedCount} informes adicionales en Plan Grande
                  </span>
                </div>
                <p className="text-xs text-storm-mist">
                  Incluye rankings de empresas, analisis competitivo y datos detallados por calibre.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function KPICard({ label, value, change }: { label: string; value: string; change?: number }) {
  return (
    <div className="bg-white rounded-xl border border-storm-foam p-4">
      <p className="text-xs text-storm-mist mb-1">{label}</p>
      <p className="font-mono text-lg font-bold text-storm-midnight">{value}</p>
      {change !== undefined && (
        <p className={`text-xs font-medium mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}% vs mes anterior
        </p>
      )}
    </div>
  )
}
