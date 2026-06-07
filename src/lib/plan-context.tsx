'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Plan, PlanConfig, PLAN_CONFIGS } from './types'

interface PlanContextValue {
  plan: Plan
  setPlan: (plan: Plan) => void
  planConfig: PlanConfig
  canAccess: (feature: keyof PlanConfig['features']) => boolean
}

const PlanContext = createContext<PlanContextValue | null>(null)

interface PlanProviderProps {
  children: ReactNode
  defaultPlan?: Plan
}

export function PlanProvider({ children, defaultPlan = 'grande' }: PlanProviderProps) {
  const [plan, setPlan] = useState<Plan>(defaultPlan)

  const planConfig = PLAN_CONFIGS[plan]

  const canAccess = useCallback(
    (feature: keyof PlanConfig['features']): boolean => {
      const value = PLAN_CONFIGS[plan].features[feature]
      if (typeof value === 'boolean') return value
      return true
    },
    [plan]
  )

  return (
    <PlanContext.Provider value={{ plan, setPlan, planConfig, canAccess }}>
      {children}
    </PlanContext.Provider>
  )
}

export function usePlan(): PlanContextValue {
  const context = useContext(PlanContext)
  if (!context) {
    throw new Error('usePlan debe usarse dentro de un PlanProvider')
  }
  return context
}
