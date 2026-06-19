'use client'

import type { ReportKPI } from '@/lib/reports/data-types'
import { cn } from '@/lib/cn'

function formatNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B'
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M'
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString('es-CL', { maximumFractionDigits: 2 })
}

function DeltaPill({ delta }: { delta: number | null }) {
  if (delta === null || delta === undefined) return null
  const isUp = delta >= 0
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
        isUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
      )}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        {isUp ? (
          <path d="M5 2l3 4H2l3-4z" fill="currentColor" />
        ) : (
          <path d="M5 8l3-4H2l3 4z" fill="currentColor" />
        )}
      </svg>
      {isUp ? '+' : ''}
      {delta.toFixed(1)}%
    </span>
  )
}

export function KPIGrid({ kpis }: { kpis: ReportKPI[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <div
          key={`${kpi.label}-${i}`}
          className="relative bg-white rounded-2xl border border-storm-foam p-5 overflow-hidden card-lift"
        >
          <div
            aria-hidden
            className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full bg-gradient-to-br from-lightning/10 to-transparent"
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-storm-mist mb-3 relative">
            {kpi.label}
          </p>
          <div className="flex items-baseline gap-2 relative">
            <span className="font-display text-3xl lg:text-4xl font-bold text-storm-midnight">
              {formatNumber(kpi.value)}
            </span>
            {kpi.unit && (
              <span className="text-sm text-storm-fog font-medium">{kpi.unit}</span>
            )}
          </div>
          <div className="mt-3 relative">
            <DeltaPill delta={kpi.deltaPct} />
          </div>
        </div>
      ))}
    </div>
  )
}
