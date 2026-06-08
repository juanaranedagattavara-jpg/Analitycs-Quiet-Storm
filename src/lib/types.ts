export type Plan = 'chica' | 'grande'
export type BillingCycle = 'mensual' | 'anual'
export type SubscriptionStatus = 'trial' | 'active' | 'cancelled' | 'past_due'

export interface PlanPricing {
  mensual: number // UF/mes
  anual: number   // UF/año
}

export const PLAN_PRICING: Record<Plan, PlanPricing> = {
  chica: { mensual: 1, anual: 10 },
  grande: { mensual: 7, anual: 70 },
}

export function getEffectivePrice(plan: Plan, cycle: BillingCycle): number {
  return PLAN_PRICING[plan][cycle]
}

/** Monthly-equivalent price for a yearly subscription, used for comparison */
export function getMonthlyEquivalent(plan: Plan, cycle: BillingCycle): number {
  const p = PLAN_PRICING[plan]
  if (cycle === 'anual') return +(p.anual / 12).toFixed(2)
  return p.mensual
}

/** How much UF the user saves per year by choosing anual over mensual */
export function getYearlyDiscount(plan: Plan): number {
  const p = PLAN_PRICING[plan]
  return +(p.mensual * 12 - p.anual).toFixed(1)
}

export interface Subscription {
  plan: Plan
  cycle: BillingCycle
  status: SubscriptionStatus
  startedAt: string // ISO date
  renewsAt: string  // ISO date (trial-end or next billing)
  cancelAt?: string // ISO date if cancelled (still active until this date)
}

export interface UserProfile {
  name: string
  email: string
  company: string
  phone?: string
  rut?: string
  memberSince: string
}

export interface Invoice {
  id: string
  number: string
  date: string // ISO
  amountUF: number
  amountCLP: number
  status: 'paid' | 'pending' | 'failed'
  plan: Plan
  cycle: BillingCycle
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'transfer'
  last4?: string
  brand?: 'visa' | 'mastercard' | 'amex'
  expiry?: string // MM/YY
  isDefault: boolean
}

export interface PlanFeatures {
  rankingEmpresas: boolean
  desgloseCalibre: boolean
  analisisCompetitivo: boolean
  analisisDestino: boolean
  datosEmpresaEspecifica: boolean
  historicosCompletos: boolean
  exportExcel: boolean
  reportesCantidad: number
}

export interface PlanConfig {
  plan: Plan
  nombre: string
  descripcion: string
  features: PlanFeatures
  reportTypes: string[]
}

export const PLAN_CONFIGS: Record<Plan, PlanConfig> = {
  grande: {
    plan: 'grande',
    nombre: 'Plan Grande',
    descripcion: 'Acceso completo a rankings, calibres, analisis competitivo y todos los informes',
    features: {
      rankingEmpresas: true,
      desgloseCalibre: true,
      analisisCompetitivo: true,
      analisisDestino: true,
      datosEmpresaEspecifica: true,
      historicosCompletos: true,
      exportExcel: true,
      reportesCantidad: 7,
    },
    reportTypes: [
      'Analisis Estadistico completo',
      'Producto x Destino x Empresa x Calibres (Excel)',
      'MUSSEL METRICS Dashboard',
      'Informe Erizos y Jaibas',
      'Ranking Empresas Exportadoras',
      'SEAFARM METRICS Dashboard',
      'Analisis Competitivo Mensual',
    ],
  },
  chica: {
    plan: 'chica',
    nombre: 'Plan Chica',
    descripcion: 'Price check, tendencias de precios generales y resumen de mercado',
    features: {
      rankingEmpresas: false,
      desgloseCalibre: false,
      analisisCompetitivo: false,
      analisisDestino: true,
      datosEmpresaEspecifica: false,
      historicosCompletos: false,
      exportExcel: false,
      reportesCantidad: 4,
    },
    reportTypes: [
      'Mussel Price Check',
      'Resumen de Precios por Destino',
      'MOSS METRICS Dashboard',
      'Tendencias de Mercado',
    ],
  },
}

export type Industry = 'mitilicultura' | 'erizos-jaibas' | 'algas' | 'general'
export type ReportType = 'pdf' | 'excel' | 'dashboard' | 'price-check'

export interface Report {
  id: string
  title: string
  type: ReportType
  industry: Industry
  month: number
  year: number
  description: string
  tags: string[]
  uploadDate: string
  fileSize?: string
  plan: 'grande' | 'chica' | 'ambos'
}

export interface ExportRow {
  producto: string
  destino: string
  empresa: string
  calibre: string
  volumen_kg: number
  valor_usd: number
  precio_usd_kg: number
  variacion_pct: number
}

export interface MonthlyKPI {
  month: number
  year: number
  totalExportValue: number
  totalVolume: number
  avgPrice: number
  topDestination: string
  topCaliber: string
  numCompanies: number
  variationValue: number
  variationVolume: number
}

export interface PricePoint {
  month: string
  espana: number
  francia: number
  italia: number
  promedio: number
}

export interface CompanyRanking {
  position: number
  empresa: string
  volumen_ton: number
  valor_usd: number
  participacion_pct: number
  variacion_pct: number
  precio_usd_kg?: number
}

export interface CaliberBreakdown {
  calibre: string
  volumen_ton: number
  valor_usd: number
  precio_promedio: number
  participacion_pct: number
}

export interface DestinationData {
  destino: string
  volumen_ton: number
  participacion_pct: number
  variacion_pct: number
}

export interface ProductRanking {
  producto: string
  empresas: Array<{
    empresa: string
    volumen_ton: number
    precio_usd_kg: number
    participacion_pct: number
  }>
}

export interface DashboardData {
  kpi: MonthlyKPI
  priceTrend: PricePoint[]
  destinations: DestinationData[]
  companyRanking: CompanyRanking[] | null
  caliberBreakdown: CaliberBreakdown[] | null
  productRankings: ProductRanking[] | null
}

export interface MonthOption {
  value: string
  label: string
}

export interface UploadedFile {
  id: string
  name: string
  type: ReportType
  industry: Industry
  month: number
  year: number
  size: string
  uploadDate: string
  status: 'processing' | 'published' | 'draft'
}
