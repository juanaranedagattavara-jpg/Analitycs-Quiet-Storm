'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import { cn } from '@/lib/cn'
import { usePlan } from '@/lib/plan-context'
import {
  getAllReports,
  getKPIForMonth,
  getPriceTrend,
  getCompanyRanking,
  getCaliberBreakdown,
  getExportData,
} from '@/lib/mock-data'
import {
  formatUSD,
  formatTons,
  formatPercent,
  formatMonthYear,
  exportToExcel,
} from '@/lib/export-utils'
import type { Report, ReportType } from '@/lib/types'

const CALIBER_COLORS = ['#f7c948', '#3d5a73', '#5b7a8f', '#8aa5b8', '#b8d0db']

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

function canAccessReport(reportPlan: Report['plan'], userPlan: 'grande' | 'chica'): boolean {
  if (reportPlan === 'ambos') return true
  return reportPlan === userPlan
}

// ─── Locked Content Overlay ────────────────────────────────────────────────

function LockedContent({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative rounded-2xl border border-storm-foam overflow-hidden">
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8">
        <div className="w-14 h-14 rounded-full bg-storm-paper flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#5b7a8f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="13" width="18" height="12" rx="2" />
            <path d="M9 13V9a5 5 0 0110 0v4" />
          </svg>
        </div>
        <h3 className="font-display text-base font-semibold text-storm-midnight mb-1">{title}</h3>
        <p className="text-sm text-storm-mist text-center max-w-sm mb-4">{description}</p>
        <button className="btn-lightning rounded-xl h-10 px-6 text-sm font-semibold">
          Mejorar a Plan Grande
        </button>
      </div>
      <div className="p-6 opacity-10 pointer-events-none">
        <div className="h-64 bg-storm-paper rounded-xl" />
      </div>
    </div>
  )
}

// ─── Dashboard View ─────────────────────────────────────────────────────────

function DashboardView({ report, isGrande }: { report: Report; isGrande: boolean }) {
  const kpi = useMemo(() => getKPIForMonth(report.month, report.year), [report.month, report.year])
  const priceTrend = useMemo(() => getPriceTrend(), [])
  const companies = useMemo(() => getCompanyRanking(report.month, report.year), [report.month, report.year])
  const calibers = useMemo(() => getCaliberBreakdown(report.month, report.year), [report.month, report.year])

  const kpiCards = [
    { label: 'Valor Total', value: formatUSD(kpi.totalExportValue), variation: kpi.variationValue },
    { label: 'Volumen', value: formatTons(kpi.totalVolume), variation: kpi.variationVolume },
    { label: 'Precio Promedio', value: `$${kpi.avgPrice.toFixed(2)}/kg`, variation: null },
    { label: 'Empresas', value: String(kpi.numCompanies), variation: null },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-storm-foam">
            <p className="text-xs text-storm-mist font-medium">{card.label}</p>
            <p className="text-xl font-bold text-storm-midnight mt-1 font-mono">{card.value}</p>
            {card.variation !== null && (
              <span
                className={cn(
                  'inline-flex items-center text-xs font-semibold mt-2 px-2 py-0.5 rounded-full',
                  card.variation >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-sunset-storm'
                )}
              >
                {formatPercent(card.variation)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price trend - always visible */}
        <div className="bg-white rounded-2xl p-6 border border-storm-foam">
          <h3 className="font-display text-base font-semibold text-storm-midnight mb-4">
            Evolucion de Precios
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dce8ef" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#5b7a8f' }} tickLine={false} interval={3} />
                <YAxis tick={{ fontSize: 10, fill: '#5b7a8f' }} tickLine={false} domain={['auto', 'auto']} tickFormatter={(v: number) => `$${v.toFixed(2)}`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #dce8ef', fontSize: '12px' }} formatter={(value) => [`$${Number(value).toFixed(2)}/kg`]} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="espana" name="Espana" stroke="#f7c948" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="francia" name="Francia" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="italia" name="Italia" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="promedio" name="Promedio" stroke="#3d5a73" strokeWidth={2} strokeDasharray="6 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Caliber chart - locked for chica */}
        {isGrande ? (
          <div className="bg-white rounded-2xl p-6 border border-storm-foam">
            <h3 className="font-display text-base font-semibold text-storm-midnight mb-4">
              Participacion por Calibre
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calibers} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dce8ef" vertical={false} />
                  <XAxis dataKey="calibre" tick={{ fontSize: 10, fill: '#5b7a8f' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#5b7a8f' }} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #dce8ef', fontSize: '12px' }} formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Participacion']} />
                  <Bar dataKey="participacion_pct" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {calibers.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CALIBER_COLORS[index % CALIBER_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <LockedContent
            title="Desglose por Calibre"
            description="Los datos detallados por calibre estan disponibles en Plan Grande."
          />
        )}
      </div>

      {/* Company Ranking - locked for chica */}
      {isGrande ? (
        <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
          <div className="px-6 py-4 border-b border-storm-foam">
            <h3 className="font-display text-base font-semibold text-storm-midnight">
              Ranking Empresas
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-storm-midnight text-white">
                  <th className="px-4 py-3 text-left font-medium">#</th>
                  <th className="px-4 py-3 text-left font-medium">Empresa</th>
                  <th className="px-4 py-3 text-right font-medium">Volumen (t)</th>
                  <th className="px-4 py-3 text-right font-medium">Valor (USD)</th>
                  <th className="px-4 py-3 text-right font-medium">Participacion %</th>
                  <th className="px-4 py-3 text-right font-medium">Variacion %</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c, i) => (
                  <tr key={c.empresa} className={cn('border-b border-storm-foam/60', i % 2 === 0 ? 'bg-white' : 'bg-storm-paper/30')}>
                    <td className="px-4 py-3 font-mono text-storm-mist">{c.position}</td>
                    <td className="px-4 py-3 font-medium text-storm-midnight">{c.empresa}</td>
                    <td className="px-4 py-3 text-right font-mono text-storm-steel">{c.volumen_ton.toLocaleString('en-US')}</td>
                    <td className="px-4 py-3 text-right font-mono text-storm-steel">{formatUSD(c.valor_usd)}</td>
                    <td className="px-4 py-3 text-right font-mono text-storm-steel">{c.participacion_pct.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn('font-mono text-xs font-semibold px-2 py-0.5 rounded-full', c.variacion_pct >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-sunset-storm')}>
                        {formatPercent(c.variacion_pct)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <LockedContent
          title="Ranking de Empresas"
          description="El ranking competitivo de empresas exportadoras es exclusivo del Plan Grande."
        />
      )}
    </div>
  )
}

// ─── Excel View ─────────────────────────────────────────────────────────────

function ExcelView({ report, isGrande }: { report: Report; isGrande: boolean }) {
  const exportData = useMemo(() => getExportData(report.month, report.year), [report.month, report.year])

  function handleExport() {
    const label = formatMonthYear(report.month, report.year).replace(/\s/g, '_')
    exportToExcel(exportData, `QSA_Datos_${label}.xlsx`)
  }

  if (!isGrande) {
    return (
      <LockedContent
        title="Datos de Exportacion Detallados"
        description="El acceso a datos en formato Excel con cruces por producto, destino, empresa y calibre esta disponible en Plan Grande."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-storm-mist">{exportData.length} registros</p>
        <button
          onClick={handleExport}
          className="btn-lightning rounded-lg h-9 px-4 text-sm font-semibold inline-flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h8a1 1 0 001-1V4l-3-3H3a1 1 0 00-1 1v9a1 1 0 001 1z" />
            <path d="M9 1v3h3" />
            <path d="M7 7v3M5.5 8.5L7 10l1.5-1.5" />
          </svg>
          Descargar Excel
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-storm-midnight text-white">
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Producto</th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Destino</th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Empresa</th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Calibre</th>
                <th className="px-4 py-3 text-right font-medium whitespace-nowrap">Volumen (kg)</th>
                <th className="px-4 py-3 text-right font-medium whitespace-nowrap">Valor (USD)</th>
                <th className="px-4 py-3 text-right font-medium whitespace-nowrap">Precio (USD/kg)</th>
                <th className="px-4 py-3 text-right font-medium whitespace-nowrap">Variacion %</th>
              </tr>
            </thead>
            <tbody>
              {exportData.map((row, i) => (
                <tr key={`${row.empresa}-${row.destino}-${row.calibre}-${i}`} className={cn('border-b border-storm-foam/60', i % 2 === 0 ? 'bg-white' : 'bg-storm-paper/30')}>
                  <td className="px-4 py-3 text-storm-midnight whitespace-nowrap">{row.producto}</td>
                  <td className="px-4 py-3 text-storm-steel">{row.destino}</td>
                  <td className="px-4 py-3 text-storm-steel whitespace-nowrap">{row.empresa}</td>
                  <td className="px-4 py-3 font-mono text-storm-mist">{row.calibre}</td>
                  <td className="px-4 py-3 text-right font-mono text-storm-steel">{row.volumen_kg.toLocaleString('en-US')}</td>
                  <td className="px-4 py-3 text-right font-mono text-storm-steel">{formatUSD(row.valor_usd)}</td>
                  <td className="px-4 py-3 text-right font-mono text-storm-steel">${row.precio_usd_kg.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn('font-mono text-xs font-semibold px-2 py-0.5 rounded-full', row.variacion_pct >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-sunset-storm')}>
                      {formatPercent(row.variacion_pct)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── PDF View ───────────────────────────────────────────────────────────────

function PdfView({ report, isGrande }: { report: Report; isGrande: boolean }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-storm-foam p-8 lg:p-12 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 rounded-2xl bg-red-50 mx-auto flex items-center justify-center mb-6">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 4h14l8 8v20a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
            <path d="M22 4v8h8" />
            <path d="M12 20h4a2 2 0 002-2v-1a2 2 0 00-2-2h-4v8" />
            <path d="M22 16h4v3a3 3 0 01-3 3h-1" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold text-storm-midnight mb-2">
          {isGrande ? 'Vista previa del PDF' : 'Informe PDF'}
        </h3>
        <p className="text-sm text-storm-mist mb-6 leading-relaxed">
          {report.description}
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-storm-fog mb-8">
          {report.fileSize && report.fileSize !== '-' && (
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 12h8a1 1 0 001-1V4l-3-3H3a1 1 0 00-1 1v9a1 1 0 001 1z" />
              </svg>
              {report.fileSize}
            </span>
          )}
          <span>{formatMonthYear(report.month, report.year)}</span>
        </div>

        {isGrande ? (
          <button
            onClick={() => alert('En una implementacion real, esto descargaria el archivo PDF desde el servidor.')}
            className="btn-lightning rounded-full h-12 px-8 text-sm font-semibold inline-flex items-center gap-2 mx-auto"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14h8a1 1 0 001-1V5l-4-4H4a1 1 0 00-1 1v11a1 1 0 001 1z" />
              <path d="M9 1v4h4" />
              <path d="M8 8v4M6 10l2 2 2-2" />
            </svg>
            Descargar PDF
          </button>
        ) : (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-storm-paper text-storm-steel text-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="7" width="10" height="7" rx="1.5" />
                <path d="M5 7V5a3 3 0 016 0v2" />
              </svg>
              Descarga disponible en Plan Grande
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Price Check View ───────────────────────────────────────────────────────

function PriceCheckView({ report }: { report: Report }) {
  const calibers = useMemo(() => getCaliberBreakdown(report.month, report.year), [report.month, report.year])
  const priceTrend = useMemo(() => getPriceTrend(), [])

  const destinations = ['Espana', 'Francia', 'Italia']
  const priceMatrix = calibers.map((cal) => {
    const basePrice = cal.precio_promedio
    return {
      calibre: cal.calibre,
      espana: basePrice,
      francia: +(basePrice * 1.06).toFixed(2),
      italia: +(basePrice * 1.03).toFixed(2),
      promedio: +(basePrice * 1.03).toFixed(2),
    }
  })

  const lastPoint = priceTrend[priceTrend.length - 1]
  const prevPoint = priceTrend[priceTrend.length - 2]

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {destinations.map((dest) => {
          const key = dest.toLowerCase() as 'espana' | 'francia' | 'italia'
          const current = lastPoint?.[key] ?? 0
          const prev = prevPoint?.[key] ?? 0
          const variation = prev ? ((current - prev) / prev) * 100 : 0

          return (
            <div key={dest} className="bg-white rounded-2xl p-5 border border-storm-foam">
              <p className="text-xs text-storm-mist font-medium">{dest}</p>
              <p className="text-2xl font-bold text-storm-midnight mt-1 font-mono">
                ${current.toFixed(2)}<span className="text-sm text-storm-fog font-normal">/kg</span>
              </p>
              <span
                className={cn(
                  'inline-flex items-center text-xs font-semibold mt-2 px-2 py-0.5 rounded-full',
                  variation >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-sunset-storm'
                )}
              >
                {formatPercent(variation)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Price matrix */}
      <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
        <div className="px-6 py-4 border-b border-storm-foam">
          <h3 className="font-display text-base font-semibold text-storm-midnight">
            Precios por Calibre y Destino (USD/kg)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-storm-midnight text-white">
                <th className="px-4 py-3 text-left font-medium">Calibre</th>
                <th className="px-4 py-3 text-right font-medium">Espana</th>
                <th className="px-4 py-3 text-right font-medium">Francia</th>
                <th className="px-4 py-3 text-right font-medium">Italia</th>
                <th className="px-4 py-3 text-right font-medium">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {priceMatrix.map((row, i) => (
                <tr key={row.calibre} className={cn('border-b border-storm-foam/60', i % 2 === 0 ? 'bg-white' : 'bg-storm-paper/30')}>
                  <td className="px-4 py-3 font-medium text-storm-midnight">{row.calibre}</td>
                  <td className="px-4 py-3 text-right font-mono text-storm-steel">${row.espana.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono text-storm-steel">${row.francia.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono text-storm-steel">${row.italia.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-storm-midnight">${row.promedio.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trend chart */}
      <div className="bg-white rounded-2xl p-6 border border-storm-foam">
        <h3 className="font-display text-base font-semibold text-storm-midnight mb-4">
          Tendencia de Precios (18 meses)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dce8ef" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#5b7a8f' }} tickLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: '#5b7a8f' }} tickLine={false} domain={['auto', 'auto']} tickFormatter={(v: number) => `$${v.toFixed(2)}`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #dce8ef', fontSize: '12px' }} formatter={(value) => [`$${Number(value).toFixed(2)}/kg`]} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="espana" name="Espana" stroke="#f7c948" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="francia" name="Francia" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="italia" name="Italia" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="promedio" name="Promedio" stroke="#3d5a73" strokeWidth={2} strokeDasharray="6 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function ReportViewerPage() {
  const params = useParams()
  const reportId = params.id as string
  const { plan } = usePlan()

  const isGrande = plan === 'grande'

  const allReports = useMemo(() => getAllReports(), [])
  const report = useMemo(() => allReports.find((r) => r.id === reportId), [allReports, reportId])

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

  function handleExportExcel() {
    if (!report || !isGrande) return
    const data = getExportData(report.month, report.year)
    const label = formatMonthYear(report.month, report.year).replace(/\s/g, '_')
    exportToExcel(data, `QSA_${report.type}_${label}.xlsx`)
  }

  // If the user can't access this report at all, show a full locked view
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
            Informe exclusivo Plan Grande
          </h2>
          <p className="text-sm text-storm-mist mb-2 leading-relaxed">
            {report.title}
          </p>
          <p className="text-xs text-storm-fog mb-6">
            Este informe incluye datos detallados que solo estan disponibles con el plan Empresa Grande.
          </p>
          <button className="btn-lightning rounded-xl h-11 px-8 text-sm font-semibold inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1l2 4.5H15l-3.5 3 1.5 5L8 11l-5 2.5 1.5-5L1 5.5h5L8 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            Mejorar a Plan Grande
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/plataforma/informes"
        className="inline-flex items-center gap-2 text-sm text-storm-mist hover:text-storm-midnight transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 12L6 8l4-4" />
        </svg>
        Volver a informes
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-storm-foam">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={report.type} />
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-storm-paper text-storm-steel">
                {INDUSTRY_LABELS[report.industry]}
              </span>
              {!isGrande && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                  Vista simplificada
                </span>
              )}
            </div>
            <h1 className="font-display text-xl lg:text-2xl font-bold text-storm-midnight">
              {report.title}
            </h1>
            <p className="text-sm text-storm-mist leading-relaxed max-w-2xl">
              {report.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-storm-fog">
              <span>{formatMonthYear(report.month, report.year)}</span>
              {report.fileSize && report.fileSize !== '-' && (
                <>
                  <span className="text-storm-foam">|</span>
                  <span>{report.fileSize}</span>
                </>
              )}
              <span className="text-storm-foam">|</span>
              <span>Publicado: {report.uploadDate}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isGrande && report.type !== 'dashboard' && (
              <button
                onClick={handleExportExcel}
                className="h-9 px-4 rounded-lg bg-storm-midnight text-white text-sm font-medium hover:bg-storm-deep transition-colors flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M7 3v6M5 7l2 2 2-2" />
                  <path d="M3 11h8" />
                </svg>
                Descargar Excel
              </button>
            )}
            {isGrande && report.type === 'pdf' && (
              <button
                onClick={() => alert('En una implementacion real, esto descargaria el PDF.')}
                className="btn-lightning rounded-lg h-9 px-4 text-sm font-semibold inline-flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M7 3v6M5 7l2 2 2-2" />
                  <path d="M3 11h8" />
                </svg>
                Descargar PDF
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
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

      {/* Content based on type */}
      {report.type === 'dashboard' && <DashboardView report={report} isGrande={isGrande} />}
      {report.type === 'excel' && <ExcelView report={report} isGrande={isGrande} />}
      {report.type === 'pdf' && <PdfView report={report} isGrande={isGrande} />}
      {report.type === 'price-check' && <PriceCheckView report={report} />}
    </div>
  )
} 