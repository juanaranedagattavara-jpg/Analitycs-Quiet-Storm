'use client'

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import {
  Plan,
  PlanConfig,
  PLAN_CONFIGS,
  BillingCycle,
  Subscription,
  SubscriptionStatus,
} from './types'

interface PlanContextValue {
  plan: Plan
  cycle: BillingCycle
  subscription: Subscription
  planConfig: PlanConfig

  setPlan: (plan: Plan) => void
  setCycle: (cycle: BillingCycle) => void
  updateSubscription: (next: Partial<Pick<Subscription, 'plan' | 'cycle'>>) => void

  cancel: () => void
  reactivate: () => void

  canAccess: (feature: keyof PlanConfig['features']) => boolean
  isTrial: boolean
}

const PlanContext = createContext<PlanContextValue | null>(null)
const STORAGE_KEY = 'qsa.subscription.v1'

function addDays(iso: string, days: number): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function defaultSubscription(plan: Plan): Subscription {
  const now = new Date().toISOString()
  return {
    plan,
    cycle: 'mensual',
    status: 'trial',
    startedAt: now,
    renewsAt: addDays(now, 30),
  }
}

const SSR_DEFAULT: Subscription = {
  plan: 'enterprise',
  cycle: 'mensual',
  status: 'trial',
  startedAt: '1970-01-01T00:00:00.000Z',
  renewsAt: '1970-01-31T00:00:00.000Z',
}

const VALID_PLANS: Plan[] = ['pyme', 'profesional', 'enterprise']

function migratePlan(raw: string): Plan {
  if (raw === 'chica') return 'pyme'
  if (raw === 'grande') return 'enterprise'
  if (VALID_PLANS.includes(raw as Plan)) return raw as Plan
  return 'enterprise'
}

function readSubscription(fallbackPlan: Plan): Subscription {
  if (typeof window === 'undefined') return defaultSubscription(fallbackPlan)
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSubscription(fallbackPlan)
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const plan = migratePlan(String(parsed.plan || ''))
    if (
      (parsed.cycle === 'mensual' || parsed.cycle === 'anual') &&
      typeof parsed.startedAt === 'string'
    ) {
      return { ...parsed, plan } as Subscription
    }
  } catch {
    /* ignore */
  }
  return defaultSubscription(fallbackPlan)
}

type Listener = () => void

class SubscriptionStore {
  private listeners = new Set<Listener>()
  private cache: Subscription | null = null

  getSnapshot = (): Subscription => {
    if (typeof window === 'undefined') return SSR_DEFAULT
    if (this.cache !== null) return this.cache
    this.cache = readSubscription('enterprise')
    return this.cache
  }

  getServerSnapshot = (): Subscription => SSR_DEFAULT

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        this.cache = null
        listener()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      this.listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }

  update = (next: Subscription): void => {
    this.cache = next
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
    this.listeners.forEach((l) => l())
  }

  patch = (patch: Partial<Subscription>): void => {
    this.update({ ...this.getSnapshot(), ...patch })
  }
}

const store = new SubscriptionStore()

export function PlanProvider({ children }: { children: ReactNode }) {
  const subscription = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  )

  const updateSubscription = useCallback<PlanContextValue['updateSubscription']>(
    (next) => store.patch(next),
    []
  )

  const setPlan = useCallback((p: Plan) => store.patch({ plan: p }), [])
  const setCycle = useCallback((c: BillingCycle) => store.patch({ cycle: c }), [])

  const cancel = useCallback(() => {
    const current = store.getSnapshot()
    store.update({
      ...current,
      status: 'cancelled' as SubscriptionStatus,
      cancelAt: current.renewsAt,
    })
  }, [])

  const reactivate = useCallback(() => {
    const current = store.getSnapshot()
    store.update({
      ...current,
      status: current.status === 'cancelled' ? 'active' : current.status,
      cancelAt: undefined,
    })
  }, [])

  const planConfig = PLAN_CONFIGS[subscription.plan]

  const canAccess = useCallback(
    (feature: keyof PlanConfig['features']): boolean => {
      const value = PLAN_CONFIGS[subscription.plan].features[feature]
      return typeof value === 'boolean' ? value : true
    },
    [subscription.plan]
  )

  const value = useMemo<PlanContextValue>(
    () => ({
      plan: subscription.plan,
      cycle: subscription.cycle,
      subscription,
      planConfig,
      setPlan,
      setCycle,
      updateSubscription,
      cancel,
      reactivate,
      canAccess,
      isTrial: subscription.status === 'trial',
    }),
    [subscription, planConfig, setPlan, setCycle, updateSubscription, cancel, reactivate, canAccess]
  )

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error('usePlan debe usarse dentro de un PlanProvider')
  return ctx
}
