'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { usePlan } from '@/lib/plan-context'
import {
  getRealReports,
  getRealReportPeriods,
  type RealReport,
} from '@/lib/real-reports'
import type { Report, Plan } from '@/lib/types'
import { PLAN_LABELS } from '@/lib/types'

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function canAccessReport(reportPlan: Report['plan'], userPlan: Plan): boolean {
  if (reportPlan === 'ambos') return true
  if (userPlan === 'enterprise') return true
  if (userPlan === 'profesional') return reportPlan !== 'enterprise'
  return reportPlan === 'pyme'
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
  enterprise: PLAN_LABELS.enterprise,
  profesional: PLAN_LABELS.profesional,
  pyme: PLAN_LABELS.pyme,
  ambos: 'Todos',
}

export default function HistoricoPage() {
  const { plan } = usePlan()
  const allReports = useMemo(() => getRealReports(), [])
  const periods = useMemo(() => getRealReportPeriods(), [])
  const [selectedPeriod, setSelectedPeriod] = useState<{ month: number; year: number } | null>(null)

  // Group reports by year for the year tabs
  const years = useMemo(() => {
    const set = new Set<number>()
    periods.forEach((p) => set.add(p.year))
    return [...set].sort((a, b) => b - a)
  }, [periods])

  const [selectedYear, setSelectedYear] = useState<number>(years[0] ?? 2024)

  const periodsForYear = useMemo(
    () => periods.filter((p) => p.year === selectedYear),
    [periods, selectedYear]
  )

  const expandedData = useMemo(() => {
    if (selectedPeriod === null) return null
    const all = allReports.filter(
      (r) => r.month === selectedPeriod.month && r.year === selectedPeriod.year
    )
    const accessible = all.filter((r) => canAccessReport(r.plan, plan))
    return { reports: accessible, lockedCount: all.length - accessible.length }
  }, [selectedPeriod, allReports, plan])

  function getReportsForPeriod(month: number, year: number): RealReport[] {
    return allReports.filter(
      (r) => r.month === month && r.year === year && canAccessReport(r.plan, plan)
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-storm-midnight">
          Archivo Histórico
        </h1>
        <p className="text-sm text-storm-mist mt-1">
          Informes archivados disponibles para tu plan.
        </p>
      </div>

      {years.length === 0 ? (
        <div className="bg-white rounded-2xl border border-storm-foam p-12 text-center">
          <p className="text-storm-steel font-medium">Sin informes cargados</p>
          <p className="text-sm text-storm-mist mt-1">
            Cuando se publiquen informes aparecerán aquí.
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => {
                  setSelectedYear(year)
                  setSelectedPeriod(null)
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {periodsForYear.map((p) => {
              const reports = getReportsForPeriod(p.month, p.year)
              const isSelected =
                selectedPeriod?.month === p.month && selectedPeriod?.year === p.year
              return (
                <button
                  key={`${p.year}-${p.month}`}
                  onClick={() =>
                    setSelectedPeriod(isSelected ? null : { month: p.month, year: p.year })
                  }
                  className={cn(
                    'rounded-2xl p-5 text-left transition-all',
                    isSelected
                      ? 'bg-storm-midnight text-white shadow-lg'
                      : 'bg-white border border-storm-foam hover:border-storm-spray hover:shadow-md card-lift'
                  )}
                >
                  <div
                    className={cn(
                      'font-display text-lg font-medium',
                      isSelected ? 'text-white' : 'text-storm-midnight'
                    )}
                  >
                    {MONTH_NAMES_ES[p.month - 1]}
                  </div>
                  <div
                    className={cn(
                      'mt-2 font-mono text-xs',
                      isSelected ? 'text-storm-spray' : 'text-storm-mist'
                    )}
                  >
                    {reports.length} {reports.length === 1 ? 'informe' : 'informes'}
                  </div>
                </button>
              )
            })}
          </div>

          {selectedPeriod !== null && expandedData && (
            <div className="rounded-2xl border border-storm-foam bg-white p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                  <h2 className="font-display text-2xl lg:text-3xl font-medium text-storm-midnight">
                    {MONTH_NAMES_ES[selectedPeriod.month - 1]} {selectedPeriod.year}
                  </h2>
                  <p className="mt-1 text-storm-steel text-sm">
                    {expandedData.reports.length} {expandedData.reports.length === 1 ? 'informe disponible' : 'informes disponibles'}
                    {plan === 'pyme' && expandedData.lockedCount > 0 && (
                      <span className="text-storm-fog"> ({expandedData.lockedCount} adicionales en Plan Enterprise)</span>
                    )}
                  </p>
                </div>
              </div>

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
                      <h4 className="text-sm font-medium text-storm-midnight">
                        {report.title}
                      </h4>
                      <p className="text-xs text-storm-mist mt-0.5 line-clamp-1">
                        {report.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {report.fileSize && (
                        <span className="font-mono text-xs text-storm-fog">
                          {report.fileSize}
                        </span>
                      )}
                      <Link
                        href={`/plataforma/informes/${report.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-storm-steel text-xs font-medium hover:bg-storm-foam transition-colors whitespace-nowrap border border-storm-foam"
                      >
                        Ver informe
                      </Link>
                    </div>
                  </div>
                ))}

                {plan === 'pyme' && expandedData.lockedCount > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-storm-midnight/5 border border-storm-foam text-center">
                    <span className="text-sm font-medium text-storm-steel">
                      {expandedData.lockedCount} informes adicionales en Plan Enterprise
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
