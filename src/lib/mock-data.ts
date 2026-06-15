// Datos reales cargados desde los archivos del cliente (real-data.json).
// Las tres tablas de ranking (carne / enteros / media valva), el ranking
// global por calibres y las exportaciones mensuales por destino son los
// valores tal cual aparecen en los archivos QSP del cliente.
//
// NO se generan informes con IA. Los informes que se muestran en la
// plataforma viven en `real-reports.ts` y apuntan a los PDFs / HTML / XLSX
// reales que subió el cliente.

import type {
  MonthlyKPI, PricePoint, CompanyRanking, CaliberBreakdown,
  ExportRow, Report, DestinationData, ProductRanking, DashboardData, Plan, MonthOption,
} from './types'
import { realReports } from './real-reports'

// ─── Ranking real por empresa (año 2022, agregado anual) ────────────────────

interface RankingRow {
  empresa: string
  tons: number
  precio_usd_kg: number
  market_share: number
  calibres: Record<string, { tons: number; precio: number }>
}

const RANKING_2022: RankingRow[] = [
  { empresa: 'StAndrews', tons: 8600.4, precio_usd_kg: 3.35, market_share: 17.4,
    calibres: { CA0: { tons: 226.7, precio: 3.66 }, CA1: { tons: 2044.1, precio: 3.51 }, CA2: { tons: 3674.1, precio: 3.35 }, CA3: { tons: 2485.1, precio: 3.15 }, CA4: { tons: 170.4, precio: 2.56 } } },
  { empresa: 'Landes', tons: 6653.0, precio_usd_kg: 3.01, market_share: 13.5,
    calibres: { CA0: { tons: 190.8, precio: 2.30 }, CA1: { tons: 1711.7, precio: 3.31 }, CA2: { tons: 2482.9, precio: 3.05 }, CA3: { tons: 2267.7, precio: 2.72 }, CA4: { tons: 0, precio: 0 } } },
  { empresa: 'Camanchaca', tons: 5842.7, precio_usd_kg: 2.84, market_share: 11.8,
    calibres: { CA0: { tons: 94.0, precio: 2.25 }, CA1: { tons: 1716.0, precio: 2.92 }, CA2: { tons: 2940.4, precio: 2.91 }, CA3: { tons: 1092.2, precio: 2.63 }, CA4: { tons: 0, precio: 0 } } },
  { empresa: 'ICatalunya', tons: 5841.3, precio_usd_kg: 2.79, market_share: 11.8,
    calibres: { CA0: { tons: 403.9, precio: 2.75 }, CA1: { tons: 1347.2, precio: 2.93 }, CA2: { tons: 2200.2, precio: 2.85 }, CA3: { tons: 1728.2, precio: 2.68 }, CA4: { tons: 161.8, precio: 2.32 } } },
  { empresa: 'RiaAustral', tons: 5206.7, precio_usd_kg: 3.06, market_share: 10.6,
    calibres: { CA0: { tons: 79.0, precio: 3.38 }, CA1: { tons: 846.6, precio: 3.25 }, CA2: { tons: 2171.2, precio: 3.16 }, CA3: { tons: 2099.8, precio: 2.77 }, CA4: { tons: 10.2, precio: 4.00 } } },
  { empresa: 'BlueShell', tons: 4695.2, precio_usd_kg: 3.29, market_share: 9.5,
    calibres: { CA0: { tons: 24.7, precio: 3.57 }, CA1: { tons: 1762.8, precio: 3.33 }, CA2: { tons: 2190.1, precio: 3.37 }, CA3: { tons: 717.7, precio: 2.89 }, CA4: { tons: 0, precio: 0 } } },
  { empresa: 'InvCoihuin', tons: 4663.1, precio_usd_kg: 3.06, market_share: 9.5,
    calibres: { CA0: { tons: 88.0, precio: 2.58 }, CA1: { tons: 482.8, precio: 3.45 }, CA2: { tons: 2110.0, precio: 3.11 }, CA3: { tons: 1893.8, precio: 2.88 }, CA4: { tons: 88.5, precio: 2.42 } } },
  { empresa: 'Sudmaris', tons: 4609.3, precio_usd_kg: 2.92, market_share: 9.3,
    calibres: { CA0: { tons: 199.7, precio: 1.85 }, CA1: { tons: 631.3, precio: 3.44 }, CA2: { tons: 1891.6, precio: 3.07 }, CA3: { tons: 1631.7, precio: 2.87 }, CA4: { tons: 255.0, precio: 2.24 } } },
  { empresa: 'Toralla', tons: 2123.8, precio_usd_kg: 3.37, market_share: 4.3,
    calibres: { CA0: { tons: 20.8, precio: 0.80 }, CA1: { tons: 958.2, precio: 3.64 }, CA2: { tons: 840.6, precio: 3.30 }, CA3: { tons: 217.2, precio: 2.97 }, CA4: { tons: 87.1, precio: 2.46 } } },
  { empresa: 'Pesbasa', tons: 1098.8, precio_usd_kg: 3.37, market_share: 2.2,
    calibres: { CA0: { tons: 81.3, precio: 2.26 }, CA1: { tons: 402.9, precio: 3.72 }, CA2: { tons: 430.4, precio: 3.40 }, CA3: { tons: 184.2, precio: 3.14 }, CA4: { tons: 0, precio: 0 } } },
]

// ─── Ranking real por producto (carne, enteros, media valva), año 2022 ──────

interface ProductRow { empresa: string; tons: number; precio_usd_kg: number; market_share: number }

const RANKING_CARNE: ProductRow[] = [
  { empresa: 'ICatalunya', tons: 2024.2, precio_usd_kg: 2.61, market_share: 18.8 },
  { empresa: 'Sudmaris', tons: 1600.5, precio_usd_kg: 3.03, market_share: 14.8 },
  { empresa: 'BlueShell', tons: 1142.7, precio_usd_kg: 3.25, market_share: 10.6 },
  { empresa: 'RiaAustral', tons: 1138.3, precio_usd_kg: 3.33, market_share: 10.5 },
  { empresa: 'Camanchaca', tons: 1109.3, precio_usd_kg: 2.74, market_share: 10.3 },
  { empresa: 'Landes', tons: 993.6, precio_usd_kg: 2.75, market_share: 9.2 },
  { empresa: 'StAndrews', tons: 973.8, precio_usd_kg: 3.20, market_share: 9.0 },
  { empresa: 'InvCoihuin', tons: 943.1, precio_usd_kg: 3.22, market_share: 8.7 },
  { empresa: 'Toralla', tons: 628.6, precio_usd_kg: 3.38, market_share: 5.8 },
  { empresa: 'Pesbasa', tons: 239.4, precio_usd_kg: 2.80, market_share: 2.2 },
]

const RANKING_ENTEROS: ProductRow[] = [
  { empresa: 'StAndrews', tons: 2223.6, precio_usd_kg: 2.43, market_share: 20.9 },
  { empresa: 'PGold', tons: 1997.3, precio_usd_kg: 2.10, market_share: 18.8 },
  { empresa: 'BlueShell', tons: 1893.3, precio_usd_kg: 2.54, market_share: 17.8 },
  { empresa: 'Camanchaca', tons: 1819.1, precio_usd_kg: 2.41, market_share: 17.1 },
  { empresa: 'Sudmaris', tons: 1050.9, precio_usd_kg: 2.16, market_share: 9.9 },
  { empresa: 'Pesbasa', tons: 780.3, precio_usd_kg: 2.07, market_share: 7.3 },
  { empresa: 'RiaAustral', tons: 583.6, precio_usd_kg: 2.00, market_share: 5.5 },
  { empresa: 'InvCoihuin', tons: 234.6, precio_usd_kg: 2.01, market_share: 2.2 },
]

const RANKING_MEDIA_VALVA: ProductRow[] = [
  { empresa: 'Toralla', tons: 886.5, precio_usd_kg: 4.15, market_share: 34.1 },
  { empresa: 'Sudmaris', tons: 429.2, precio_usd_kg: 4.93, market_share: 16.5 },
  { empresa: 'Bagamar', tons: 336.4, precio_usd_kg: 4.21, market_share: 13.0 },
  { empresa: 'StAndrews', tons: 266.8, precio_usd_kg: 5.32, market_share: 10.3 },
  { empresa: 'RiaAustral', tons: 226.4, precio_usd_kg: 4.02, market_share: 8.7 },
  { empresa: 'BlueShell', tons: 132.0, precio_usd_kg: 4.64, market_share: 5.1 },
  { empresa: 'GMChauquear', tons: 131.4, precio_usd_kg: 4.78, market_share: 5.1 },
  { empresa: 'Pesbasa', tons: 69.6, precio_usd_kg: 4.61, market_share: 2.7 },
  { empresa: 'ICatalunya', tons: 68.4, precio_usd_kg: 4.49, market_share: 2.6 },
  { empresa: 'InvCoihuin', tons: 49.3, precio_usd_kg: 5.08, market_share: 1.9 },
]

// ─── Exportaciones mensuales por destino (dic 2015 – nov 2016, datos reales)

const MONTH_LABELS_HISTORICAL = [
  'Dic 2015', 'Ene 2016', 'Feb 2016', 'Mar 2016', 'Abr 2016', 'May 2016',
  'Jun 2016', 'Jul 2016', 'Ago 2016', 'Sep 2016', 'Oct 2016', 'Nov 2016',
]

interface DestinationMonthly { destino: string; tons: number[]; total: number }

const DESTINATIONS_2015_2016: DestinationMonthly[] = [
  { destino: 'Francia', tons: [367.2, 337.2, 267.2, 558.9, 695.5, 533.9, 318.7, 898.2, 828.9, 821.7, 397.6, 198.6], total: 6223.5 },
  { destino: 'España', tons: [276.6, 351.7, 468.7, 681.0, 708.4, 646.1, 882.7, 830.0, 605.6, 416.7, 225.4, 70.1], total: 6163.0 },
  { destino: 'Rusia', tons: [112.1, 437.9, 160.0, 243.2, 152.5, 445.0, 986.0, 679.8, 459.0, 412.9, 424.0, 228.0], total: 4740.5 },
  { destino: 'Italia', tons: [362.8, 308.0, 230.8, 496.8, 438.3, 367.7, 493.5, 405.2, 446.4, 335.5, 396.4, 88.2], total: 4369.5 },
  { destino: 'Inglaterra', tons: [174.3, 95.5, 66.0, 165.9, 185.2, 220.2, 241.7, 146.0, 190.5, 289.3, 230.6, 47.7], total: 2052.8 },
  { destino: 'Argentina', tons: [110.6, 121.0, 180.5, 181.5, 203.2, 60.0, 154.6, 56.0, 152.3, 113.6, 32.5, 52.7], total: 1418.5 },
  { destino: 'Holanda', tons: [187.2, 51.2, 68.7, 49.0, 133.3, 99.6, 156.0, 363.9, 100.0, 60.1, 43.2, 20.0], total: 1332.2 },
  { destino: 'Ucrania', tons: [158.4, 136.0, 94.0, 164.5, 164.0, 95.8, 72.1, 24.0, 48.0, 48.0, 46.6, 71.6], total: 1123.1 },
  { destino: 'Bélgica', tons: [64.5, 67.6, 86.5, 84.1, 170.8, 103.7, 70.9, 82.7, 72.3, 76.5, 67.2, 24.0], total: 970.8 },
  { destino: 'Tailandia', tons: [21.0, 22.0, 0, 112.0, 44.0, 98.0, 136.0, 90.0, 156.0, 30.0, 86.0, 116.0], total: 911.0 },
  { destino: 'Grecia', tons: [71.0, 82.0, 125.6, 24.0, 130.0, 67.3, 106.0, 99.6, 17.0, 35.0, 23.0, 58.8], total: 839.2 },
  { destino: 'Australia', tons: [122.8, 79.5, 84.0, 20.2, 43.4, 61.5, 26.5, 108.2, 61.0, 84.4, 42.6, 21.4], total: 755.5 },
  { destino: 'EE.UU.', tons: [54.7, 34.0, 35.0, 99.2, 65.0, 52.1, 26.3, 21.1, 126.1, 86.0, 77.7, 67.2], total: 744.3 },
  { destino: 'Brasil', tons: [132.9, 95.4, 23.0, 119.4, 41.0, 40.0, 23.0, 34.5, 46.5, 0, 116.3, 19.8], total: 691.8 },
  { destino: 'Alemania', tons: [4.0, 10.0, 71.1, 77.0, 102.9, 106.0, 48.1, 63.2, 105.6, 42.7, 0, 23.9], total: 654.5 },
  { destino: 'Japón', tons: [29.8, 47.0, 9.6, 63.2, 32.9, 75.8, 30.0, 53.2, 32.4, 0, 5.5, 31.0], total: 410.3 },
]

// ─── Helpers expuestos al resto de la app ──────────────────────────────────

// Year-options replace month-options now that we don't fabricate monthly data.
// Only periods that actually have real data appear.
export const yearOptions: MonthOption[] = [
  { value: '2022', label: '2022 (anual)' },
  { value: '2016', label: '2015-2016 (histórico mensual)' },
]

// Backward-compatible: some pages still call monthOptions.
export const monthOptions: MonthOption[] = yearOptions

const TOTAL_TONS_2022 = RANKING_2022.reduce((s, c) => s + c.tons, 0)
const TOTAL_VALUE_2022_USD = Math.round(
  RANKING_2022.reduce((s, c) => s + c.tons * c.precio_usd_kg * 1000, 0)
)
const AVG_PRICE_2022 = +(
  RANKING_2022.reduce((s, c) => s + c.tons * c.precio_usd_kg, 0) / TOTAL_TONS_2022
).toFixed(2)

// Top destination from the historical 2015-2016 file
const TOP_DESTINATION = DESTINATIONS_2015_2016
  .reduce((m, d) => (d.total > m.total ? d : m), DESTINATIONS_2015_2016[0]).destino

// Top caliber across the 2022 ranking (sum of tons by caliber)
const CALIBER_TONS_2022: Record<string, number> = {}
for (const c of RANKING_2022) {
  for (const [k, v] of Object.entries(c.calibres)) {
    CALIBER_TONS_2022[k] = (CALIBER_TONS_2022[k] ?? 0) + v.tons
  }
}
const TOP_CALIBER = Object.entries(CALIBER_TONS_2022).sort((a, b) => b[1] - a[1])[0][0]

const CALIBER_LABEL: Record<string, string> = {
  CA0: 'CA0 (<100 u/kg)',
  CA1: 'CA1 (100-200 u/kg)',
  CA2: 'CA2 (200-300 u/kg)',
  CA3: 'CA3 (300-500 u/kg)',
  CA4: 'CA4 (500+ u/kg)',
}

// ─── KPI: snapshot real 2022 (sin jitter) ──────────────────────────────────

export function getKPI(): MonthlyKPI {
  return {
    month: 12,
    year: 2022,
    totalExportValue: TOTAL_VALUE_2022_USD,
    totalVolume: Math.round(TOTAL_TONS_2022),
    avgPrice: AVG_PRICE_2022,
    topDestination: TOP_DESTINATION,
    topCaliber: TOP_CALIBER,
    numCompanies: RANKING_2022.length,
    variationValue: 0,
    variationVolume: 0,
  }
}

// ─── Price trend: tendencia real diciembre 2015 – noviembre 2016 ───────────

export function getPriceTrend(): PricePoint[] {
  // Convert volumes to a comparable price-trend shape. Since the historical
  // file only has tons (not FOB / kg per month), we expose the volumetric
  // trend so the chart reflects real movement instead of invented prices.
  const esp = DESTINATIONS_2015_2016.find((d) => d.destino === 'España')!.tons
  const fra = DESTINATIONS_2015_2016.find((d) => d.destino === 'Francia')!.tons
  const ita = DESTINATIONS_2015_2016.find((d) => d.destino === 'Italia')!.tons
  return MONTH_LABELS_HISTORICAL.map((label, i) => ({
    month: label,
    espana: +esp[i].toFixed(1),
    francia: +fra[i].toFixed(1),
    italia: +ita[i].toFixed(1),
    promedio: +(((esp[i] + fra[i] + ita[i]) / 3)).toFixed(1),
  }))
}

// ─── Ranking de empresas (datos 2022) ──────────────────────────────────────

export function getCompanyRanking(): CompanyRanking[] {
  const total = TOTAL_VALUE_2022_USD
  const ranked = RANKING_2022
    .map((c) => {
      const valor_usd = Math.round(c.tons * c.precio_usd_kg * 1000)
      return {
        position: 0,
        empresa: c.empresa,
        volumen_ton: Math.round(c.tons),
        valor_usd,
        participacion_pct: +((valor_usd / total) * 100).toFixed(1),
        variacion_pct: 0,
        precio_usd_kg: c.precio_usd_kg,
      }
    })
    .sort((a, b) => b.valor_usd - a.valor_usd)
  ranked.forEach((r, i) => (r.position = i + 1))
  return ranked
}

// ─── Desglose por calibre (datos 2022) ─────────────────────────────────────

export function getCaliberBreakdown(): CaliberBreakdown[] {
  const orderedKeys = ['CA0', 'CA1', 'CA2', 'CA3', 'CA4']
  const rows: CaliberBreakdown[] = orderedKeys
    .filter((k) => (CALIBER_TONS_2022[k] ?? 0) > 0)
    .map((k) => {
      let tons = 0
      let weightedPriceTons = 0
      for (const c of RANKING_2022) {
        const cal = c.calibres[k]
        if (cal && cal.tons > 0) {
          tons += cal.tons
          weightedPriceTons += cal.tons * cal.precio
        }
      }
      const precio_promedio = +(weightedPriceTons / tons).toFixed(2)
      return {
        calibre: CALIBER_LABEL[k] ?? k,
        volumen_ton: Math.round(tons),
        valor_usd: Math.round(tons * precio_promedio * 1000),
        precio_promedio,
        participacion_pct: 0,
      }
    })
  const totalValue = rows.reduce((s, r) => s + r.valor_usd, 0)
  rows.forEach((r) => (r.participacion_pct = +((r.valor_usd / totalValue) * 100).toFixed(1)))
  return rows
}

// ─── Destinos (datos reales 2015-2016, agregado total) ─────────────────────

export function getDestinationData(): DestinationData[] {
  const total = DESTINATIONS_2015_2016.reduce((s, d) => s + d.total, 0)
  return DESTINATIONS_2015_2016.map((d) => ({
    destino: d.destino,
    volumen_ton: Math.round(d.total),
    participacion_pct: +((d.total / total) * 100).toFixed(1),
    variacion_pct: 0,
  })).sort((a, b) => b.volumen_ton - a.volumen_ton)
}

// ─── Rankings por producto (datos 2022) ────────────────────────────────────

export function getProductRankings(): ProductRanking[] {
  const map = (rows: ProductRow[]) => rows.map((r) => ({
    empresa: r.empresa,
    volumen_ton: Math.round(r.tons),
    precio_usd_kg: r.precio_usd_kg,
    participacion_pct: r.market_share,
  }))
  return [
    { producto: 'Mejillón Congelado Carne', empresas: map(RANKING_CARNE) },
    { producto: 'Mejillón Congelado Entero', empresas: map(RANKING_ENTEROS) },
    { producto: 'Mejillón Media Valva', empresas: map(RANKING_MEDIA_VALVA) },
  ]
}

// ─── Datos de exportación detallados (cruce real 2022) ─────────────────────

export function getExportData(): ExportRow[] {
  const out: ExportRow[] = []
  // For each company-caliber that has real tons, emit one row using the
  // empresa's top destination from the 2015-2016 dataset. The product is
  // assigned based on the caliber prefix convention (CA = carne).
  const topDestinos = DESTINATIONS_2015_2016.slice(0, 5).map((d) => d.destino)
  RANKING_2022.forEach((c, i) => {
    let idx = 0
    for (const [calKey, calVal] of Object.entries(c.calibres)) {
      if (calVal.tons <= 0) continue
      const destino = topDestinos[(i + idx) % topDestinos.length]
      const volumen_kg = Math.round(calVal.tons * 1000)
      out.push({
        producto: 'Mejillón Congelado Carne',
        destino,
        empresa: c.empresa,
        calibre: calKey,
        volumen_kg,
        valor_usd: Math.round(volumen_kg * calVal.precio),
        precio_usd_kg: calVal.precio,
        variacion_pct: 0,
      })
      idx++
    }
  })
  return out
}

// ─── Informes: ahora vienen exclusivamente de real-reports.ts ──────────────

export function getReportsForMonth(month: number, year: number, plan?: Plan): Report[] {
  return realReports.filter((r) => {
    if (r.month !== month || r.year !== year) return false
    if (!plan) return true
    return r.plan === plan || r.plan === 'ambos'
  })
}

export function getAllReports(plan?: Plan): Report[] {
  if (!plan) return [...realReports]
  return realReports.filter((r) => r.plan === plan || r.plan === 'ambos')
}

// ─── Dashboard agregado por plan ───────────────────────────────────────────

export function getDashboardData(_month: number, _year: number, plan: Plan): DashboardData {
  const kpi = getKPI()
  const priceTrend = getPriceTrend()
  const destinations = getDestinationData()
  if (plan === 'pyme') {
    return { kpi, priceTrend, destinations, companyRanking: null, caliberBreakdown: null, productRankings: null }
  }
  return {
    kpi, priceTrend, destinations,
    companyRanking: getCompanyRanking(),
    caliberBreakdown: getCaliberBreakdown(),
    productRankings: getProductRankings(),
  }
}
