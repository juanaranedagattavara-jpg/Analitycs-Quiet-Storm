'use client'

import { useState } from 'react'
import type { ReportRankingRow } from '@/lib/reports/data-types'
import { cn } from '@/lib/cn'

function formatUSD(n: number): string {
  if (Math.abs(n) >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
  if (Math.abs(n) >= 1_000) return '$' + (n / 1_000).toFixed(1) + 'K'
  return '$' + n.toLocaleString('es-CL', { maximumFractionDigits: 0 })
}

function DeltaCell({ delta }: { delta: number | null }) {
  if (delta === null) return <span className="text-storm-fog">—</span>
  const isUp = delta >= 0
  return (
    <span className={cn('font-mono text-xs font-semibold', isUp ? 'text-green-600' : 'text-red-600')}>
      {isUp ? '+' : ''}
      {delta.toFixed(1)}%
    </span>
  )
}

export function RankingTable({ ranking }: { ranking: ReportRankingRow[] }) {
  const [showAll, setShowAll] = useState(false)
  const max = Math.max(...ranking.map((r) => r.valorFobUsd))
  const visible = showAll ? ranking : ranking.slice(0, 10)

  return (
    <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
      <div className="px-6 py-4 border-b border-storm-foam flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-storm-midnight">
            Ranking de empresas
          </h3>
          <p className="text-xs text-storm-mist mt-0.5">
            Top {visible.length} de {ranking.length} empresas exportadoras
          </p>
        </div>
        {ranking.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-semibold text-storm-midnight hover:text-lightning transition-colors"
          >
            {showAll ? 'Ver top 10' : 'Ver todas →'}
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-storm-paper">
            <tr>
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-storm-mist py-3 px-6 w-12">#</th>
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-storm-mist py-3 px-4">Empresa</th>
              <th className="text-right font-mono text-[10px] uppercase tracking-wider text-storm-mist py-3 px-4">Valor FOB</th>
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-storm-mist py-3 px-4 hidden md:table-cell">Participación</th>
              <th className="text-right font-mono text-[10px] uppercase tracking-wider text-storm-mist py-3 px-6">Var.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-storm-foam">
            {visible.map((row, i) => (
              <tr key={`${row.empresa}-${i}`} className="hover:bg-storm-paper/50 transition-colors">
                <td className="py-3 px-6">
                  <span
                    className={cn(
                      'inline-flex items-center justify-center w-7 h-7 rounded-lg font-mono text-xs font-bold',
                      i === 0 && 'bg-amber-100 text-amber-700',
                      i === 1 && 'bg-slate-200 text-slate-700',
                      i === 2 && 'bg-orange-100 text-orange-700',
                      i > 2 && 'bg-storm-paper text-storm-steel',
                    )}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-storm-midnight">{row.empresa}</td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-storm-midnight">
                  {formatUSD(row.valorFobUsd)}
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <div className="flex items-center gap-2 max-w-[180px]">
                    <div className="flex-1 h-2 bg-storm-paper rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-lightning to-lightning/70 rounded-full"
                        style={{ width: `${(row.valorFobUsd / max) * 100}%` }}
                      />
                    </div>
                    {row.sharePct !== null && (
                      <span className="font-mono text-xs text-storm-steel min-w-[3rem] text-right">
                        {row.sharePct.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-6 text-right">
                  <DeltaCell delta={row.deltaPct} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
