'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { usePlan } from '@/lib/plan-context'
import { listReports, type ClientReport } from '@/lib/reports/client'
import type { Report, ReportType, Industry } from '@/lib/types'
import { PLAN_LABELS } from '@/lib/types'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const INDUSTRY_OPTIONS: { value: Industry | 'todas'; label: string; emoji: string }[] = [
  { value: 'todas', label: 'Todas', emoji: '🌐' },
  { value: 'mitilicultura', label: 'Mitilicultura', emoji: '🦪' },
  { value: 'erizos-jaibas', label: 'Erizos y Jaibas', emoji: '🦀' },
  { value: 'algas', label: 'Algas y Musgos', emoji: '🌿' },
  { value: 'general', label: 'General', emoji: '📊' },
]

const TYPE_OPTIONS: { value: ReportType | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos los tipos' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'price-check', label: 'Price Check' },
  { value: 'excel', label: 'Excel' },
  { value: 'pdf', label: 'PDF' },
]

function PlanBadge({ plan }: { plan: Report['plan'] }) {
  const config = {
    enterprise: { label: PLAN_LABELS.enterprise, className: 'bg-blue-50 text-blue-700 ring-blue-200' },
    profesional: { label: PLAN_LABELS.profesional, className: 'bg-purple-50 text-purple-700 ring-purple-200' },
    pyme: { label: PLAN_LABELS.pyme, className: 'bg-green-50 text-green-700 ring-green-200' },
    ambos: { label: 'Todos', className: 'bg-storm-paper text-storm-steel ring-storm-foam' },
  }
  const { label, className } = config[plan]
  return (
    <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ring-1', className)}>
      {label}
    </span>
  )
}

function TypeBadge({ type }: { type: ReportType }) {
  const config: Record<ReportType, { label: string; className: string }> = {
    pdf: { label: 'PDF', className: 'bg-red-50 text-red-700' },
    excel: { label: 'Excel', className: 'bg-green-50 text-green-700' },
    dashboard: { label: 'Dashboard', className: 'bg-blue-50 text-blue-700' },
    'price-check': { label: 'Price Check', className: 'bg-amber-50 text-amber-700' },
  }
  const { label, className } = config[type]
  return (
    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md', className)}>
      {label}
    </span>
  )
}

function UpgradeBanner({ lockedCount }: { lockedCount: number }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-storm-midnight via-storm-deep to-storm-navy rounded-2xl p-5 border border-storm-navy">
      <div
        aria-hidden
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-lightning/15 blur-3xl"
      />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1l2 4.5H15l-3.5 3 1.5 5L8 11l-5 2.5 1.5-5L1 5.5h5L8 1z" stroke="#f7c948" strokeWidth="1.2" strokeLinejoin="round" fill="#f7c948" fillOpacity="0.3" />
            </svg>
            <h3 className="text-sm font-semibold text-white">
              {lockedCount} {lockedCount === 1 ? 'informe adicional' : 'informes adicionales'} disponibles en plan superior
            </h3>
          </div>
          <p className="text-xs text-storm-spray">
            Mejora tu plan para acceder a rankings, market share por destino y análisis competitivo completo.
          </p>
        </div>
        <Link
          href="/plataforma/cuenta"
          className="btn-lightning rounded-lg h-9 px-5 text-xs font-semibold whitespace-nowrap flex-shrink-0 inline-flex items-center"
        >
          Mejorar plan →
        </Link>
      </div>
    </div>
  )
}

interface ReportCardProps {
  report: ClientReport
  locked: boolean
}

function ReportCard({ report, locked }: ReportCardProps) {
  const richIcon = report.hasData
  return (
    <Link
      href={`/plataforma/informes/${report.id}`}
      className={cn(
        'group relative bg-white rounded-2xl border border-storm-foam overflow-hidden card-lift flex flex-col',
        locked && 'opacity-60',
      )}
    >
      {/* Header con barra de color por industria */}
      <div
        className={cn(
          'h-1.5 w-full',
          report.industry === 'mitilicultura' && 'bg-gradient-to-r from-blue-400 to-cyan-500',
          report.industry === 'erizos-jaibas' && 'bg-gradient-to-r from-orange-400 to-red-500',
          report.industry === 'algas' && 'bg-gradient-to-r from-green-400 to-teal-500',
          report.industry === 'general' && 'bg-gradient-to-r from-storm-spray to-storm-midnight',
        )}
      />

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <TypeBadge type={report.type} />
            {richIcon && (
              <span
                title="Incluye dashboard interactivo"
                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-lightning/15 text-storm-midnight ring-1 ring-lightning/30"
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <rect x="1" y="1" width="3" height="3" rx="0.5" fill="currentColor" />
                  <rect x="5" y="1" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.6" />
                  <rect x="1" y="5" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.6" />
                  <rect x="5" y="5" width="3" height="3" rx="0.5" fill="currentColor" />
                </svg>
                Dashboard
              </span>
            )}
          </div>
          {locked && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#8aa5b8" strokeWidth="1.5">
              <rect x="2" y="6" width="10" height="7" rx="1" />
              <path d="M4 6V4a3 3 0 016 0v2" />
            </svg>
          )}
        </div>

        <h3 className="font-display font-semibold text-storm-midnight text-base leading-snug mb-2 line-clamp-2 group-hover:text-lightning transition-colors">
          {report.title}
        </h3>

        <p className="text-xs text-storm-mist line-clamp-2 leading-relaxed flex-1">
          {report.description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-storm-foam/60">
          <div className="flex items-center gap-2">
            <PlanBadge plan={report.plan} />
            {report.fileSize && (
              <span className="text-[10px] font-mono text-storm-fog">{report.fileSize}</span>
            )}
          </div>
          <span className="text-xs font-semibold text-storm-midnight group-hover:text-lightning transition-colors inline-flex items-center gap-1">
            Abrir
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transition-transform group-hover:translate-x-0.5">
              <path d="M2 5h6m0 0L5.5 2.5M8 5L5.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

interface PeriodGroup {
  key: string
  year: number
  month: number
  reports: ClientReport[]
}

function groupByPeriod(reports: ClientReport[]): PeriodGroup[] {
  const map = new Map<string, PeriodGroup>()
  for (const r of reports) {
    const key = `${r.year}-${r.month}`
    const existing = map.get(key)
    if (existing) existing.reports.push(r)
    else map.set(key, { key, year: r.year, month: r.month, reports: [r] })
  }
  return Array.from(map.values()).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return b.month - a.month
  })
}

export default function InformesPage() {
  const { plan, loading: planLoading } = usePlan()
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'todas'>('todas')
  const [selectedType, setSelectedType] = useState<ReportType | 'todos'>('todos')
  const [selectedYear, setSelectedYear] = useState<string>('todos')
  const [selectedMonth, setSelectedMonth] = useState<string>('todos')

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

  const availableYears = useMemo(() => {
    const years = new Set(allReports.map((r) => r.year))
    return Array.from(years).sort((a, b) => b - a)
  }, [allReports])

  const filteredReports = useMemo(() => {
    let filtered = allReports
    if (selectedIndustry !== 'todas') filtered = filtered.filter((r) => r.industry === selectedIndustry)
    if (selectedType !== 'todos') filtered = filtered.filter((r) => r.type === selectedType)
    if (selectedYear !== 'todos') filtered = filtered.filter((r) => String(r.year) === selectedYear)
    if (selectedMonth !== 'todos') filtered = filtered.filter((r) => String(r.month) === selectedMonth)
    return filtered
  }, [allReports, selectedIndustry, selectedType, selectedYear, selectedMonth])

  const accessibleFiltered = useMemo(
    () => filteredReports.filter((r) => r.accessible !== false),
    [filteredReports],
  )

  const lockedCount = useMemo(() => {
    if (plan === 'enterprise') return 0
    return allReports.filter((r) => r.accessible === false).length
  }, [allReports, plan])

  const periodGroups = useMemo(() => groupByPeriod(accessibleFiltered), [accessibleFiltered])

  const hasFiltersActive =
    selectedIndustry !== 'todas' ||
    selectedType !== 'todos' ||
    selectedYear !== 'todos' ||
    selectedMonth !== 'todos'

  function clearFilters() {
    setSelectedIndustry('todas')
    setSelectedType('todos')
    setSelectedYear('todos')
    setSelectedMonth('todos')
  }

  const selectClasses =
    'h-10 px-4 pr-9 rounded-xl border border-storm-foam bg-white text-sm text-storm-midnight focus:outline-none focus:ring-2 focus:ring-lightning focus:border-lightning appearance-none cursor-pointer font-medium'
  const selectBgStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%235b7a8f' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition: 'right 12px center',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-storm-midnight">
            Biblioteca de informes
          </h1>
          <p className="text-sm text-storm-mist mt-1">
            Dashboards interactivos, datos por empresa, destinos y calibres — actualizado cada mes.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-storm-mist font-mono">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {allReports.length} {allReports.length === 1 ? 'informe' : 'informes'}
          </span>
        </div>
      </div>

      {plan !== 'enterprise' && lockedCount > 0 && <UpgradeBanner lockedCount={lockedCount} />}

      {/* Industry pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {INDUSTRY_OPTIONS.map((opt) => {
          const active = selectedIndustry === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setSelectedIndustry(opt.value)}
              className={cn(
                'flex-shrink-0 inline-flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium transition-all',
                active
                  ? 'bg-storm-midnight text-white shadow-sm'
                  : 'bg-white text-storm-steel border border-storm-foam hover:border-storm-spray hover:text-storm-midnight',
              )}
            >
              <span aria-hidden>{opt.emoji}</span>
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Date + type filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className={selectClasses}
          style={selectBgStyle}
          aria-label="Año"
        >
          <option value="todos">Todos los años</option>
          {availableYears.map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className={selectClasses}
          style={selectBgStyle}
          aria-label="Mes"
        >
          <option value="todos">Todos los meses</option>
          {MONTH_NAMES.map((name, i) => (
            <option key={i} value={String(i + 1)}>{name}</option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ReportType | 'todos')}
          className={selectClasses}
          style={selectBgStyle}
          aria-label="Tipo"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {hasFiltersActive && (
          <button
            onClick={clearFilters}
            className="h-10 px-4 rounded-xl text-sm font-medium text-storm-steel hover:text-storm-midnight hover:bg-storm-paper transition-colors inline-flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Limpiar filtros
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-storm-foam p-12 text-center">
          <p className="text-sm text-storm-mist">Cargando informes…</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-200 p-6 text-sm text-red-700">{error}</div>
      ) : accessibleFiltered.length === 0 ? (
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
        <div className="space-y-10">
          {periodGroups.map((group) => (
            <section key={group.key} className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-storm-foam pb-2">
                <h2 className="font-display text-xl font-bold text-storm-midnight">
                  {MONTH_NAMES[group.month - 1]}{' '}
                  <span className="text-storm-mist font-medium">{group.year}</span>
                </h2>
                <span className="text-xs font-mono text-storm-fog">
                  {group.reports.length} {group.reports.length === 1 ? 'informe' : 'informes'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {group.reports.map((report) => (
                  <ReportCard key={report.id} report={report} locked={report.accessible === false} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
