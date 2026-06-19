'use client'

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import type { ReportCalibreRow } from '@/lib/reports/data-types'
import { cn } from '@/lib/cn'

function formatKg(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M kg'
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(0) + 'K kg'
  return n.toLocaleString('es-CL', { maximumFractionDigits: 0 }) + ' kg'
}

interface ChartTooltipPayload {
  payload: ReportCalibreRow
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: ChartTooltipPayload[] }) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload
  return (
    <div className="bg-white border border-storm-foam rounded-xl shadow-lg px-4 py-3 text-sm space-y-1">
      <p className="font-semibold text-storm-midnight">Calibre {data.calibre}</p>
      <p className="font-mono text-xs text-storm-steel">{formatKg(data.volumenKg)}</p>
      <p className="font-mono text-xs text-storm-steel">${data.precioFobUsd.toFixed(2)} USD/kg</p>
      {data.deltaPct !== null && (
        <p className={cn('font-mono text-xs mt-1 font-semibold', data.deltaPct >= 0 ? 'text-green-600' : 'text-red-600')}>
          {data.deltaPct >= 0 ? '+' : ''}
          {data.deltaPct.toFixed(1)}% vs. periodo anterior
        </p>
      )}
    </div>
  )
}

export function CalibresChart({ calibres }: { calibres: ReportCalibreRow[] }) {
  return (
    <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
      <div className="px-6 py-4 border-b border-storm-foam">
        <h3 className="font-display text-lg font-semibold text-storm-midnight">
          Análisis de calibres
        </h3>
        <p className="text-xs text-storm-mist mt-0.5">
          Volumen exportado y precio FOB por calibre
        </p>
      </div>

      <div className="px-6 py-6">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={calibres} margin={{ top: 8, right: 20, bottom: 4, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5edf3" vertical={false} />
            <XAxis
              dataKey="calibre"
              tick={{ fill: '#5b7a8f', fontSize: 12, fontFamily: 'var(--font-mono)' }}
              axisLine={{ stroke: '#cfd9e2' }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toString())}
              tick={{ fill: '#8aa5b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(v) => `$${v.toFixed(1)}`}
              tick={{ fill: '#8aa5b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f6fa' }} />
            <Legend
              wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#5b7a8f' }}
              iconType="circle"
            />
            <Bar yAxisId="left" dataKey="volumenKg" name="Volumen (kg)" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="precioFobUsd"
              name="Precio FOB ($/kg)"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: '#f59e0b', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
