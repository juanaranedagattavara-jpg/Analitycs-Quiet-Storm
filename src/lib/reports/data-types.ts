export interface ReportKPI {
  label: string
  value: number
  unit: string
  deltaPct: number | null
}

export interface ReportRankingRow {
  empresa: string
  valorFobUsd: number
  sharePct: number | null
  deltaPct: number | null
}

export interface ReportMarketShareRow {
  destino: string
  valorFobUsd: number
  sharePct: number | null
  deltaPct: number | null
}

export interface ReportCalibreRow {
  calibre: string
  volumenKg: number
  precioFobUsd: number
  deltaPct: number | null
}

export interface ReportData {
  resumen?: string
  kpis?: ReportKPI[]
  ranking?: ReportRankingRow[]
  marketShare?: ReportMarketShareRow[]
  calibres?: ReportCalibreRow[]
}

export function isReportData(value: unknown): value is ReportData {
  if (value === null || typeof value !== 'object') return false
  return true
}

export function hasAnyBlock(data: ReportData | null | undefined): boolean {
  if (!data) return false
  return Boolean(
    data.resumen ||
      (data.kpis && data.kpis.length) ||
      (data.ranking && data.ranking.length) ||
      (data.marketShare && data.marketShare.length) ||
      (data.calibres && data.calibres.length),
  )
}
