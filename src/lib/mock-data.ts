import type {
  MonthOption, MonthlyKPI, PricePoint, CompanyRanking, CaliberBreakdown,
  ExportRow, Report, DestinationData, ProductRanking, DashboardData, Plan,
} from './types'

const MN = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const MA = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function sr(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function jt(base: number, pct: number, seed: number): number {
  return base * (1 + (sr(seed) - 0.5) * 2 * pct)
}

const SV = [1.15, 1.10, 0.95, 0.82, 0.70, 0.65, 0.62, 0.68, 0.78, 1.00, 1.18, 1.22]
const SP = [0.94, 0.96, 1.00, 1.04, 1.08, 1.10, 1.12, 1.09, 1.04, 1.00, 0.95, 0.92]

export const monthOptions: MonthOption[] = (() => {
  const o: MonthOption[] = []
  for (let y = 2025; y <= 2026; y++) {
    const e = y === 2026 ? 6 : 12
    for (let m = 1; m <= e; m++)
      o.push({ value: `${y}-${String(m).padStart(2, '0')}`, label: `${MN[m - 1]} ${y}` })
  }
  return o
})()

// ─── REAL DATA: Company rankings from client Excel files ────────────────────

interface RCD {
  empresa: string
  tons: number
  precio: number
  share: number
  cal: Record<string, { t: number; p: number }>
}

const REB: RCD[] = [
  { empresa: 'St. Andrews Smoky Delicacies', tons: 8600.4, precio: 3.35, share: 17.4,
    cal: { CA0: { t: 226.7, p: 3.66 }, CA1: { t: 2044.1, p: 3.51 }, CA2: { t: 3674.1, p: 3.35 }, CA3: { t: 2485.1, p: 3.15 }, CA4: { t: 170.4, p: 2.56 } } },
  { empresa: 'Landes Chile', tons: 6653.0, precio: 3.01, share: 13.5,
    cal: { CA0: { t: 190.8, p: 2.30 }, CA1: { t: 1711.7, p: 3.31 }, CA2: { t: 2482.9, p: 3.05 }, CA3: { t: 2267.7, p: 2.72 }, CA4: { t: 0, p: 0 } } },
  { empresa: 'Camanchaca', tons: 5842.7, precio: 2.84, share: 11.8,
    cal: { CA0: { t: 94.0, p: 2.25 }, CA1: { t: 1716.0, p: 2.92 }, CA2: { t: 2940.4, p: 2.91 }, CA3: { t: 1092.2, p: 2.63 }, CA4: { t: 0, p: 0 } } },
  { empresa: 'ICatalunya', tons: 5841.3, precio: 2.79, share: 11.8,
    cal: { CA0: { t: 403.9, p: 2.75 }, CA1: { t: 1347.2, p: 2.93 }, CA2: { t: 2200.2, p: 2.85 }, CA3: { t: 1728.2, p: 2.68 }, CA4: { t: 161.8, p: 2.32 } } },
  { empresa: 'RiaAustral', tons: 5206.7, precio: 3.06, share: 10.6,
    cal: { CA0: { t: 79.0, p: 3.38 }, CA1: { t: 846.6, p: 3.25 }, CA2: { t: 2171.2, p: 3.16 }, CA3: { t: 2099.8, p: 2.77 }, CA4: { t: 10.2, p: 4.00 } } },
  { empresa: 'BlueShell', tons: 4695.2, precio: 3.29, share: 9.5,
    cal: { CA0: { t: 24.7, p: 3.57 }, CA1: { t: 1762.8, p: 3.33 }, CA2: { t: 2190.1, p: 3.37 }, CA3: { t: 717.7, p: 2.89 }, CA4: { t: 0, p: 0 } } },
  { empresa: 'Inversiones Coihuin', tons: 4663.1, precio: 3.06, share: 9.5,
    cal: { CA0: { t: 88.0, p: 2.58 }, CA1: { t: 482.8, p: 3.45 }, CA2: { t: 2110.0, p: 3.11 }, CA3: { t: 1893.8, p: 2.88 }, CA4: { t: 88.5, p: 2.42 } } },
  { empresa: 'Sudmaris', tons: 4609.3, precio: 2.92, share: 9.3,
    cal: { CA0: { t: 199.7, p: 1.85 }, CA1: { t: 631.3, p: 3.44 }, CA2: { t: 1891.6, p: 3.07 }, CA3: { t: 1631.7, p: 2.87 }, CA4: { t: 255.0, p: 2.24 } } },
  { empresa: 'Toralla', tons: 2123.8, precio: 3.37, share: 4.3,
    cal: { CA0: { t: 20.8, p: 0.80 }, CA1: { t: 958.2, p: 3.64 }, CA2: { t: 840.6, p: 3.30 }, CA3: { t: 217.2, p: 2.97 }, CA4: { t: 87.1, p: 2.46 } } },
  { empresa: 'Pesbasa', tons: 1098.8, precio: 3.37, share: 2.2,
    cal: { CA0: { t: 81.3, p: 2.26 }, CA1: { t: 402.9, p: 3.72 }, CA2: { t: 430.4, p: 3.40 }, CA3: { t: 184.2, p: 3.14 }, CA4: { t: 0, p: 0 } } },
]

// ─── REAL DATA: Product rankings ────────────────────────────────────────────

interface RPE { empresa: string; tons: number; precio: number; share: number }

const RC: RPE[] = [
  { empresa: 'ICatalunya', tons: 2024.2, precio: 2.61, share: 18.8 },
  { empresa: 'Sudmaris', tons: 1600.5, precio: 3.03, share: 14.8 },
  { empresa: 'BlueShell', tons: 1142.7, precio: 3.25, share: 10.6 },
  { empresa: 'RiaAustral', tons: 1138.3, precio: 3.33, share: 10.5 },
  { empresa: 'Camanchaca', tons: 1109.3, precio: 2.74, share: 10.3 },
  { empresa: 'Landes Chile', tons: 993.6, precio: 2.75, share: 9.2 },
  { empresa: 'St. Andrews Smoky Delicacies', tons: 973.8, precio: 3.20, share: 9.0 },
  { empresa: 'Inversiones Coihuin', tons: 943.1, precio: 3.22, share: 8.7 },
  { empresa: 'Toralla', tons: 628.6, precio: 3.38, share: 5.8 },
  { empresa: 'Pesbasa', tons: 239.4, precio: 2.80, share: 2.2 },
]

const RE: RPE[] = [
  { empresa: 'St. Andrews Smoky Delicacies', tons: 2223.6, precio: 2.43, share: 20.9 },
  { empresa: 'Pacific Gold', tons: 1997.3, precio: 2.10, share: 18.8 },
  { empresa: 'BlueShell', tons: 1893.3, precio: 2.54, share: 17.8 },
  { empresa: 'Camanchaca', tons: 1819.1, precio: 2.41, share: 17.1 },
  { empresa: 'Sudmaris', tons: 1050.9, precio: 2.16, share: 9.9 },
  { empresa: 'Pesbasa', tons: 780.3, precio: 2.07, share: 7.3 },
  { empresa: 'RiaAustral', tons: 583.6, precio: 2.00, share: 5.5 },
  { empresa: 'Inversiones Coihuin', tons: 234.6, precio: 2.01, share: 2.2 },
]

const RMV: RPE[] = [
  { empresa: 'Toralla', tons: 886.5, precio: 4.15, share: 34.1 },
  { empresa: 'Sudmaris', tons: 429.2, precio: 4.93, share: 16.5 },
  { empresa: 'Bagamar', tons: 336.4, precio: 4.21, share: 13.0 },
  { empresa: 'St. Andrews Smoky Delicacies', tons: 266.8, precio: 5.32, share: 10.3 },
  { empresa: 'RiaAustral', tons: 226.4, precio: 4.02, share: 8.7 },
  { empresa: 'BlueShell', tons: 132.0, precio: 4.64, share: 5.1 },
  { empresa: 'GM Chauquear', tons: 131.4, precio: 4.78, share: 5.1 },
  { empresa: 'Pesbasa', tons: 69.6, precio: 4.61, share: 2.7 },
  { empresa: 'ICatalunya', tons: 68.4, precio: 4.49, share: 2.6 },
  { empresa: 'Inversiones Coihuin', tons: 49.3, precio: 5.08, share: 1.9 },
]

// ─── REAL DATA: Monthly exports by destination ──────────────────────────────

interface DM { destino: string; mt: number[]; at: number }

const DMS: DM[] = [
  { destino: 'Francia', mt: [367.2,337.2,267.2,558.9,695.5,533.9,318.7,898.2,828.9,821.7,397.6,198.6], at: 6223.5 },
  { destino: 'Espana', mt: [276.6,351.7,468.7,681.0,708.4,646.1,882.7,830.0,605.6,416.7,225.4,70.1], at: 6163.0 },
  { destino: 'Rusia', mt: [112.1,437.9,160.0,243.2,152.5,445.0,986.0,679.8,459.0,412.9,424.0,228.0], at: 4740.5 },
  { destino: 'Italia', mt: [362.8,308.0,230.8,496.8,438.3,367.7,493.5,405.2,446.4,335.5,396.4,88.2], at: 4369.5 },
  { destino: 'Inglaterra', mt: [174.3,95.5,66.0,165.9,185.2,220.2,241.7,146.0,190.5,289.3,230.6,47.7], at: 2052.8 },
  { destino: 'Argentina', mt: [110.6,121.0,180.5,181.5,203.2,60.0,154.6,56.0,152.3,113.6,32.5,52.7], at: 1418.5 },
  { destino: 'Holanda', mt: [187.2,51.2,68.7,49.0,133.3,99.6,156.0,363.9,100.0,60.1,43.2,20.0], at: 1332.2 },
  { destino: 'Ucrania', mt: [158.4,136.0,94.0,164.5,164.0,95.8,72.1,24.0,48.0,48.0,46.6,71.6], at: 1123.1 },
  { destino: 'Belgica', mt: [64.5,67.6,86.5,84.1,170.8,103.7,70.9,82.7,72.3,76.5,67.2,24.0], at: 970.8 },
  { destino: 'Tailandia', mt: [21.0,22.0,0,112.0,44.0,98.0,136.0,90.0,156.0,30.0,86.0,116.0], at: 911.0 },
  { destino: 'Grecia', mt: [71.0,82.0,125.6,24.0,130.0,67.3,106.0,99.6,17.0,35.0,23.0,58.8], at: 839.2 },
  { destino: 'Australia', mt: [122.8,79.5,84.0,20.2,43.4,61.5,26.5,108.2,61.0,84.4,42.6,21.4], at: 755.5 },
  { destino: 'EE.UU.', mt: [54.7,34.0,35.0,99.2,65.0,52.1,26.3,21.1,126.1,86.0,77.7,67.2], at: 744.3 },
  { destino: 'Brasil', mt: [132.9,95.4,23.0,119.4,41.0,40.0,23.0,34.5,46.5,0,116.3,19.8], at: 691.8 },
  { destino: 'Alemania', mt: [4.0,10.0,71.1,77.0,102.9,106.0,48.1,63.2,105.6,42.7,0,23.9], at: 654.5 },
  { destino: 'Japon', mt: [29.8,47.0,9.6,63.2,32.9,75.8,30.0,53.2,32.4,0,5.5,31.0], at: 410.3 },
]

// ─── Derived constants ──────────────────────────────────────────────────────

const TAV = REB.reduce((s, c) => s + c.tons, 0)
const BMV = Math.round(TAV / 12)
const BAP = 3.07

function yg(y: number): number { return 1 + (y - 2025) * 0.04 }
function mi(m: number, y: number): number { return (y - 2025) * 12 + (m - 1) }

const CL: Record<string, string> = {
  CA0: 'CA0 (<100 u/kg)',
  CA1: 'CA1 (100-200 u/kg)',
  CA2: 'CA2 (200-300 u/kg)',
  CA3: 'CA3 (300-500 u/kg)',
  CA4: 'CA4 (500+ u/kg)',
}

// ─── getKPIForMonth ─────────────────────────────────────────────────────────

export function getKPIForMonth(month: number, year: number): MonthlyKPI {
  const i = mi(month, year), sv = SV[month - 1], sp = SP[month - 1], g = yg(year)
  const vol = Math.round(jt(BMV * sv * g, 0.04, i * 7 + 1))
  const ap = parseFloat(jt(BAP * sp, 0.03, i * 7 + 2).toFixed(2))
  const tv = Math.round(vol * ap * 1000)
  const pm = month === 1 ? 12 : month - 1, py = month === 1 ? year - 1 : year
  const pi = mi(pm, py), psv = SV[pm - 1], pg = yg(py)
  const pv = Math.round(jt(BMV * psv * pg, 0.04, pi * 7 + 1))
  const pap = parseFloat(jt(BAP * SP[pm - 1], 0.03, pi * 7 + 2).toFixed(2))
  const ptv = Math.round(pv * pap * 1000)
  const vv = ptv === 0 ? 0 : parseFloat((((tv - ptv) / ptv) * 100).toFixed(1))
  const vvol = pv === 0 ? 0 : parseFloat((((vol - pv) / pv) * 100).toFixed(1))
  const di = month - 1
  const td = DMS[0].mt[di] > DMS[1].mt[di] ? 'Francia' : 'Espana'
  const tc = (month >= 10 || month <= 2) ? 'CA1' : 'CA2'
  return {
    month, year, totalExportValue: tv, totalVolume: vol, avgPrice: ap,
    topDestination: td, topCaliber: tc,
    numCompanies: Math.round(jt(REB.length + 8, 0.07, i * 7 + 3)),
    variationValue: vv, variationVolume: vvol,
  }
}

// ─── getPriceTrend ──────────────────────────────────────────────────────────

export function getPriceTrend(): PricePoint[] {
  const pts: PricePoint[] = []
  for (let y = 2025; y <= 2026; y++) {
    const e = y === 2026 ? 6 : 12
    for (let m = 1; m <= e; m++) {
      const i = mi(m, y), sp = SP[m - 1]
      const es = parseFloat(jt(2.79 * sp, 0.02, i * 11 + 1).toFixed(2))
      const fr = parseFloat(jt(3.35 * sp, 0.02, i * 11 + 2).toFixed(2))
      const it = parseFloat(jt(3.06 * sp, 0.02, i * 11 + 3).toFixed(2))
      pts.push({
        month: `${MA[m - 1]} ${y}`, espana: es, francia: fr, italia: it,
        promedio: parseFloat(((es + fr + it) / 3).toFixed(2)),
      })
    }
  }
  return pts
}

// ─── getCompanyRanking ──────────────────────────────────────────────────────

export function getCompanyRanking(month: number, year: number): CompanyRanking[] {
  const i = mi(month, year), sp = SP[month - 1], g = yg(year)
  const vs = (SV[month - 1] * g) / 12
  const rk: CompanyRanking[] = REB.map((c, j) => {
    const sa = jt(c.share / 100, 0.06, i * 13 + j)
    const v = Math.round(c.tons * vs * (1 + (sr(i * 13 + j + 200) - 0.5) * 0.08))
    const p = parseFloat(jt(c.precio * sp, 0.02, i * 13 + j + 50).toFixed(2))
    return {
      position: 0, empresa: c.empresa, volumen_ton: v,
      valor_usd: Math.round(v * p * 1000),
      participacion_pct: parseFloat((sa * 100).toFixed(1)),
      variacion_pct: parseFloat(((sr(i * 13 + j + 100) - 0.45) * 16).toFixed(1)),
      precio_usd_kg: p,
    }
  })
  rk.sort((a, b) => b.valor_usd - a.valor_usd)
  const ttv = rk.reduce((s, r) => s + r.valor_usd, 0)
  rk.forEach((r, j) => {
    r.position = j + 1
    r.participacion_pct = parseFloat(((r.valor_usd / ttv) * 100).toFixed(1))
  })
  return rk
}

// ─── getCaliberBreakdown ────────────────────────────────────────────────────

export function getCaliberBreakdown(month: number, year: number): CaliberBreakdown[] {
  const i = mi(month, year), sp = SP[month - 1], sv = SV[month - 1], g = yg(year)
  const ct: Record<string, { t: number; wp: number }> = {}
  const cc = ['CA0', 'CA1', 'CA2', 'CA3', 'CA4']
  for (const c of cc) {
    let tt = 0, twp = 0
    for (const co of REB) {
      const d = co.cal[c]
      if (d && d.t > 0) { tt += d.t; twp += d.t * d.p }
    }
    ct[c] = { t: tt, wp: tt > 0 ? twp / tt : 0 }
  }
  const vs = (sv * g) / 12
  const rows: CaliberBreakdown[] = cc.filter(c => ct[c].t > 0).map((c, j) => {
    const b = ct[c]
    const v = Math.round(jt(b.t * vs, 0.05, i * 17 + j))
    const p = parseFloat(jt(b.wp * sp, 0.02, i * 17 + j + 50).toFixed(2))
    return {
      calibre: CL[c] ?? c, volumen_ton: v, valor_usd: Math.round(v * p * 1000),
      precio_promedio: p, participacion_pct: 0,
    }
  })
  const ttv = rows.reduce((s, r) => s + r.valor_usd, 0)
  rows.forEach(r => {
    r.participacion_pct = parseFloat(((r.valor_usd / ttv) * 100).toFixed(1))
  })
  return rows
}

// ─── getDestinationData ─────────────────────────────────────────────────────

export function getDestinationData(month: number, year: number): DestinationData[] {
  const i = mi(month, year), g = yg(year), di = month - 1
  const data: DestinationData[] = DMS.map((d, j) => {
    const v = Math.round(jt(d.mt[di] * g, 0.05, i * 19 + j))
    const pi = di === 0 ? 11 : di - 1
    const pv = Math.round(jt(d.mt[pi] * g, 0.05, (i - 1) * 19 + j))
    return {
      destino: d.destino, volumen_ton: v, participacion_pct: 0,
      variacion_pct: pv === 0 ? 0 : parseFloat((((v - pv) / pv) * 100).toFixed(1)),
    }
  })
  const tv = data.reduce((s, d) => s + d.volumen_ton, 0)
  data.forEach(d => {
    d.participacion_pct = parseFloat(((d.volumen_ton / tv) * 100).toFixed(1))
  })
  data.sort((a, b) => b.volumen_ton - a.volumen_ton)
  return data
}

// ─── getProductRankings ─────────────────────────────────────────────────────

export function getProductRankings(month: number, year: number): ProductRanking[] {
  const i = mi(month, year), sp = SP[month - 1], vs = (SV[month - 1] * yg(year)) / 12
  function me(entries: RPE[], so: number) {
    return entries.map((e, j) => ({
      empresa: e.empresa,
      volumen_ton: Math.round(jt(e.tons * vs, 0.06, i * 23 + j + so)),
      precio_usd_kg: parseFloat(jt(e.precio * sp, 0.03, i * 23 + j + so + 100).toFixed(2)),
      participacion_pct: e.share,
    }))
  }
  return [
    { producto: 'Mejillon Congelado Carne', empresas: me(RC, 0) },
    { producto: 'Mejillon Congelado Entero', empresas: me(RE, 300) },
    { producto: 'Mejillon Media Valva', empresas: me(RMV, 600) },
  ]
}

// ─── getExportData ──────────────────────────────────────────────────────────

export function getExportData(month: number, year: number): ExportRow[] {
  const i = mi(month, year), sv = SV[month - 1], sp = SP[month - 1], g = yg(year)
  const rows: ExportRow[] = []
  let rs = i * 1000
  const PL = [
    'Mejillon congelado media concha', 'Mejillon congelado entero',
    'Mejillon congelado carne', 'Mejillon en conserva', 'Mejillon ahumado',
  ]
  const TD = ['Espana', 'Francia', 'Italia', 'Rusia', 'Inglaterra', 'EE.UU.', 'Japon', 'Brasil']
  const co = REB.slice(0, 8)

  for (let ci = 0; ci < co.length; ci++) {
    const c = co[ci], di = ci % TD.length, pi = ci % PL.length
    const ck = Object.keys(c.cal).filter(k => c.cal[k].t > 0)
    const cc = ck[ci % ck.length], cd = c.cal[cc]
    rs++
    const vf = sv * g / 12
    const vk = Math.round(jt(c.tons * vf * 0.15, 0.12, rs) * 1000)
    const pp = parseFloat(jt(cd.p * sp, 0.04, rs + 500).toFixed(2))
    rows.push({
      producto: PL[pi], destino: TD[di], empresa: c.empresa, calibre: cc,
      volumen_kg: vk, valor_usd: Math.round(vk * pp), precio_usd_kg: pp,
      variacion_pct: parseFloat(((sr(rs + 900) - 0.45) * 20).toFixed(1)),
    })
  }

  const ex: [number, number, number, string][] = [
    [0,1,0,'CA1'], [1,0,2,'CA2'], [2,2,1,'CA2'], [3,0,2,'CA3'], [4,1,0,'CA2'],
    [5,3,1,'CA1'], [6,2,2,'CA3'], [7,4,0,'CA2'], [0,5,3,'CA0'], [8,0,4,'CA1'],
    [9,1,0,'CA2'], [1,6,1,'CA3'],
  ]
  for (const [ci2, di2, pi2, cc2] of ex) {
    rs++
    const c = REB[ci2]
    if (!c) continue
    const cd = c.cal[cc2]
    if (!cd || cd.t === 0) continue
    const vf = sv * g / 12
    const vk = Math.round(jt(cd.t * vf * 0.3, 0.15, rs) * 1000)
    const pp = parseFloat(jt(cd.p * sp, 0.04, rs + 500).toFixed(2))
    rows.push({
      producto: PL[pi2], destino: TD[di2], empresa: c.empresa, calibre: cc2,
      volumen_kg: vk, valor_usd: Math.round(vk * pp), precio_usd_kg: pp,
      variacion_pct: parseFloat(((sr(rs + 900) - 0.45) * 20).toFixed(1)),
    })
  }
  return rows
}

// ─── Report Templates (Plan-Differentiated) ────────────────────────────────

interface RT {
  titleFn: (m: string, y: number) => string
  type: Report['type']
  industry: Report['industry']
  descFn: (m: string, y: number) => string
  tags: string[]
  plan: Report['plan']
  size: string
}

const RTG: RT[] = [
  {
    titleFn: (m, y) => `Analisis Estadistico Exportaciones Mejillones - ${m} ${y}`,
    type: 'pdf', industry: 'mitilicultura',
    descFn: (m, y) => `Informe completo de exportaciones de mejillones chilenos ${m} ${y}. Analisis por destino, calibre, empresa y producto.`,
    tags: ['mejillones', 'exportaciones', 'estadisticas', 'mensual'], plan: 'grande', size: '2.4 MB',
  },
  {
    titleFn: (m, y) => `Producto x Destino x Empresa x Calibres - ${m} ${y}`,
    type: 'excel', industry: 'mitilicultura',
    descFn: (m, y) => `Base de datos cruzada completa de exportaciones ${m} ${y}. Tablas dinamicas de volumen y valor.`,
    tags: ['mejillones', 'datos', 'excel', 'cruce'], plan: 'grande', size: '1.8 MB',
  },
  {
    titleFn: (m, y) => `MUSSEL METRICS Dashboard - ${m} ${y}`,
    type: 'dashboard', industry: 'mitilicultura',
    descFn: (m, y) => `Dashboard interactivo con KPIs clave del mercado del mejillon para ${m} ${y}.`,
    tags: ['mejillones', 'dashboard', 'KPI', 'interactivo'], plan: 'grande', size: '—',
  },
  {
    titleFn: (m, y) => `Informe Erizos y Jaibas - ${m} ${y}`,
    type: 'pdf', industry: 'erizos-jaibas',
    descFn: (m, y) => `Analisis mensual de exportaciones de erizos y jaibas ${m} ${y}. Destinos: Japon (92%), EE.UU. y UE.`,
    tags: ['erizos', 'jaibas', 'Japon', 'exportaciones'], plan: 'grande', size: '1.6 MB',
  },
  {
    titleFn: (m, y) => `Ranking Empresas Exportadoras - ${m} ${y}`,
    type: 'excel', industry: 'general',
    descFn: (m, y) => `Ranking de empresas exportadoras de mejillones ${m} ${y}. Participacion, volumen, valor y precio.`,
    tags: ['ranking', 'empresas', 'participacion', 'mercado'], plan: 'grande', size: '980 KB',
  },
  {
    titleFn: (m, y) => `SEAFARM METRICS Dashboard - ${m} ${y}`,
    type: 'dashboard', industry: 'mitilicultura',
    descFn: (m, y) => `Dashboard analitico de produccion y exportacion acuicola ${m} ${y}.`,
    tags: ['acuicultura', 'dashboard', 'produccion', 'rendimiento'], plan: 'grande', size: '—',
  },
  {
    titleFn: (m, y) => `Analisis Competitivo Mensual - ${m} ${y}`,
    type: 'pdf', industry: 'mitilicultura',
    descFn: (m, y) => `Analisis competitivo del mercado exportador de mejillones ${m} ${y}. Carne $2.61-3.38/kg, enteros $2.00-2.54/kg, media valva $4.02-5.32/kg.`,
    tags: ['competitivo', 'precios', 'calibres', 'analisis'], plan: 'grande', size: '1.2 MB',
  },
]

const RTC: RT[] = [
  {
    titleFn: (m, y) => `Mussel Price Check - ${m} ${y}`,
    type: 'price-check', industry: 'mitilicultura',
    descFn: (m, y) => `Resumen de precios FOB del mejillon chileno ${m} ${y}. Rango: $2.79-$3.37/kg.`,
    tags: ['mejillones', 'precios', 'FOB', 'resumen'], plan: 'chica', size: '340 KB',
  },
  {
    titleFn: (m, y) => `Resumen de Precios por Destino - ${m} ${y}`,
    type: 'pdf', industry: 'mitilicultura',
    descFn: (m, y) => `Precios promedio de mejillon congelado por destino ${m} ${y}. 16 mercados principales.`,
    tags: ['precios', 'destinos', 'resumen', 'mercado'], plan: 'chica', size: '520 KB',
  },
  {
    titleFn: (m, y) => `MOSS METRICS Dashboard - ${m} ${y}`,
    type: 'dashboard', industry: 'algas',
    descFn: (m, y) => `Dashboard de inteligencia de mercado para algas y musgos marinos ${m} ${y}.`,
    tags: ['algas', 'musgos', 'dashboard', 'tendencias'], plan: 'chica', size: '—',
  },
  {
    titleFn: (m, y) => `Tendencias de Mercado - ${m} ${y}`,
    type: 'pdf', industry: 'general',
    descFn: (m, y) => `Vision general de tendencias del mercado exportador acuicola ${m} ${y}. Sin desglose competitivo.`,
    tags: ['tendencias', 'mercado', 'general', 'resumen'], plan: 'chica', size: '680 KB',
  },
]

// ─── getReportsForMonth ─────────────────────────────────────────────────────

export function getReportsForMonth(month: number, year: number, plan?: Plan): Report[] {
  const mn = MN[month - 1], pm = String(month).padStart(2, '0')
  let tpls: RT[]
  if (plan === 'chica') tpls = RTC
  else if (plan === 'grande') tpls = RTG
  else tpls = [...RTG, ...RTC]

  return tpls.map((t, i) => ({
    id: `rpt-${year}-${pm}-${plan ?? 'all'}-${i + 1}`,
    title: t.titleFn(mn, year),
    type: t.type,
    industry: t.industry,
    month, year,
    description: t.descFn(mn, year),
    tags: t.tags,
    uploadDate: `${year}-${pm}-${String(Math.min(15 + i, 28)).padStart(2, '0')}`,
    fileSize: t.size,
    plan: t.plan,
  }))
}

// ─── getAllReports ───────────────────────────────────────────────────────────

export function getAllReports(plan?: Plan): Report[] {
  const all: Report[] = []
  for (let y = 2025; y <= 2026; y++) {
    const e = y === 2026 ? 6 : 12
    for (let m = 1; m <= e; m++) all.push(...getReportsForMonth(m, y, plan))
  }
  return all
}

// ─── getDashboardData (plan-aware) ──────────────────────────────────────────

export function getDashboardData(month: number, year: number, plan: Plan): DashboardData {
  const kpi = getKPIForMonth(month, year)
  const pt = getPriceTrend()
  const dest = getDestinationData(month, year)

  if (plan === 'chica') {
    return {
      kpi, priceTrend: pt, destinations: dest,
      companyRanking: null, caliberBreakdown: null, productRankings: null,
    }
  }

  return {
    kpi, priceTrend: pt, destinations: dest,
    companyRanking: getCompanyRanking(month, year),
    caliberBreakdown: getCaliberBreakdown(month, year),
    productRankings: getProductRankings(month, year),
  }
}
