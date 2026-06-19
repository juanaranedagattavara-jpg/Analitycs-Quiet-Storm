'use client'

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
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
import { profileStore } from './profile-store'
import {
  fetchMe,
  patchSubscription as apiPatchSubscription,
  cancelSubscription as apiCancelSubscription,
  reactivateSubscription as apiReactivateSubscription,
} from './auth/client'
import type { PublicUser, PublicOrganization, OrgMemberRole } from './db/types'

interface PlanContextValue {
  plan: Plan
  cycle: BillingCycle
  subscription: Subscription
  planConfig: PlanConfig
  user: PublicUser | null
  organization: PublicOrganization | null
  orgRole: OrgMemberRole | null

  setPlan: (plan: Plan) => void | Promise<void>
  setCycle: (cycle: BillingCycle) => void | Promise<void>
  updateSubscription: (
    next: Partial<Pick<Subscription, 'plan' | 'cycle'>>,
  ) => void | Promise<void>

  cancel: () => void | Promise<void>
  reactivate: () => void | Promise<void>

  canAccess: (feature: keyof PlanConfig['features']) => boolean
  isTrial: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
}

const PlanContext = createContext<PlanContextValue | null>(null)

const FALLBACK_SUBSCRIPTION: Subscription = {
  plan: 'enterprise',
  cycle: 'mensual',
  status: 'trial',
  startedAt: '1970-01-01T00:00:00.000Z',
  renewsAt: '1970-01-31T00:00:00.000Z',
}

interface ServerSubscription {
  plan: Plan
  cycle: BillingCycle
  status: SubscriptionStatus
  started_at: string
  renews_at: string
  cancel_at: string | null
}

function normalizeFromServer(s: ServerSubscription): Subscription {
  return {
    plan: s.plan,
    cycle: s.cycle,
    status: s.status,
    startedAt: s.started_at,
    renewsAt: s.renews_at,
    cancelAt: s.cancel_at ?? undefined,
  }
}

interface ClientSubscriptionFromAPI {
  plan: Plan
  cycle: BillingCycle
  status: SubscriptionStatus
  startedAt: string
  renewsAt: string
  cancelAt?: string | null
}

function normalizeFromClient(s: ClientSubscriptionFromAPI): Subscription {
  return {
    plan: s.plan,
    cycle: s.cycle,
    status: s.status,
    startedAt: s.startedAt,
    renewsAt: s.renewsAt,
    cancelAt: s.cancelAt ?? undefined,
  }
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription>(FALLBACK_SUBSCRIPTION)
  const [user, setUser] = useState<PublicUser | null>(null)
  const [organization, setOrganization] = useState<PublicOrganization | null>(null)
  const [orgRole, setOrgRole] = useState<OrgMemberRole | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchMe()
      .then((data) => {
        if (cancelled) return
        if (data.user) {
          setIsAuthenticated(true)
          setUser(data.user)
          setOrganization(data.organization ?? null)
          setOrgRole(data.orgRole ?? null)
          profileStore.bootstrap({
            name: data.user.name || '',
            email: data.user.email || '',
            company: data.organization?.name || '',
            phone: data.user.phone || '',
            rut: data.user.rut || '',
            memberSince: new Date(data.user.createdAt).toLocaleDateString('es-CL', {
              month: 'long',
              year: 'numeric',
            }),
          })
        } else {
          setIsAuthenticated(false)
          setUser(null)
          setOrganization(null)
          setOrgRole(null)
          profileStore.clear()
        }
        if (data.subscription) {
          setSubscription(normalizeFromServer(data.subscription))
        }
      })
      .catch(() => {
        if (!cancelled) setIsAuthenticated(false)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const updateSubscription = useCallback<PlanContextValue['updateSubscription']>(
    async (next) => {
      const { subscription: updated } = await apiPatchSubscription({
        plan: next.plan,
        cycle: next.cycle,
      })
      setSubscription(normalizeFromClient(updated))
    },
    [],
  )

  const setPlan = useCallback(async (p: Plan) => {
    const { subscription: updated } = await apiPatchSubscription({ plan: p })
    setSubscription(normalizeFromClient(updated))
  }, [])

  const setCycle = useCallback(async (c: BillingCycle) => {
    const { subscription: updated } = await apiPatchSubscription({ cycle: c })
    setSubscription(normalizeFromClient(updated))
  }, [])

  const cancel = useCallback(async () => {
    const { subscription: updated } = await apiCancelSubscription()
    setSubscription(normalizeFromClient(updated))
  }, [])

  const reactivate = useCallback(async () => {
    const { subscription: updated } = await apiReactivateSubscription()
    setSubscription(normalizeFromClient(updated))
  }, [])

  const planConfig = PLAN_CONFIGS[subscription.plan]

  const canAccess = useCallback(
    (feature: keyof PlanConfig['features']): boolean => {
      const value = PLAN_CONFIGS[subscription.plan].features[feature]
      return typeof value === 'boolean' ? value : true
    },
    [subscription.plan],
  )

  const value = useMemo<PlanContextValue>(
    () => ({
      plan: subscription.plan,
      cycle: subscription.cycle,
      subscription,
      planConfig,
      user,
      organization,
      orgRole,
      setPlan,
      setCycle,
      updateSubscription,
      cancel,
      reactivate,
      canAccess,
      isTrial: subscription.status === 'trial',
      isAuthenticated,
      isAdmin: user?.role === 'admin' || orgRole === 'owner' || orgRole === 'admin',
      loading,
    }),
    [
      subscription,
      planConfig,
      user,
      organization,
      orgRole,
      setPlan,
      setCycle,
      updateSubscription,
      cancel,
      reactivate,
      canAccess,
      isAuthenticated,
      loading,
    ],
  )

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error('usePlan debe usarse dentro de un PlanProvider')
  return ctx
}
