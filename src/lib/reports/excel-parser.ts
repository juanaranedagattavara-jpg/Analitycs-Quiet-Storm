import * as XLSX from 'xlsx'
import type {
  ReportData,
  ReportKPI,
  ReportRankingRow,
  ReportMarketShareRow,
  ReportCalibreRow,
} from './data-types'

type Row = Record<string, unknown>

function normalizeKey(s: string): string {
  return s
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s_-]+/g, '')
}

function toNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null
  if (typeof v === 'number' && Number.isFinite(v)) return v
  const s = String(v).trim().replace(/[^\d.,\-+%]/g, '').replace('%', '').replace(',', '.')
  if (!s) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

function toString(v: unknown): string {
  if (v === null || v === undefined) return ''
  return String(v).trim()
}

function getField(row: Row, candidates: string[]): unknown {
  const keys = Object.keys(row)
  for (const c of candidates) {
    const cn = normalizeKey(c)
    const k = keys.find((kk) => normalizeKey(kk) === cn)
    if (k !== undefined) return row[k]
  }
  return undefined
}

function findSheet(wb: XLSX.WorkBook, candidates: string[]): XLSX.WorkSheet | null {
  const names = wb.SheetNames
  for (const c of candidates) {
    const cn = normalizeKey(c)
    const match = names.find((n) => normalizeKey(n) === cn)
    if (match) return wb.Sheets[match]
  }
  return null
}

function rowsOf(sheet: XLSX.WorkSheet): Row[] {
  return XLSX.utils.sheet_to_json<Row>(sheet, { defval: null, raw: true })
}

function parseKPIs(wb: XLSX.WorkBook): ReportKPI[] | undefined {
  const sheet = findSheet(wb, ['KPIs', 'KPI', 'Indicadores', 'Resumen Numerico'])
  if (!sheet) return undefined
  const rows = rowsOf(sheet)
  const out: ReportKPI[] = []
  for (const row of rows) {
    const label = toString(getField(row, ['label', 'indicador', 'nombre', 'kpi']))
    const value = toNumber(getField(row, ['value', 'valor']))
    const unit = toString(getField(row, ['unit', 'unidad'])) || ''
    const delta = toNumber(getField(row, ['delta_pct', 'deltapct', 'variacion', 'variacionpct', 'delta', 'var']))
    if (!label || value === null) continue
    out.push({ label, value, unit, deltaPct: delta })
  }
  return out.length ? out : undefined
}

function parseRanking(wb: XLSX.WorkBook): ReportRankingRow[] | undefined {
  const sheet = findSheet(wb, ['Ranking', 'RankingEmpresas', 'Ranking Empresas', 'Empresas'])
  if (!sheet) return undefined
  const rows = rowsOf(sheet)
  const out: ReportRankingRow[] = []
  for (const row of rows) {
    const empresa = toString(getField(row, ['empresa', 'compañia', 'compania', 'company', 'nombre']))
    const valor = toNumber(getField(row, ['valor_fob_usd', 'valorfobusd', 'valor', 'fob', 'usdfob', 'usd_fob', 'monto', 'valorfob']))
    const share = toNumber(getField(row, ['share_pct', 'sharepct', 'share', 'participacion', 'part']))
    const delta = toNumber(getField(row, ['delta_pct', 'deltapct', 'variacion', 'delta', 'var']))
    if (!empresa || valor === null) continue
    out.push({ empresa, valorFobUsd: valor, sharePct: share, deltaPct: delta })
  }
  return out.length ? out : undefined
}

function parseMarketShare(wb: XLSX.WorkBook): ReportMarketShareRow[] | undefined {
  const sheet = findSheet(wb, ['MarketShare', 'Market Share', 'Destinos', 'Mercados', 'RankingDestinos'])
  if (!sheet) return undefined
  const rows = rowsOf(sheet)
  const out: ReportMarketShareRow[] = []
  for (const row of rows) {
    const destino = toString(getField(row, ['destino', 'pais', 'mercado', 'country']))
    const valor = toNumber(getField(row, ['valor_fob_usd', 'valorfobusd', 'valor', 'fob', 'usdfob', 'usd_fob', 'monto']))
    const share = toNumber(getField(row, ['share_pct', 'sharepct', 'share', 'participacion']))
    const delta = toNumber(getField(row, ['delta_pct', 'deltapct', 'variacion', 'delta', 'var']))
    if (!destino || valor === null) continue
    out.push({ destino, valorFobUsd: valor, sharePct: share, deltaPct: delta })
  }
  return out.length ? out : undefined
}

function parseCalibres(wb: XLSX.WorkBook): ReportCalibreRow[] | undefined {
  const sheet = findSheet(wb, ['Calibres', 'Calibre', 'Tallas'])
  if (!sheet) return undefined
  const rows = rowsOf(sheet)
  const out: ReportCalibreRow[] = []
  for (const row of rows) {
    const calibre = toString(getField(row, ['calibre', 'talla', 'tamano', 'size']))
    const volumen = toNumber(getField(row, ['volumen_kg', 'volumenkg', 'volumen', 'kg', 'cantidad']))
    const precio = toNumber(getField(row, ['precio_fob_usd', 'preciofobusd', 'precio', 'usdkg', 'usd_kg', 'fobkg']))
    const delta = toNumber(getField(row, ['delta_pct', 'deltapct', 'variacion', 'delta', 'var']))
    if (!calibre || volumen === null || precio === null) continue
    out.push({ calibre, volumenKg: volumen, precioFobUsd: precio, deltaPct: delta })
  }
  return out.length ? out : undefined
}

function parseResumen(wb: XLSX.WorkBook): string | undefined {
  const sheet = findSheet(wb, ['Resumen', 'Resumen Ejecutivo', 'Summary', 'Executive'])
  if (!sheet) return undefined
  const arr = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null })
  const lines: string[] = []
  for (const row of arr) {
    if (!Array.isArray(row)) continue
    for (const cell of row) {
      const s = toString(cell)
      if (s) lines.push(s)
    }
  }
  const text = lines.join('\n').trim()
  return text ? text : undefined
}

export function parseReportExcel(buffer: ArrayBuffer | Buffer): ReportData {
  const wb = XLSX.read(buffer, { type: 'buffer' })
  return {
    resumen: parseResumen(wb),
    kpis: parseKPIs(wb),
    ranking: parseRanking(wb),
    marketShare: parseMarketShare(wb),
    calibres: parseCalibres(wb),
  }
}
