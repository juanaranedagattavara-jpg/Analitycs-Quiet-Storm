import type { ExportRow } from './types'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export function formatUSD(value: number): string {
  return '$' + Math.round(value).toLocaleString('en-US')
}

export function formatTons(value: number): string {
  return Math.round(value).toLocaleString('en-US') + ' t'
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

export function formatMonthYear(month: number, year: number): string {
  return `${MONTH_NAMES[month - 1] ?? ''} ${year}`
}

const COLUMN_HEADERS: Record<keyof ExportRow, string> = {
  producto: 'Producto',
  destino: 'Destino',
  empresa: 'Empresa',
  calibre: 'Calibre',
  volumen_kg: 'Volumen (kg)',
  valor_usd: 'Valor (USD)',
  precio_usd_kg: 'Precio (USD/kg)',
  variacion_pct: 'Variación (%)',
}

export async function exportToExcel(data: ExportRow[], filename: string): Promise<void> {
  // Dynamic import so xlsx (~600 KB) only ships when the user actually exports.
  const XLSX = await import('xlsx')

  const mapped = data.map((row) => ({
    [COLUMN_HEADERS.producto]: row.producto,
    [COLUMN_HEADERS.destino]: row.destino,
    [COLUMN_HEADERS.empresa]: row.empresa,
    [COLUMN_HEADERS.calibre]: row.calibre,
    [COLUMN_HEADERS.volumen_kg]: row.volumen_kg,
    [COLUMN_HEADERS.valor_usd]: row.valor_usd,
    [COLUMN_HEADERS.precio_usd_kg]: row.precio_usd_kg,
    [COLUMN_HEADERS.variacion_pct]: row.variacion_pct,
  }))

  const ws = XLSX.utils.json_to_sheet(mapped)
  const keys = Object.keys(COLUMN_HEADERS) as Array<keyof ExportRow>
  ws['!cols'] = keys.map((key) => {
    let maxLen = COLUMN_HEADERS[key].length
    for (const row of data) {
      const len = String(row[key] ?? '').length
      if (len > maxLen) maxLen = len
    }
    return { wch: Math.min(maxLen + 2, 40) }
  })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Exportaciones')
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
