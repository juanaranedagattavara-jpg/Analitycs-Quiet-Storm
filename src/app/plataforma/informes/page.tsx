'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { usePlan } from '@/lib/plan-context'
import { listReports, type ClientReport } from '@/lib/reports/client'
import { formatMonthYear } from '@/lib/export-utils'
import type { Report, ReportType, Industry } from '@/lib/types'
import { PLAN_LABELS } from '@/lib/types'

const INDUSTRY_OPTIONS: { value: string; label: string }[] = [
  { value: 'todas', label: 'Todas las industrias' },
  { value: 'mitilicultura', label: 'Mitilicultura' },
  { value: 'erizos-jaibas', label: 'Erizos y Jaibas' },
  { value: 'algas', label: 'Algas y Musgos' },
  { value: 'general', label: 'General' },
]

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todos los tipos' },
  { value: 'pdf', label: 'Informe PDF' },
  { value: 'excel', label: 'Datos Excel' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'price-check', label: 'Price Check' },
]

function ReportTypeIcon({ type }: { type: ReportType }) {
  switch (type) {
    case 'pdf':
      return (
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 2h8l4 4v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
            <path d="M12 2v4h4" />
            <path d="M6 12h2a1 1 0 001-1v-1a1 1 0 00-1-1H6v5" />
          </svg>
        </div>
      )
    case 'excel':
      return (
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 2h8l4 4v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
            <path d="M12 2v4h4" />
            <path d="M7 10l3 3M10 10l-3 3" />
          </svg>
        </div>
      )
    case 'dashboard':
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="7" height="7" rx="1" />
            <rect x="11" y="2" width="7" height="7" rx="1" />
            <rect x="2" y="11" width="7" height="7" rx="1" />
            <rect x="11" y="11" width="7" height="7" rx="1" />
          </svg>
        </div>
      )
    case 'price-check':
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2v16" />
            <path d="M14 5H8.5a2.5 2.5 0 000 5h3a2.5 2.5 0 010 5H6" />
          </svg>
        </div>
      )
  }
}

function PlanBadge({ plan }: { plan: Report['plan'] }) {
  const config = {
    enterprise: { label: PLAN_LABELS.enterprise, className: 'bg-blue-50 text-blue-700' },
    profesional: { label: PLAN_LABELS.profesional, className: 'bg-purple-50 text-purple-700' },
    pyme: { label: PLAN_LABELS.pyme, className: 'bg-green-50 text-green-700' },
    ambos: { label: 'Todos', className: 'bg-storm-paper text-storm-steel' },
  }
  const { label, className } = config[plan]
  return (
    <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full', className)}>
      {label}
    </span>
  )
}

function IndustryLabel({ industry }: { industry: Industry }) {
  const labels: Record<Industry, string> = {
    mitilicultura: 'Mitilicultura',
    'erizos-jaibas': 'Erizos y Jaibas',
    algas: 'Algas y Musgos',
    general: 'General',
  }
  return <span className="text-xs text-storm-mist">{labels[industry]}</span>
}

function UpgradeBanner() {
  return (
    <div className="bg-gradient-to-r from-storm-midnight to-storm-deep rounded-2xl p-5 border border-storm-navy">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1l2 4.5H15l-3.5 3 1.5 5L8 11l-5 2.5 1.5-5L1 5.5h5L8 1z" stroke="#f7c948" strokeWidth="1.2" strokeLinejoin="round" fill="#f7c948" fillOpacity="0.2" />
            </svg>
            <h3 className="text-sm font-semibold text-white">Accede a todos los informes</h3>
          </div>
          <p className="text-xs text-storm-spray">
            Con Plan Enterprise obtienes acceso completo a rankings, análisis competitivo y datos detallados por empresa.
          </p>
        </div>
        <Link
          href="/plataforma/cuenta"
          className="btn-lightning rounded-lg h-9 px-5 text-xs font-semibold whitespace-nowrap flex-shrink-0 inline-flex items-center"
        >
          Mejorar plan
        </Link>
      </div>
    </div>
  )
}

export default function InformesPage() {
  const { plan, loading: planLoading } = usePlan()
  const [selectedIndustry, setSelectedIndustry] = useState<string>('todas')
  const [selectedType, setSelectedType] = useState<string>('todos')

  const [allReports, setAllReports] = useState<ClientReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (planLoading) return
    listReports()
      .then(({ reports }) => setAllReports(reports))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [planLoading])

  const accessibleReports = useMemo(
    () => allReports.filter((r) => r.accessible !== false),
    [allReports],
  )

  const filteredReports = useMemo(() => {
    let filtered = accessibleReports
    if (selectedIndustry !== 'todas') filtered = filtered.filter((r) => r.industry === selectedIndustry)
    if (selectedType !== 'todos') filtered = filtered.filter((r) => r.type === selectedType)
    return filtered
  }, [accessibleReports, selectedIndustry, selectedType])

  const lockedCount = useMemo(() => {
    if (plan === 'enterprise') return 0
    return allReports.filter((r) => r.accessible === false).length
  }, [allReports, plan])

  const selectClasses =
    'h-10 px-4 pr-8 rounded-lg border border-storm-foam bg-white text-sm text-storm-midnight focus:outline-none focus:ring-2 focus:ring-lightning focus:border-lightning appearance-none cursor-pointer'
  const selectBgStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%235b7a8f' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition: 'right 12px center',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-storm-midnight">Informes</h1>
        <p className="text-sm text-storm-mist mt-1">
          Biblioteca de reportes — PDF, Excel y dashboards interactivos.
        </p>
      </div>

      {plan !== 'enterprise' && lockedCount > 0 && <UpgradeBanner />}

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className={selectClasses}
          style={selectBgStyle}
        >
          {INDUSTRY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className={selectClasses}
          style={selectBgStyle}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-storm-mist">Cargando informes…</p>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-200 p-6 text-sm text-red-700">{error}</div>
      ) : (
        <>
          <p className="text-sm text-storm-mist">
            {filteredReports.length} {filteredReports.length === 1 ? 'informe encontrado' : 'informes encontrados'}
            {lockedCount > 0 && (
              <span className="text-storm-fog"> ({lockedCount} adicionales en plan superior)</span>
            )}
          </p>

          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-storm-foam p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-storm-paper mx-auto flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#8aa5b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 4h10l6 6v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  <path d="M16 4v6h6" />
                </svg>
              </div>
              <p className="text-storm-steel font-medium">No se encontraron informes</p>
              <p className="text-sm text-storm-mist mt-1">Prueba ajustando los filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl p-6 border border-storm-foam card-lift flex flex-col"
                >
                  <div className="flex items-start gap-4">
                    <ReportTypeIcon type={report.type} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-storm-midnight text-sm leading-snug line-clamp-2">
                        {report.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <IndustryLabel industry={report.industry} />
                        <span className="text-storm-foam">|</span>
                        <PlanBadge plan={report.plan} />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-storm-mist mt-3 line-clamp-2 leading-relaxed flex-1">
                    {report.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {report.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-storm-paper text-storm-steel"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-storm-foam/60">
                    <div className="flex items-center gap-3 text-xs text-storm-fog">
                      <span>{formatMonthYear(report.month, report.year)}</span>
                      {report.fileSize && (
                        <>
                          <span className="text-storm-foam">|</span>
                          <span>{report.fileSize}</span>
                        </>
                      )}
                    </div>
                    <Link
                      href={`/plataforma/informes/${report.id}`}
                      className="text-xs font-semibold text-storm-midnight hover:text-lightning transition-colors"
                    >
                      Ver informe
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
