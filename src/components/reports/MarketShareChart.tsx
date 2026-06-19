'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'
import type { ReportMarketShareRow } from '@/lib/reports/data-types'
import { cn } from '@/lib/cn'

const PALETTE = ['#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#22c55e', '#84cc16', '#eab308', '#f59e0b', '#f97316', '#ef4444']

function formatUSD(n: number): string {
  if (Math.abs(n) >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M'
  if (Math.abs(n) >= 1_000) return '$' + (n / 1_000).toFixed(0) + 'K'
  return '$' + n.toLocaleString('es-CL', { maximumFractionDigits: 0 })
}

interface ChartTooltipPayload {
  payload: { destino: string; valorFobUsd: number; sharePct: number | null; deltaPct: number | null }
  value: number
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: ChartTooltipPayload[] }) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload
  return (
    <div className="bg-white border border-storm-foam rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-storm-midnight">{data.destino}</p>
      <p className="font-mono text-xs text-storm-steel mt-1">{formatUSD(data.valorFobUsd)}</p>
      {data.sharePct !== null && (
        <p className="font-mono text-xs text-storm-mist">{data.sharePct.toFixed(1)}% share</p>
      )}
      {data.deltaPct !== null && (
        <p className={cn('font-mono text-xs mt-1 font-semibold', data.deltaPct >= 0 ? 'text-green-600' : 'text-red-600')}>
          {data.deltaPct >= 0 ? '+' : ''}
          {data.deltaPct.toFixed(1)}% vs. periodo anterior
        </p>
      )}
    </div>
  )
}

export function MarketShareChart({ marketShare }: { marketShare: ReportMarketShareRow[] }) {
  const sorted = [...marketShare].sort((a, b) => b.valorFobUsd - a.valorFobUsd).slice(0, 12)
  const total = marketShare.reduce((sum, r) => sum + r.valorFobUsd, 0)

  return (
    <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
      <div className="px-6 py-4 border-b border-storm-foam flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-semibold text-storm-midnight">
            Market share por destino
          </h3>
          <p className="text-xs text-storm-mist mt-0.5">
            Top {sorted.length} de {marketShare.length} destinos
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-storm-mist">Total exportado</p>
          <p className="font-display text-xl font-bold text-storm-midnight">{formatUSD(total)}</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <ResponsiveContainer width="100%" height={Math.max(280, sorted.length * 32)}>
          <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 8 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="destino"
              width={120}
              tick={{ fill: '#5b7a8f', fontSize: 12, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f6fa' }} />
            <Bar dataKey="valorFobUsd" radius={[0, 8, 8, 0]}>
              {sorted.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
