'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/cn'
import { usePlan } from '@/lib/plan-context'
import {
  getKPI,
  getPriceTrend,
  getCompanyRanking,
  getCaliberBreakdown,
  getExportData,
  getDestinationData,
} from '@/lib/mock-data'
import { formatUSD, formatTons, exportToExcel } from '@/lib/export-utils'
import { CHART_COLORS } from './_components/charts'

// Recharts is ~150 KB gzipped — defer it so the dashboard layout, KPI cards
// and tables paint immediately. ssr:false also avoids the width(-1)/height(-1)
// warnings that ResponsiveContainer emits during static prerender.
const ChartSkeleton = () => (
  <div className="h-72 rounded-xl bg-storm-paper/60 animate-pulse" aria-hidden />
)
const VolumeTrendChart = dynamic(
  () => import('./_components/charts').then((m) => m.VolumeTrendChart),
  { ssr: false, loading: ChartSkeleton }
)
const CaliberBarChart = dynamic(
  () => import('./_components/charts').then((m) => m.CaliberBarChart),
  { ssr: false, loading: ChartSkeleton }
)
const DestinationPieChart = dynamic(
  () => import('./_components/charts').then((m) => m.DestinationPieChart),
  { ssr: false, loading: ChartSkeleton }
)

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
            Accede a rankings de empresas, desglose por calibre, análisis competitivo y todos los informes mensuales.
          </p>
        </div>
        <button className="btn-lightning rounded-xl h-10 px-6 text-sm font-semibold whitespace-nowrap flex-shrink-0">
          Ver planes
        </button>
      </div>
    </div>
  )
}

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

export default function DashboardPage() {
  const { plan } = usePlan()

  const kpi = useMemo(() => getKPI(), [])
  const priceTrend = useMemo(() => getPriceTrend(), [])
  const companies = useMemo(() => getCompanyRanking(), [])
  const calibers = useMemo(() => getCaliberBreakdown(), [])
  const exportData = useMemo(() => getExportData(), [])
  const destinations = useMemo(() => getDestinationData(), [])
  const destinationPie = useMemo(() => destinations.slice(0, 8), [destinations])

  function handleExportExcel() {
    exportToExcel(exportData, 'QSA_Exportaciones_2022.xlsx')
  }

  const kpiCards = [
    { label: 'Valor Total Exportaciones', value: formatUSD(kpi.totalExportValue), unit: 'USD' },
    { label: 'Volumen Total', value: formatTons(kpi.totalVolume), unit: 'toneladas' },
    { label: 'Precio Promedio', value: `$${kpi.avgPrice.toFixed(2)}`, unit: 'USD/kg' },
    {
      label: plan === 'grande' ? 'Empresas Activas' : 'Destino Principal',
      value: plan === 'grande' ? String(kpi.numCompanies) : kpi.topDestination,
      unit: '',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-storm-midnight">
            Dashboard
          </h1>
          <p className="text-sm text-storm-mist mt-1">
            Resumen de exportaciones de mejillón chileno · datos cargados por el cliente
            {plan === 'chica' && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-storm-paper text-storm-steel">
                Plan Empresa Chica
              </span>
            )}
          </p>
          <p className="text-xs text-storm-fog mt-1">
            Ranking anual 2022 · Tendencia mensual diciembre 2015 – noviembre 2016
          </p>
        </div>
        {plan === 'grande' && (
          <button
            onClick={handleExportExcel}
            className="h-10 px-5 rounded-lg bg-storm-midnight text-white text-sm font-medium hover:bg-storm-deep transition-colors flex items-center gap-2 self-start"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14h8a1 1 0 001-1V5l-4-4H4a1 1 0 00-1 1v11a1 1 0 001 1z" />
              <path d="M9 1v4h4" />
              <path d="M8 8v4M6 10l2 2 2-2" />
            </svg>
            Exportar datos
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 border border-storm-foam">
            <p className="text-sm text-storm-mist font-medium">{card.label}</p>
            <p className="text-2xl lg:text-3xl font-bold text-storm-midnight mt-2 font-mono">
              {card.value}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-storm-fog">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-storm-foam">
        <h2 className="font-display text-lg font-semibold text-storm-midnight mb-1">
          Exportaciones por Destino — Toneladas mensuales
        </h2>
        <p className="text-xs text-storm-mist mb-4">
          Dic 2015 – Nov 2016 (datos del cliente)
        </p>
        <VolumeTrendChart data={priceTrend} />
      </div>

      {plan === 'chica' && (
        <>
          <UpgradeBanner />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LockedOverlay title="Ranking de Empresas Exportadoras" />
            <LockedOverlay title="Desglose por Calibre" />
          </div>
        </>
      )}

      {plan === 'grande' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-storm-foam">
              <h2 className="font-display text-lg font-semibold text-storm-midnight mb-1">
                Participación por Calibre
              </h2>
              <p className="text-xs text-storm-mist mb-4">Anual 2022 — Mejillón carne</p>
              <CaliberBarChart data={calibers} />
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
                {calibers.map((item, i) => (
                  <div key={item.calibre} className="flex items-center gap-2 text-xs text-storm-steel">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: CHART_COLORS.caliber[i] }} />
                    <span>{item.calibre}</span>
                    <span className="font-mono text-storm-mist">${item.precio_promedio.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-storm-foam">
              <h2 className="font-display text-lg font-semibold text-storm-midnight mb-1">
                Análisis por Destino
              </h2>
              <p className="text-xs text-storm-mist mb-4">Acumulado dic 2015 – nov 2016</p>
              <DestinationPieChart data={destinationPie} />
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {destinationPie.slice(0, 4).map((dest, i) => (
                  <div key={dest.destino} className="flex items-center gap-2 text-xs text-storm-steel">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: CHART_COLORS.destination[i] }} />
                    <span>{dest.destino}</span>
                    <span className="font-mono text-storm-mist">{dest.participacion_pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
            <div className="px-6 py-4 border-b border-storm-foam">
              <h2 className="font-display text-lg font-semibold text-storm-midnight">
                Ranking Empresas Exportadoras
              </h2>
              <p className="text-xs text-storm-mist mt-1">Anual 2022 · USD FOB</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-storm-midnight text-white">
                    <th className="px-4 py-3 text-left font-medium">#</th>
                    <th className="px-4 py-3 text-left font-medium">Empresa</th>
                    <th className="px-4 py-3 text-right font-medium">Volumen (t)</th>
                    <th className="px-4 py-3 text-right font-medium">Valor (USD)</th>
                    <th className="px-4 py-3 text-right font-medium">Participación %</th>
                    <th className="px-4 py-3 text-right font-medium">Precio promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company, i) => (
                    <tr
                      key={company.empresa}
                      className={cn(
                        'border-b border-storm-foam/60 hover:bg-storm-paper/60 transition-colors',
                        i % 2 === 0 ? 'bg-white' : 'bg-storm-paper/30'
                      )}
                    >
                      <td className="px-4 py-3 font-mono text-storm-mist">{company.position}</td>
                      <td className="px-4 py-3 font-medium text-storm-midnight">{company.empresa}</td>
                      <td className="px-4 py-3 text-right font-mono text-storm-steel">{company.volumen_ton.toLocaleString('en-US')}</td>
                      <td className="px-4 py-3 text-right font-mono text-storm-steel">{formatUSD(company.valor_usd)}</td>
                      <td className="px-4 py-3 text-right font-mono text-storm-steel">{company.participacion_pct.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-right font-mono text-storm-steel">${company.precio_usd_kg?.toFixed(2) ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
            <div className="px-6 py-4 border-b border-storm-foam flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-storm-midnight">
                  Cruce Producto × Destino × Empresa × Calibre
                </h2>
                <p className="text-xs text-storm-mist mt-1">Anual 2022</p>
              </div>
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
                      <td className="px-4 py-3 text-right font-mono text-storm-steel">{row.volumen_kg.toLocaleString('en-US')}</td>
                      <td className="px-4 py-3 text-right font-mono text-storm-steel">{formatUSD(row.valor_usd)}</td>
                      <td className="px-4 py-3 text-right font-mono text-storm-steel">${row.precio_usd_kg.toFixed(2)}</td>
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
