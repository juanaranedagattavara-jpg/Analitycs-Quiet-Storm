import type { Plan } from '@/lib/types'
import type { ReportPlan } from '@/lib/db/reports'

export function canAccessReport(reportPlan: ReportPlan, userPlan: Plan): boolean {
  if (reportPlan === 'ambos') return true
  if (userPlan === 'enterprise') return true
  if (userPlan === 'profesional') return reportPlan !== 'enterprise'
  return reportPlan === 'pyme'
}
