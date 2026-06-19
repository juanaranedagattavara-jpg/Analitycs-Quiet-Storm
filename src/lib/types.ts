export type Plan = 'pyme' | 'profesional' | 'enterprise'
export type BillingCycle = 'mensual' | 'anual'
export type SubscriptionStatus = 'trial' | 'active' | 'cancelled' | 'past_due'

export const PLAN_LABELS: Record<Plan, string> = {
  pyme: 'Pymes y MicroPymes',
  profesional: 'Profesional',
  enterprise: 'Empresas Medianas y Grandes',
}

export const PLAN_SHORT_LABELS: Record<Plan, string> = {
  pyme: 'Pyme',
  profesional: 'Profesional',
  enterprise: 'Empresa',
}

export interface PlanPricing {
  mensual: number // UF/mes
  anual: number   // UF/año
}

export const PLAN_PRICING: Record<Plan, PlanPricing> = {
  pyme: { mensual: 1, anual: 10 },
  profesional: { mensual: 3, anual: 30 },
  enterprise: { mensual: 7, anual: 70 },
}

export function getEffectivePrice(plan: Plan, cycle: BillingCycle): number {
  return PLAN_PRICING[plan][cycle]
}

export function getMonthlyEquivalent(plan: Plan, cycle: BillingCycle): number {
  const p = PLAN_PRICING[plan]
  if (cycle === 'anual') return +(p.anual / 12).toFixed(2)
  return p.mensual
}

export function getYearlyDiscount(plan: Plan): number {
  const p = PLAN_PRICING[plan]
  return +(p.mensual * 12 - p.anual).toFixed(1)
}

export interface Subscription {
  plan: Plan
  cycle: BillingCycle
  status: SubscriptionStatus
  startedAt: string
  renewsAt: string
  cancelAt?: string
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
  date: string
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
  expiry?: string
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
  pyme: {
    plan: 'pyme',
    nombre: 'Pymes y MicroPymes',
    descripcion: 'Precios de tu competencia, resumen del mercado y base de datos histórica para tomar decisiones de precio con respaldo.',
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
      'Price Check — precios de tu competencia',
      'Resumen ejecutivo del mercado',
      'Base de datos histórica de exportaciones',
      'Visión por país de destino',
    ],
  },
  profesional: {
    plan: 'profesional',
    nombre: 'Profesional',
    descripcion: 'Análisis competitivo y panorama del sector para empresas que necesitan posicionarse estratégicamente.',
    features: {
      rankingEmpresas: true,
      desgloseCalibre: true,
      analisisCompetitivo: true,
      analisisDestino: true,
      datosEmpresaEspecifica: false,
      historicosCompletos: false,
      exportExcel: true,
      reportesCantidad: 6,
    },
    reportTypes: [
      'Price Check — precios de tu competencia',
      'Resumen ejecutivo del mercado',
      'Base de datos histórica de exportaciones',
      'Visión por país de destino',
      'Análisis competitivo',
      'Precios fuera de rango',
      'Panorama competitivo',
    ],
  },
  enterprise: {
    plan: 'enterprise',
    nombre: 'Empresas Medianas y Grandes',
    descripcion: 'Inteligencia completa para presentar a directorio: rankings, participación de mercado, calibres, flujos de exportación y tendencias.',
    features: {
      rankingEmpresas: true,
      desgloseCalibre: true,
      analisisCompetitivo: true,
      analisisDestino: true,
      datosEmpresaEspecifica: true,
      historicosCompletos: true,
      exportExcel: true,
      reportesCantidad: 10,
    },
    reportTypes: [
      'Patrones del mercado',
      'Posicionamiento',
      'Ranking de empresas',
      'Ranking de mercados',
      'Mix de productos',
      'Participación de mercado por empresa',
      'Participación por destino / origen',
      'Análisis por calibre',
      'Desempeño comparado',
      'Informe de clientes en el extranjero',
      'Tendencias del mercado',
      'Calibres por empresa y destino',
      'Flujos de exportación entre países',
      'Agrupación de mercados similares',
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
  plan: 'enterprise' | 'pyme' | 'profesional' | 'ambos'
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
