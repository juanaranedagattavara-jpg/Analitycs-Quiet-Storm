'use client'

import { useState, useMemo } from 'react'
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
  PieChart,
  Pie,
} from 'recharts'
import { cn } from '@/lib/cn'
import { usePlan } from '@/lib/plan-context'
import {
  monthOptions,
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
  exportToExcel,
} from '@/lib/export-utils'

const CALIBER_COLORS = ['#f7c948', '#3d5a73', '#5b7a8f', '#8aa5b8', '#b8d0db']
const DESTINATION_COLORS = ['#f7c948', '#3b82f6', '#10b981', '#e8754c', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b']

function parseMonthKey(key: string): { month: number; year: number } {
  const [y, m] = key.split('-').map(Number)
  return { month: m, year: y }
}

// ─── Upgrade Banner ────────────────────────────────────────────────────────

function UpgradeBanner() {
  return (
    <div className="bg-gradient-to-r from-storm-midnight to-storm-deep rounded-2xl p-6 border border-storm-navy">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2l2.5 5.5H18l-4.5 3.5 1.5 6L10 14l-5 3 1.5-6L2 7.5h5.5L10 2z" stroke="#f7c948" strokeWidth="1.5" strokeLinejoin="round" fill="#f7c948" fillOpacity="0.2" />
            </svg>
            <h3 className="font-display text-base font-semibold text-white">
              Mejora a Plan Grande
            </h3>
          </div>
          <p className="text-sm text-storm-spray leading-relaxed">
            Accede a rankings de empresas, desglose por calibre, analisis competitivo detallado y 7 informes mensuales.
          </p>
        </div>
        <button className="btn-lightning rounded-xl h-10 px-6 text-sm font-semibold whitespace-nowrap flex-shrink-0">
          Ver planes
        </button>
      </div>
    </div>
  )
}

// ─── Locked Section Overlay ────────────────────────────────────────────────

function LockedOverlay({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden relative">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-full bg-storm-paper flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b7a8f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <p className="font-display text-sm font-semibold text-storm-midnight mb-1">{title}</p>
        <p className="text-xs text-storm-mist text-center">Disponible en Plan Grande</p>
      </div>
      <div className="p-6 opacity-20 pointer-events-none">
        <div className="h-48 bg-storm-paper rounded-xl" />
      </div>
    </div>
  )
}

// ─── Price Comparison Card (Chica only) ────────────────────────────────────

function PriceComparisonCard() {
  const priceData = [
    { producto: 'Carne de mejillon', precio: 3.05, variacion: 2.3, icon: '~' },
    { producto: 'Mejillon entero', precio: 2.30, variacion: -1.8, icon: '~' },
    { producto: 'Media valva', precio: 4.50, variacion: 4.1, icon: '~' },
    { producto: 'Conserva', precio: 5.20, variacion: 0.5, icon: '~' },
    { producto: 'Ahumado', precio: 6.80, variacion: 1.2, icon: '~' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
      <div className="px-6 py-4 border-b border-storm-foam">
        <h2 className="font-display text-lg font-semibold text-storm-midnight">
          Precios Promedio por Producto
        </h2>
        <p className="text-xs text-storm-mist mt-1">Referencia de mercado FOB Chile (USD/kg)</p>
      </div>
      <div className="divide-y divide-storm-foam/60">
        {priceData.map((item) => (
          <div key={item.producto} className="flex items-center justify-between px-6 py-4 hover:bg-storm-paper/50 transition-colors">
            <div>
              <p className="text-sm font-medium text-storm-midnight">{item.producto}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-lg font-bold text-storm-midnight">
                ${item.precio.toFixed(2)}
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
                  item.variacion >= 0
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-sunset-storm'
                )}
              >
                {item.variacion >= 0 ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 7V3M3 4.5L5 3l2 1.5" />
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 3v4M3 5.5L5 7l2-1.5" />
                  </svg>
                )}
                {formatPercent(item.variacion)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Market Overview Card (Chica only) ─────────────────────────────────────

function MarketOverviewCard({ month, year }: { month: number; year: number }) {
  const kpi = useMemo(() => getKPIForMonth(month, year), [month, year])

  const insights = [
    {
      label: 'Tendencia de precios',
      value: kpi.variationValue >= 0 ? 'Al alza' : 'A la baja',
      detail: `${formatPercent(kpi.variationValue)} vs mes anterior`,
      color: kpi.variationValue >= 0 ? 'text-green-700' : 'text-sunset-storm',
    },
    {
      label: 'Destino principal',
      value: kpi.topDestination,
      detail: '38% del volumen total exportado',
      color: 'text-storm-midnight',
    },
    {
      label: 'Calibre mas demandado',
      value: kpi.topCaliber,
      detail: 'Mayor volumen de exportacion este mes',
      color: 'text-storm-midnight',
    },
    {
      label: 'Actividad del sector',
      value: `${kpi.numCompanies} empresas`,
      detail: 'Empresas activas exportando este mes',
      color: 'text-storm-midnight',
    },
  ]

  return (
    <div className="bg-white rounded-2xl border border-storm-foam p-6">
      <h2 className="font-display text-lg font-semibold text-storm-midnight mb-4">
        Panorama del Mercado
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((item) => (
          <div key={item.label} className="p-4 rounded-xl bg-storm-paper/50">
            <p className="text-xs text-storm-mist font-medium mb-1">{item.label}</p>
            <p className={cn('text-base font-semibold', item.color)}>{item.value}</p>
            <p className="text-xs text-storm-fog mt-1">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Destination Data ──────────────────────────────────────────────────────

const DESTINATION_DATA = [
  { destino: 'Espana', tons: 2261, valor: 7913500, porcentaje: 38 },
  { destino: 'Francia', tons: 1309, valor: 4886300, porcentaje: 22 },
  { destino: 'Italia', tons: 833, valor: 3025700, porcentaje: 14 },
  { destino: 'EE.UU.', tons: 476, valor: 1878400, porcentaje: 8 },
  { destino: 'Rusia', tons: 357, valor: 1145100, porcentaje: 6 },
  { destino: 'Brasil', tons: 297, valor: 983500, porcentaje: 5 },
  { destino: 'Japon', tons: 238, valor: 988200, porcentaje: 4 },
  { destino: 'Otros', tons: 179, valor: 604800, porcentaje: 3 },
]

// ─── Main Dashboard Page ───────────────────────────────────────────────────

export default function DashboardPage() {
  const { plan } = usePlan()
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[monthOptions.length - 1].value)
  const [sortField, setSortField] = useState<'volumen_ton' | 'valor_usd' | 'participacion_pct' | 'variacion_pct'>('valor_usd')
  const [sortAsc, setSortAsc] = useState(false)

  const { month, year } = parseMonthKey(selectedMonth)

  const kpi = useMemo(() => getKPIForMonth(month, year), [month, year])
  const priceTrend = useMemo(() => getPriceTrend(), [])
  const companyRanking = useMemo(() => getCompanyRanking(month, year), [month, year])
  const caliberBreakdown = useMemo(() => getCaliberBreakdown(month, year), [month, year])
  const exportData = useMemo(() => getExportData(month, year), [month, year])

  const sortedCompanies = useMemo(() => {
    const sorted = [...companyRanking]
    sorted.sort((a, b) => {
      const valA = a[sortField]
      const valB = b[sortField]
      return sortAsc ? valA - valB : valB - valA
    })
    return sorted.map((c, i) => ({ ...c, position: i + 1 }))
  }, [companyRanking, sortField, sortAsc])

  function handleSort(field: typeof sortField) {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  function handleExportExcel() {
    const label = monthOptions.find((o) => o.value === selectedMonth)?.label ?? selectedMonth
    exportToExcel(exportData, `QSA_Exportaciones_${label.replace(/\s/g, '_')}.xlsx`)
  }

  const selectedLabel = monthOptions.find((o) => o.value === selectedMonth)?.label ?? ''

  const kpiCards = [
    {
      label: 'Valor Total Exportaciones',
      value: formatUSD(kpi.totalExportValue),
      variation: kpi.variationValue,
      unit: 'USD',
    },
    {
      label: 'Volumen Total',
      value: formatTons(kpi.totalVolume),
      variation: kpi.variationVolume,
      unit: 'toneladas',
    },
    {
      label: 'Precio Promedio',
      value: `$${kpi.avgPrice.toFixed(2)}`,
      variation: null,
      unit: 'USD/kg',
    },
    {
      label: plan === 'grande' ? 'Empresas Activas' : 'Destino Principal',
      value: plan === 'grande' ? String(kpi.numCompanies) : kpi.topDestination,
      variation: null,
      unit: plan === 'grande' ? '' : '',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-storm-midnight">
            Dashboard
          </h1>
          <p className="text-sm text-storm-mist mt-1">
            Resumen de exportaciones - {selectedLabel}
            {plan === 'chica' && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-storm-paper text-storm-steel">
                Plan Empresa Chica
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-10 px-4 pr-8 rounded-lg border border-storm-foam bg-white text-sm text-storm-midnight focus:outline-none focus:ring-2 focus:ring-lightning focus:border-lightning appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%235b7a8f' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleExportExcel}
            className="h-10 px-5 rounded-lg bg-storm-midnight text-white text-sm font-medium hover:bg-storm-deep transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14h8a1 1 0 001-1V5l-4-4H4a1 1 0 00-1 1v11a1 1 0 001 1z" />
              <path d="M9 1v4h4" />
              <path d="M8 8v4M6 10l2 2 2-2" />
            </svg>
            Exportar datos
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-6 border border-storm-foam"
          >
            <p className="text-sm text-storm-mist font-medium">{card.label}</p>
            <p className="text-2xl lg:text-3xl font-bold text-storm-midnight mt-2 font-mono">
              {card.value}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-storm-fog">{card.unit}</span>
              {card.variation !== null && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
                    card.variation >= 0
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-sunset-storm'
                  )}
                >
                  {card.variation >= 0 ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 9V3M3 5l3-3 3 3" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 3v6M3 7l3 3 3-3" />
                    </svg>
                  )}
                  {formatPercent(card.variation)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Price Evolution Chart - Both plans */}
      <div className="bg-white rounded-2xl p-6 border border-storm-foam">
        <h2 className="font-display text-lg font-semibold text-storm-midnight mb-4">
          Evolucion de Precios por Destino
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dce8ef" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#5b7a8f' }}
                tickLine={false}
                axisLine={{ stroke: '#dce8ef' }}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#5b7a8f' }}
                tickLine={false}
                axisLine={{ stroke: '#dce8ef' }}
                domain={['auto', 'auto']}
                tickFormatter={(v: number) => `$${v.toFixed(2)}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #dce8ef',
                  boxShadow: '0 4px 12px rgba(10,31,51,0.08)',
                  fontSize: '13px',
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}/kg`]}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              />
              <Line type="monotone" dataKey="espana" name="Espana" stroke="#f7c948" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#f7c948' }} />
              <Line type="monotone" dataKey="francia" name="Francia" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
              <Line type="monotone" dataKey="italia" name="Italia" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
              <Line type="monotone" dataKey="promedio" name="Promedio" stroke="#3d5a73" strokeWidth={2} strokeDasharray="6 3" dot={false} activeDot={{ r: 4, fill: '#3d5a73' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plan Chica: Simplified content */}
      {plan === 'chica' && (
        <>
          <PriceComparisonCard />
          <MarketOverviewCard month={month} year={year} />
          <UpgradeBanner />

          {/* Locked sections preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LockedOverlay title="Ranking de Empresas Exportadoras" />
            <LockedOverlay title="Desglose por Calibre" />
          </div>
        </>
      )}

      {/* Plan Grande: Full content */}
      {plan === 'grande' && (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Caliber Breakdown Chart */}
            <div className="bg-white rounded-2xl p-6 border border-storm-foam">
              <h2 className="font-display text-lg font-semibold text-storm-midnight mb-4">
                Participacion por Calibre
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={caliberBreakdown} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dce8ef" vertical={false} />
                    <XAxis
                      dataKey="calibre"
                      tick={{ fontSize: 11, fill: '#5b7a8f' }}
                      tickLine={false}
                      axisLine={{ stroke: '#dce8ef' }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#5b7a8f' }}
                      tickLine={false}
                      axisLine={{ stroke: '#dce8ef' }}
                      tickFormatter={(v: number) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #dce8ef',
                        boxShadow: '0 4px 12px rgba(10,31,51,0.08)',
                        fontSize: '13px',
                      }}
                      formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Participacion']}
                    />
                    <Bar dataKey="participacion_pct" name="participacion_pct" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {caliberBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CALIBER_COLORS[index % CALIBER_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Caliber legend */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
                {caliberBreakdown.map((item, i) => (
                  <div key={item.calibre} className="flex items-center gap-2 text-xs text-storm-steel">
                    <span
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: CALIBER_COLORS[i] }}
                    />
                    <span>{item.calibre}</span>
                    <span className="font-mono text-storm-mist">${item.precio_promedio.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination Pie Chart */}
            <div className="bg-white rounded-2xl p-6 border border-storm-foam">
              <h2 className="font-display text-lg font-semibold text-storm-midnight mb-4">
                Analisis por Destino
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DESTINATION_DATA}
                      dataKey="porcentaje"
                      nameKey="destino"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={50}
                      paddingAngle={2}
                      label={({ destino, porcentaje }: any) => `${destino} ${porcentaje}%`}
                      labelLine={{ stroke: '#8aa5b8', strokeWidth: 1 }}
                    >
                      {DESTINATION_DATA.map((_, index) => (
                        <Cell key={`dest-${index}`} fill={DESTINATION_COLORS[index % DESTINATION_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #dce8ef',
                        boxShadow: '0 4px 12px rgba(10,31,51,0.08)',
                        fontSize: '13px',
                      }}
                      formatter={(value: any, name: any) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DESTINATION_DATA.slice(0, 4).map((dest, i) => (
                  <div key={dest.destino} className="flex items-center gap-2 text-xs text-storm-steel">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: DESTINATION_COLORS[i] }} />
                    <span>{dest.destino}</span>
                    <span className="font-mono text-storm-mist">{dest.porcentaje}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Company Ranking Table */}
          <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
            <div className="px-6 py-4 border-b border-storm-foam">
              <h2 className="font-display text-lg font-semibold text-storm-midnight">
                Ranking Empresas Exportadoras
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-storm-midnight text-white">
                    <th className="px-4 py-3 text-left font-medium">#</th>
                    <th className="px-4 py-3 text-left font-medium">Empresa</th>
                    <th
                      className="px-4 py-3 text-right font-medium cursor-pointer hover:text-lightning transition-colors"
                      onClick={() => handleSort('volumen_ton')}
                    >
                      Volumen (t) {sortField === 'volumen_ton' && (sortAsc ? '↑' : '↓')}
                    </th>
                    <th
                      className="px-4 py-3 text-right font-medium cursor-pointer hover:text-lightning transition-colors"
                      onClick={() => handleSort('valor_usd')}
                    >
                      Valor (USD) {sortField === 'valor_usd' && (sortAsc ? '↑' : '↓')}
                    </th>
                    <th
                      className="px-4 py-3 text-right font-medium cursor-pointer hover:text-lightning transition-colors"
                      onClick={() => handleSort('participacion_pct')}
                    >
                      Participacion % {sortField === 'participacion_pct' && (sortAsc ? '↑' : '↓')}
                    </th>
                    <th
                      className="px-4 py-3 text-right font-medium cursor-pointer hover:text-lightning transition-colors"
                      onClick={() => handleSort('variacion_pct')}
                    >
                      Variacion % {sortField === 'variacion_pct' && (sortAsc ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCompanies.map((company, i) => (
                    <tr
                      key={company.empresa}
                      className={cn(
                        'border-b border-storm-foam/60 hover:bg-storm-paper/60 transition-colors',
                        i % 2 === 0 ? 'bg-white' : 'bg-storm-paper/30'
                      )}
                    >
                      <td className="px-4 py-3 font-mono text-storm-mist">{company.position}</td>
                      <td className="px-4 py-3 font-medium text-storm-midnight">{company.empresa}</td>
                      <td className="px-4 py-3 text-right font-mono text-storm-steel">
                        {company.volumen_ton.toLocaleString('en-US')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-storm-steel">
                        {formatUSD(company.valor_usd)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-storm-steel">
                        {company.participacion_pct.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded-full',
                            company.variacion_pct >= 0
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-sunset-storm'
                          )}
                        >
                          {formatPercent(company.variacion_pct)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Export Data Table */}
          <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
            <div className="px-6 py-4 border-b border-storm-foam flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-storm-midnight">
                Datos de Exportacion Detallados
              </h2>
              <button
                onClick={handleExportExcel}
                className="btn-lightning rounded-lg h-9 px-4 text-sm font-semibold inline-flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h8a1 1 0 001-1V4l-3-3H3a1 1 0 00-1 1v9a1 1 0 001 1z" />
                  <path d="M9 1v3h3" />
                  <path d="M7 7v3M5.5 8.5L7 10l1.5-1.5" />
                </svg>
                Exportar Excel
              </button>
            </div>
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
                    <tr
                      key={`${row.empresa}-${row.destino}-${row.calibre}-${i}`}
                      className={cn(
                        'border-b border-storm-foam/60 hover:bg-storm-paper/60 transition-colors',
                        i % 2 === 0 ? 'bg-white' : 'bg-storm-paper/30'
                      )}
                    >
                      <td className="px-4 py-3 text-storm-midnight whitespace-nowrap">{row.producto}</td>
                      <td className="px-4 py-3 text-storm-steel">{row.destino}</td>
                      <td className="px-4 py-3 text-storm-steel whitespace-nowrap">{row.empresa}</td>
                      <td className="px-4 py-3 font-mono text-storm-mist">{row.calibre}</td>
                      <td className="px-4 py-3 text-right font-mono text-storm-steel">
                        {row.volumen_kg.toLocaleString('en-US')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-storm-steel">
                        {formatUSD(row.valor_usd)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-storm-steel">
                        ${row.precio_usd_kg.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={cn(
                            'inline-flex items-center font-mono text-xs font-semibold px-2 py-0.5 rounded-full',
                            row.variacion_pct >= 0
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-sunset-storm'
                          )}
                        >
                          {formatPercent(row.variacion_pct)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 