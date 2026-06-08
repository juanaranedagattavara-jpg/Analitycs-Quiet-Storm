import type { Report } from './types'

// Real reports uploaded by the client. These are the ONLY informes shown in
// the platform. No AI-generated reports are mixed in. The actual files live
// in /public/informes/ and are served directly.
//
// Files (kept in /public/informes):
//   - IcexErizos_20200223.pdf
//   - lp1102ImpChi.pdf
//   - qsp_202001_OvwToralla.pdf
//   - SEAFARMMETRICS_202502.html
//   - InvCoihuin_MMD9.html
//   - qsp_201701_A_zppo.xlsx
//   - qsp_202401_EaKb_JU_A.xlsx
//   - qsp_202401_ProdDestEmprCalibres_A.xlsx

export interface RealReport extends Report {
  file: string
}

export const realReports: RealReport[] = [
  {
    id: 'icex-erizos-202002',
    title: 'ICEX – Estudio Erizos (Chile)',
    type: 'pdf',
    industry: 'erizos-jaibas',
    month: 2,
    year: 2020,
    description:
      'Estudio del sector erizos elaborado por ICEX (Instituto Español de Comercio Exterior). Mercado, destinos y posicionamiento.',
    tags: ['erizos', 'icex', 'mercado', 'chile'],
    uploadDate: '2020-02-23',
    fileSize: '703 KB',
    plan: 'ambos',
    file: '/informes/IcexErizos_20200223.pdf',
  },
  {
    id: 'lp1102-impchi',
    title: 'LP 1102 – Importaciones Chile',
    type: 'pdf',
    industry: 'general',
    month: 1,
    year: 2020,
    description:
      'Reporte LP 1102 con análisis de importaciones de Chile. Contexto comercial del sector.',
    tags: ['importaciones', 'chile', 'general'],
    uploadDate: '2020-01-15',
    fileSize: '681 KB',
    plan: 'ambos',
    file: '/informes/lp1102ImpChi.pdf',
  },
  {
    id: 'qsp-202001-ovw-toralla',
    title: 'QSP 2020-01 · Overview Toralla',
    type: 'pdf',
    industry: 'mitilicultura',
    month: 1,
    year: 2020,
    description:
      'Informe Quiet Storm Plataforma: vista global de la empresa Toralla, exportaciones, calibres y posicionamiento competitivo.',
    tags: ['toralla', 'mitilicultura', 'qsp', 'overview'],
    uploadDate: '2020-01-31',
    fileSize: '2.7 MB',
    plan: 'grande',
    file: '/informes/qsp_202001_OvwToralla.pdf',
  },
  {
    id: 'qsp-201701-a-zppo',
    title: 'QSP 2017-01 · Producto × Destino × Empresa',
    type: 'excel',
    industry: 'mitilicultura',
    month: 1,
    year: 2017,
    description:
      'Datos cruzados de exportaciones diciembre 2015 a noviembre 2016: producto × destino × empresa, en toneladas y valor FOB.',
    tags: ['exportaciones', 'cruce', 'mitilicultura', '2015-2016'],
    uploadDate: '2017-01-15',
    fileSize: '570 KB',
    plan: 'grande',
    file: '/informes/qsp_201701_A_zppo.xlsx',
  },
  {
    id: 'qsp-202401-eakb-ju',
    title: 'QSP 2024-01 · Estructura de Calibres 2022',
    type: 'excel',
    industry: 'mitilicultura',
    month: 1,
    year: 2024,
    description:
      'Estructura de calibres CA0–CA4 año 2022 para Mejillones Congelados Carne. Ranking de empresas con %market share intra-calibre y dentro del calibre.',
    tags: ['calibres', 'ranking', 'mitilicultura', '2022'],
    uploadDate: '2024-01-15',
    fileSize: '47 KB',
    plan: 'grande',
    file: '/informes/qsp_202401_EaKb_JU_A.xlsx',
  },
  {
    id: 'qsp-202401-proddestempr',
    title: 'QSP 2024-01 · Producto × Destino × Empresa × Calibres',
    type: 'excel',
    industry: 'mitilicultura',
    month: 1,
    year: 2024,
    description:
      'Base detallada de exportaciones 2022 cruzada por producto (carne, enteros, media valva), destino, empresa y calibre.',
    tags: ['cruce', 'calibres', 'destino', 'empresa', '2022'],
    uploadDate: '2024-01-15',
    fileSize: '139 KB',
    plan: 'grande',
    file: '/informes/qsp_202401_ProdDestEmprCalibres_A.xlsx',
  },
  {
    id: 'seafarm-metrics-202502',
    title: 'SEAFARM METRICS · Febrero 2025',
    type: 'dashboard',
    industry: 'mitilicultura',
    month: 2,
    year: 2025,
    description:
      'Dashboard interactivo SEAFARM METRICS con análisis de producción y exportación acuícola para febrero 2025.',
    tags: ['seafarm', 'dashboard', 'acuicultura'],
    uploadDate: '2025-02-15',
    fileSize: '19.6 MB',
    plan: 'grande',
    file: '/informes/SEAFARMMETRICS_202502.html',
  },
  {
    id: 'invcoihuin-mmd9',
    title: 'InvCoihuin · MUSSEL METRICS Dashboard 9',
    type: 'dashboard',
    industry: 'mitilicultura',
    month: 1,
    year: 2024,
    description:
      'Dashboard MUSSEL METRICS edición 9 con foco en Inversiones Coihuín. KPIs clave del mercado del mejillón chileno.',
    tags: ['mussel-metrics', 'invcoihuin', 'dashboard'],
    uploadDate: '2024-01-20',
    fileSize: '28.5 MB',
    plan: 'grande',
    file: '/informes/InvCoihuin_MMD9.html',
  },
]

export function getRealReports(): RealReport[] {
  return [...realReports].sort((a, b) => b.uploadDate.localeCompare(a.uploadDate))
}

export function getRealReport(id: string): RealReport | undefined {
  return realReports.find((r) => r.id === id)
}

export function getRealReportsForMonth(month: number, year: number): RealReport[] {
  return realReports.filter((r) => r.month === month && r.year === year)
}

// Distinct (month, year) combinations that actually have at least one real
// report. Used by the histórico to only show months with real data.
export function getRealReportPeriods(): { month: number; year: number }[] {
  const seen = new Set<string>()
  const out: { month: number; year: number }[] = []
  for (const r of realReports) {
    const k = `${r.year}-${r.month}`
    if (seen.has(k)) continue
    seen.add(k)
    out.push({ month: r.month, year: r.year })
  }
  out.sort((a, b) => (b.year - a.year) || (b.month - a.month))
  return out
}
