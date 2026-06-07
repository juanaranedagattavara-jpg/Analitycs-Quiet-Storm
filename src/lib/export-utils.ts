import * as XLSX from 'xlsx'
import type { ExportRow } from './types'

// ─── Spanish Month Names ────────────────────────────────────────────────────

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

// ─── Formatting Helpers ─────────────────────────────────────────────────────

/** Format a number as USD: "$1,234,567" */
export function formatUSD(value: number): string {
  return '$' + Math.round(value).toLocaleString('en-US')
}

/** Format a number as tons: "1,234 t" */
export function formatTons(value: number): string {
  return Math.round(value).toLocaleString('en-US') + ' t'
}

/** Format a percentage with sign: "+5.2%" or "-3.1%" */
export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

/** Return Spanish month name for 1-based month number */
export function getMonthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? ''
}

/** Format month + year in Spanish: "Junio 2026" */
export function formatMonthYear(month: number, year: number): string {
  return `${getMonthName(month)} ${year}`
}

// ─── Excel Export ───────────────────────────────────────────────────────────

/** Column display names for the export spreadsheet */
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

/**
 * Generate an XLSX Blob from export data.
 * Uses friendly column headers and auto-sized columns.
 */
export function generateExcelBlob(data: ExportRow[], sheetName: string = 'Exportaciones'): Blob {
  // Map data to use display headers
  const mappedData = data.map(row => ({
    [COLUMN_HEADERS.producto]: row.producto,
    [COLUMN_HEADERS.destino]: row.destino,
    [COLUMN_HEADERS.empresa]: row.empresa,
    [COLUMN_HEADERS.calibre]: row.calibre,
    [COLUMN_HEADERS.volumen_kg]: row.volumen_kg,
    [COLUMN_HEADERS.valor_usd]: row.valor_usd,
    [COLUMN_HEADERS.precio_usd_kg]: row.precio_usd_kg,
    [COLUMN_HEADERS.variacion_pct]: row.variacion_pct,
  }))

  const ws = XLSX.utils.json_to_sheet(mappedData)

  // Auto-size columns based on content width
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
  XLSX.utils.book_append_sheet(wb, ws, sheetName)

  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  return new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

// ─── CSV Export ──────────────────────────────────────────────────────────────

/**
 * Generate a CSV Blob from export data.
 * Uses semicolon delimiter (common in Latin America / Excel-friendly).
 */
export function generateCSVBlob(data: ExportRow[]): Blob {
  const headers = Object.values(COLUMN_HEADERS)
  const keys = Object.keys(COLUMN_HEADERS) as Array<keyof ExportRow>

  const lines: string[] = [headers.join(';')]

  for (const row of data) {
    const values = keys.map(k => {
      const val = row[k]
      if (typeof val === 'string') {
        // Escape strings that contain semicolons or quotes
        return `"${val.replace(/"/g, '""')}"`
      }
      return String(val)
    })
    lines.push(values.join(';'))
  }

  // BOM prefix so Excel recognises UTF-8
  const bom = '﻿'
  return new Blob([bom + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
}

// ─── Download Trigger (client-side only) ────────────────────────────────────

/**
 * Trigger a browser file download from a Blob.
 * Call this from a client component ('use client').
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── Convenience Wrappers ───────────────────────────────────────────────────

/**
 * Generate and download an XLSX file.
 * Must be called from the browser (client component).
 */
export function exportToExcel(data: ExportRow[], filename: string): void {
  const blob = generateExcelBlob(data, 'Exportaciones')
  downloadBlob(blob, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`)
}

/**
 * Generate and download a CSV file.
 * Must be called from the browser (client component).
 */
export function exportToCSV(data: ExportRow[], filename: string): void {
  const blob = generateCSVBlob(data)
  downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`)
}
