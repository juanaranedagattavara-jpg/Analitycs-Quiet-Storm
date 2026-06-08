'use client'

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
import type { PricePoint, CaliberBreakdown, DestinationData } from '@/lib/types'

const TOOLTIP_STYLE = {
  borderRadius: '12px',
  border: '1px solid #dce8ef',
  boxShadow: '0 4px 12px rgba(10,31,51,0.08)',
  fontSize: '13px',
}

export function VolumeTrendChart({ data }: { data: PricePoint[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dce8ef" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#5b7a8f' }}
            tickLine={false}
            axisLine={{ stroke: '#dce8ef' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#5b7a8f' }}
            tickLine={false}
            axisLine={{ stroke: '#dce8ef' }}
            domain={['auto', 'auto']}
            tickFormatter={(v: number) => `${v.toFixed(0)} t`}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [`${Number(value).toFixed(1)} t`]}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          <Line type="monotone" dataKey="espana" name="España" stroke="#f7c948" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#f7c948' }} />
          <Line type="monotone" dataKey="francia" name="Francia" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
          <Line type="monotone" dataKey="italia" name="Italia" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
          <Line type="monotone" dataKey="promedio" name="Promedio" stroke="#3d5a73" strokeWidth={2} strokeDasharray="6 3" dot={false} activeDot={{ r: 4, fill: '#3d5a73' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const CALIBER_COLORS = ['#f7c948', '#3d5a73', '#5b7a8f', '#8aa5b8', '#b8d0db']

export function CaliberBarChart({ data }: { data: CaliberBreakdown[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dce8ef" vertical={false} />
          <XAxis dataKey="calibre" tick={{ fontSize: 11, fill: '#5b7a8f' }} tickLine={false} axisLine={{ stroke: '#dce8ef' }} />
          <YAxis tick={{ fontSize: 11, fill: '#5b7a8f' }} tickLine={false} axisLine={{ stroke: '#dce8ef' }} tickFormatter={(v: number) => `${v}%`} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Participación']} />
          <Bar dataKey="participacion_pct" name="participacion_pct" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CALIBER_COLORS[index % CALIBER_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const DESTINATION_COLORS = ['#f7c948', '#3b82f6', '#10b981', '#e8754c', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b']

export function DestinationPieChart({ data }: { data: DestinationData[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="participacion_pct"
            nameKey="destino"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            paddingAngle={2}
            label={(props) => {
              const p = props as { destino?: string; participacion_pct?: number }
              return p.destino ? `${p.destino} ${p.participacion_pct ?? 0}%` : ''
            }}
            labelLine={{ stroke: '#8aa5b8', strokeWidth: 1 }}
          >
            {data.map((_, index) => (
              <Cell key={`dest-${index}`} fill={DESTINATION_COLORS[index % DESTINATION_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value, name) => [`${value}%`, String(name)]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export const CHART_COLORS = { caliber: CALIBER_COLORS, destination: DESTINATION_COLORS }
