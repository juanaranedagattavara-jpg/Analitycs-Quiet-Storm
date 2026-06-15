'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { usePlan } from '@/lib/plan-context'
import { profileStore } from '@/lib/profile-store'
import { patchProfile, ApiError } from '@/lib/auth/client'
import {
  PLAN_CONFIGS,
  PLAN_PRICING,
  PLAN_LABELS,
  getMonthlyEquivalent,
  getYearlyDiscount,
  type Plan,
  type BillingCycle,
  type UserProfile,
} from '@/lib/types'

const FEATURE_COMPARISON: { feature: string; pyme: string; profesional: string; enterprise: string }[] = [
  { feature: 'Acceso plataforma', pyme: 'Sí', profesional: 'Sí', enterprise: 'Sí' },
  { feature: 'Informes mensuales', pyme: '4 informes', profesional: '6 informes', enterprise: '10+ informes' },
  { feature: 'Price Check', pyme: 'Incluido', profesional: 'Incluido', enterprise: 'Incluido' },
  { feature: 'Ranking de empresas', pyme: 'No incluido', profesional: 'Incluido', enterprise: 'Completo' },
  { feature: 'Desglose por calibre', pyme: 'No incluido', profesional: 'Incluido', enterprise: 'Detallado' },
  { feature: 'Análisis competitivo', pyme: 'No incluido', profesional: 'Sí', enterprise: 'Sí' },
  { feature: 'Datos por empresa', pyme: 'No incluido', profesional: 'No incluido', enterprise: 'Completo' },
  { feature: 'Exportar a Excel', pyme: 'No incluido', profesional: 'Sí', enterprise: 'Sí' },
  { feature: 'Market Share', pyme: 'No incluido', profesional: 'No incluido', enterprise: 'Completo' },
  { feature: 'Análisis de tendencias', pyme: 'No incluido', profesional: 'No incluido', enterprise: 'Sí' },
  { feature: 'Históricos completos', pyme: 'Limitado', profesional: 'Limitado', enterprise: 'Sí' },
]

const ALL_PLANS: Plan[] = ['pyme', 'profesional', 'enterprise']

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
}

function formatCLP(value: number): string {
  return '$' + value.toLocaleString('es-CL')
}

function daysBetween(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)))
}

interface BillingInvoice {
  id: string
  number: string
  issued_at: string
  amount_uf: number
  amount_clp: number
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  plan: Plan
  cycle: BillingCycle
}

export default function CuentaPage() {
  const { plan, cycle, subscription, isTrial, updateSubscription, cancel, reactivate } = usePlan()

  const profile = useSyncExternalStore(
    profileStore.subscribe,
    profileStore.getSnapshot,
    profileStore.getServerSnapshot
  )
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [language, setLanguage] = useState('es')
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [tab, setTab] = useState<'general' | 'suscripcion' | 'facturacion' | 'pago' | 'seguridad'>('general')
  const [invoices, setInvoices] = useState<BillingInvoice[]>([])
  const [profileError, setProfileError] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/invoices', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : { invoices: [] }))
      .then((data: { invoices?: BillingInvoice[] }) => setInvoices(data.invoices || []))
      .catch(() => setInvoices([]))
  }, [])

  async function saveProfile(next: UserProfile) {
    setProfileError(null)
    try {
      await patchProfile({
        name: next.name,
        company: next.company,
        phone: next.phone || null,
        rut: next.rut || null,
      })
      profileStore.set(next)
      setEditingProfile(false)
    } catch (err) {
      if (err instanceof ApiError) {
        setProfileError(err.message || 'No pudimos guardar tu perfil')
      } else {
        setProfileError('Hubo un problema. Intenta de nuevo.')
      }
    }
  }

  async function startCheckout(targetPlan: Plan, targetCycle: BillingCycle) {
    setCheckoutLoading(true)
    setCheckoutNotice(null)
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ plan: targetPlan, cycle: targetCycle }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        checkoutUrl?: string | null
        pendingConfiguration?: boolean
        message?: string
        error?: string
      }
      if (!res.ok) {
        setCheckoutNotice(data.error || 'No pudimos iniciar el pago.')
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        setCheckoutNotice(
          data.message ||
            'Pasarela Mercado Pago en configuración. Tu factura quedó pendiente y se activará cuando esté conectada.',
        )
      }
    } catch {
      setCheckoutNotice('Error de conexión con la pasarela de pago.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const price = PLAN_PRICING[plan][cycle]
  const renewalDays = daysBetween(subscription.renewsAt)
  const statusLabel: Record<typeof subscription.status, { label: string; color: string }> = {
    trial: { label: 'Prueba gratis', color: 'bg-lightning/20 text-storm-midnight border-lightning/40' },
    active: { label: 'Activa', color: 'bg-green-50 text-green-700 border-green-200' },
    cancelled: { label: 'Cancelada', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    past_due: { label: 'Pago atrasado', color: 'bg-red-50 text-red-700 border-red-200' },
  }
  const status = statusLabel[subscription.status]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-storm-midnight">
          Mi Cuenta
        </h1>
        <p className="text-sm text-storm-mist mt-1">
          Gestiona tu perfil, plan, facturación y preferencias.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-storm-foam overflow-x-auto">
        {([
          ['general', 'General'],
          ['suscripcion', 'Suscripción'],
          ['facturacion', 'Facturación'],
          ['pago', 'Métodos de pago'],
          ['seguridad', 'Seguridad'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors',
              tab === key
                ? 'border-lightning text-storm-midnight'
                : 'border-transparent text-storm-steel hover:text-storm-midnight'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* General — profile + preferences */}
      {tab === 'general' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Información personal" icon={<UserIcon />}>
              {profileError && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {profileError}
                </div>
              )}
              {editingProfile ? (
                <ProfileEditor profile={profile} onCancel={() => setEditingProfile(false)} onSave={saveProfile} />
              ) : (
                <div className="grid sm:grid-cols-2 gap-5">
                  <InfoField label="Nombre" value={profile.name || '—'} />
                  <InfoField label="Email" value={profile.email || '—'} />
                  <InfoField label="Empresa" value={profile.company || '—'} />
                  <InfoField label="Teléfono" value={profile.phone || '—'} />
                  <InfoField label="RUT" value={profile.rut || '—'} />
                  <InfoField label="Miembro desde" value={profile.memberSince || '—'} />
                </div>
              )}
              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="mt-6 px-5 py-2.5 rounded-xl border border-storm-foam text-storm-steel text-sm font-medium hover:border-storm-spray hover:text-storm-midnight transition-colors"
                >
                  Editar perfil
                </button>
              )}
            </Card>

            <Card title="Preferencias" icon={<SettingsIcon />}>
              <div className="space-y-5">
                <ToggleRow
                  label="Notificaciones por email"
                  description="Recibe alertas cuando se publiquen nuevos informes."
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                />
                <SelectRow
                  label="Idioma preferido"
                  description="Idioma de la interfaz y los informes."
                  value={language}
                  onChange={setLanguage}
                  options={[
                    { value: 'es', label: 'Español' },
                    { value: 'en', label: 'English' },
                  ]}
                />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <PlanSummaryCard
              plan={plan}
              cycle={cycle}
              price={price}
              status={status}
              renewalDays={renewalDays}
              isTrial={isTrial}
              onManage={() => setTab('suscripcion')}
            />

            <Card title="Acceso rápido">
              <div className="space-y-1">
                <QuickLink href="/plataforma" label="Dashboard" />
                <QuickLink href="/plataforma/historico" label="Histórico" />
                <QuickLink href="/plataforma/informes" label="Informes" />
                <QuickLink href="/contacto" label="Contactar soporte" external />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Suscripción */}
      {tab === 'suscripcion' && (
        <div className="space-y-6">
          <Card title="Suscripción actual" icon={<StarIcon />} accent={isTrial ? 'lightning' : 'default'}>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-storm-mist mb-1">Plan</div>
                <div className="font-display text-3xl font-medium text-storm-midnight">
                  {PLAN_LABELS[plan]}
                </div>
              </div>
              <div className="sm:ml-auto text-right">
                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-storm-mist mb-1">Precio</div>
                <div className="font-display text-2xl font-medium text-storm-midnight">
                  {price} UF<span className="text-sm text-storm-steel font-normal">/{cycle === 'mensual' ? 'mes' : 'año'}</span>
                </div>
                {cycle === 'anual' && (
                  <div className="text-xs text-storm-mist mt-0.5">
                    ≈ {getMonthlyEquivalent(plan, cycle).toFixed(2)} UF/mes
                  </div>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <StatusBadge label="Estado" value={status.label} colorClass={status.color} />
              <StatusBadge
                label={subscription.status === 'cancelled' ? 'Termina el' : 'Renueva el'}
                value={formatDate(subscription.renewsAt)}
                subtitle={`En ${renewalDays} día${renewalDays === 1 ? '' : 's'}`}
              />
              <StatusBadge label="Ciclo" value={cycle === 'mensual' ? 'Mensual' : 'Anual'} />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowPlanModal(true)}
                className="btn-lightning rounded-xl h-10 px-5 text-sm font-semibold"
              >
                Cambiar plan o ciclo
              </button>
              {subscription.status === 'cancelled' ? (
                <button
                  onClick={reactivate}
                  className="px-5 py-2.5 rounded-xl border border-storm-foam text-storm-steel text-sm font-medium hover:border-storm-spray hover:text-storm-midnight transition-colors"
                >
                  Reactivar suscripción
                </button>
              ) : (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Cancelar suscripción
                </button>
              )}
            </div>
          </Card>

          <Card title="Comparativa de planes">
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="bg-storm-paper">
                    <th className="text-left px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-storm-mist">
                      Característica
                    </th>
                    {ALL_PLANS.map((p) => (
                      <th key={p} className={cn(
                        'text-center px-4 py-3 font-mono text-[11px] uppercase tracking-wider',
                        plan === p ? 'bg-storm-midnight text-white' : 'text-storm-mist'
                      )}>
                        {PLAN_LABELS[p]}
                        {plan === p && <ActualBadge />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-storm-foam">
                  <tr className="bg-storm-paper/50">
                    <td className="px-4 py-3 font-medium text-storm-midnight">Precio mensual</td>
                    {ALL_PLANS.map((p) => (
                      <td key={p} className="px-4 py-3 text-center font-mono font-semibold text-storm-midnight">
                        {PLAN_PRICING[p].mensual} UF
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-storm-midnight">Precio anual</td>
                    {ALL_PLANS.map((p) => (
                      <td key={p} className="px-4 py-3 text-center font-mono font-semibold text-storm-midnight">
                        {PLAN_PRICING[p].anual} UF
                        <div className="text-[10px] text-storm-mist">−{getYearlyDiscount(p)} UF</div>
                      </td>
                    ))}
                  </tr>
                  {FEATURE_COMPARISON.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-storm-paper/30'}>
                      <td className="px-4 py-3 text-storm-steel">{row.feature}</td>
                      {ALL_PLANS.map((p) => {
                        const val = row[p]
                        return (
                          <td key={p} className="px-4 py-3 text-center text-sm">
                            {val.startsWith('No') ? (
                              <span className="text-storm-fog">{val}</span>
                            ) : (
                              <span className="text-storm-midnight font-medium">{val}</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Facturación */}
      {tab === 'facturacion' && (
        <Card title="Historial de facturas" icon={<DocumentIcon />}>
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-storm-paper flex items-center justify-center mb-4 text-storm-mist">
                <DocumentIcon />
              </div>
              <p className="text-sm font-medium text-storm-midnight">Aún no hay facturas emitidas</p>
              <p className="text-xs text-storm-mist mt-1">
                Cuando inicies un pago aparecerán aquí. La primera factura se genera al activar tu plan tras el trial.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="bg-storm-paper">
                    <th className="text-left px-6 py-3 font-mono text-[11px] uppercase tracking-wider text-storm-mist">Número</th>
                    <th className="text-left px-6 py-3 font-mono text-[11px] uppercase tracking-wider text-storm-mist">Fecha</th>
                    <th className="text-left px-6 py-3 font-mono text-[11px] uppercase tracking-wider text-storm-mist">Plan</th>
                    <th className="text-right px-6 py-3 font-mono text-[11px] uppercase tracking-wider text-storm-mist">Monto</th>
                    <th className="text-left px-6 py-3 font-mono text-[11px] uppercase tracking-wider text-storm-mist">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-storm-foam">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-storm-paper/40 transition-colors">
                      <td className="px-6 py-3 font-mono text-storm-midnight">{inv.number}</td>
                      <td className="px-6 py-3 text-storm-steel">{formatDate(inv.issued_at)}</td>
                      <td className="px-6 py-3 text-storm-steel">
                        {PLAN_LABELS[inv.plan]} · {inv.cycle === 'mensual' ? 'Mensual' : 'Anual'}
                      </td>
                      <td className="px-6 py-3 text-right font-mono text-storm-midnight font-medium">
                        {inv.amount_uf} UF
                        <div className="text-[10px] text-storm-mist">{formatCLP(inv.amount_clp)}</div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border',
                          inv.status === 'paid' && 'bg-green-50 text-green-700 border-green-200',
                          inv.status === 'pending' && 'bg-amber-50 text-amber-700 border-amber-200',
                          inv.status === 'failed' && 'bg-red-50 text-red-700 border-red-200',
                          inv.status === 'refunded' && 'bg-storm-paper text-storm-steel border-storm-foam',
                        )}>
                          {inv.status === 'paid' ? 'Pagada' : inv.status === 'pending' ? 'Pendiente' : inv.status === 'refunded' ? 'Reembolsada' : 'Fallida'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Pago */}
      {tab === 'pago' && (
        <Card title="Activar plan o renovar" icon={<CardIcon />}>
          {checkoutNotice && (
            <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
              {checkoutNotice}
            </div>
          )}
          <p className="text-sm text-storm-steel leading-relaxed mb-6">
            QSA usa <strong>Mercado Pago</strong>. Tarjetas Visa, Mastercard, transferencia bancaria
            y otros medios de pago disponibles en Chile. Tus datos se procesan en infraestructura
            PCI-DSS certificada por Mercado Pago.
          </p>

          <div className="rounded-xl border border-storm-foam bg-storm-paper/40 p-5 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-storm-foam flex items-center justify-center text-storm-midnight font-mono text-[10px] font-bold">
                MP
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-storm-midnight">
                  Plan {PLAN_LABELS[plan]} · {cycle === 'mensual' ? 'Mensual' : 'Anual'}
                </div>
                <div className="text-xs text-storm-mist mt-0.5">
                  {price} UF{cycle === 'anual' ? '/año' : '/mes'} — se cobra en CLP al tipo de cambio UF del día.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => startCheckout(plan, cycle)}
              disabled={checkoutLoading}
              className={cn(
                'mt-4 w-full px-5 py-3 rounded-xl text-sm font-semibold transition-colors',
                checkoutLoading
                  ? 'bg-storm-foam text-storm-fog cursor-not-allowed'
                  : 'bg-storm-midnight text-white hover:bg-storm-deep',
              )}
            >
              {checkoutLoading ? 'Conectando con Mercado Pago…' : 'Pagar con Mercado Pago →'}
            </button>
          </div>

          <p className="text-xs text-storm-fog">
            Si tu trial sigue vigente puedes seguir usando la plataforma sin pagar todavía. Al
            finalizar el período de prueba se te pedirá activar tu plan para mantener acceso.
          </p>
        </Card>
      )}

      {/* Seguridad */}
      {tab === 'seguridad' && (
        <Card title="Seguridad" icon={<LockIcon />}>
          <div className="space-y-5">
            <div className="flex items-center justify-between py-3 border-b border-storm-foam">
              <div>
                <div className="text-sm font-medium text-storm-midnight">Contraseña</div>
                <div className="text-xs text-storm-mist mt-0.5">Última actualización hace 3 meses</div>
              </div>
              <button className="px-4 py-2 rounded-lg border border-storm-foam text-storm-steel text-xs font-medium hover:border-storm-spray hover:text-storm-midnight transition-colors">
                Cambiar contraseña
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-storm-foam">
              <div>
                <div className="text-sm font-medium text-storm-midnight">Autenticación en dos pasos</div>
                <div className="text-xs text-storm-mist mt-0.5">No configurada · Recomendado</div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-storm-midnight text-white text-xs font-medium hover:bg-storm-deep transition-colors">
                Activar 2FA
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium text-storm-midnight">Sesiones activas</div>
                <div className="text-xs text-storm-mist mt-0.5">1 dispositivo · Esta sesión</div>
              </div>
              <button className="px-4 py-2 rounded-lg text-red-600 text-xs font-medium hover:bg-red-50 transition-colors">
                Cerrar todas
              </button>
            </div>
          </div>
        </Card>
      )}

      {showPlanModal && (
        <PlanChangeModal
          currentPlan={plan}
          currentCycle={cycle}
          onClose={() => setShowPlanModal(false)}
          onConfirm={(p, c) => {
            updateSubscription({ plan: p, cycle: c })
            setShowPlanModal(false)
          }}
        />
      )}

      {showCancelModal && (
        <CancelModal
          renewsAt={subscription.renewsAt}
          onClose={() => setShowCancelModal(false)}
          onConfirm={() => { cancel(); setShowCancelModal(false) }}
        />
      )}
    </div>
  )
}

// ─── UI primitives ────────────────────────────────────────────────────────────

function Card({
  title,
  icon,
  children,
  accent = 'default',
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  accent?: 'default' | 'lightning'
}) {
  return (
    <section className={cn(
      'rounded-2xl p-6 lg:p-8 border-2',
      accent === 'lightning' ? 'border-lightning bg-lightning/5' : 'border-storm-foam bg-white'
    )}>
      <h2 className="font-display text-lg font-semibold text-storm-midnight mb-6 flex items-center gap-3">
        {icon && <div className="p-2.5 rounded-xl bg-storm-paper text-storm-mist">{icon}</div>}
        {title}
      </h2>
      {children}
    </section>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-storm-mist mb-1">{label}</p>
      <p className="text-sm font-medium text-storm-midnight">{value}</p>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-storm-foam last:border-b-0">
      <div className="flex-1 pr-4">
        <div className="text-sm font-medium text-storm-midnight">{label}</div>
        <div className="text-xs text-storm-mist mt-0.5">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
          checked ? 'bg-lightning' : 'bg-storm-fog'
        )}
      >
        <span className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )} />
      </button>
    </div>
  )
}

function SelectRow({
  label,
  description,
  value,
  onChange,
  options,
}: {
  label: string
  description: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 pr-4">
        <div className="text-sm font-medium text-storm-midnight">{label}</div>
        <div className="text-xs text-storm-mist mt-0.5">{description}</div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-xl border border-storm-foam bg-white text-storm-midnight text-sm focus:ring-2 focus:ring-lightning/30 focus:border-lightning outline-none"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function QuickLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-storm-steel hover:bg-storm-paper hover:text-storm-midnight transition-colors"
    >
      <span>{label}</span>
      <span className="text-storm-fog">{external ? '↗' : '→'}</span>
    </Link>
  )
}

function PlanSummaryCard({
  plan, cycle, price, status, renewalDays, isTrial, onManage,
}: {
  plan: Plan
  cycle: BillingCycle
  price: number
  status: { label: string; color: string }
  renewalDays: number
  isTrial: boolean
  onManage: () => void
}) {
  const config = PLAN_CONFIGS[plan]
  return (
    <section className={cn(
      'rounded-2xl p-6 border-2',
      isTrial ? 'border-lightning bg-lightning/5' : 'border-storm-foam bg-white'
    )}>
      <div className="text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-storm-mist mb-1">
          Plan actual
        </div>
        <h3 className="font-display text-xl font-semibold text-storm-midnight">
          {PLAN_LABELS[plan]}
        </h3>
        <p className="font-mono text-sm text-storm-steel mt-1">
          {price} UF/{cycle === 'mensual' ? 'mes' : 'año'}
        </p>
        <p className="text-xs text-storm-fog mt-2">
          {config.features.reportesCantidad} informes/mes
        </p>
      </div>
      <div className="mt-5 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-storm-mist">Estado</span>
          <span className={cn('px-2 py-0.5 rounded-full border font-medium', status.color)}>{status.label}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-storm-mist">{isTrial ? 'Trial vence' : 'Renueva'}</span>
          <span className="font-medium text-storm-midnight">{renewalDays} días</span>
        </div>
      </div>
      <button
        onClick={onManage}
        className="mt-5 w-full px-4 py-2.5 rounded-xl bg-storm-midnight text-white text-sm font-semibold hover:bg-storm-deep transition-colors"
      >
        Gestionar suscripción
      </button>
    </section>
  )
}

function StatusBadge({
  label, value, subtitle, colorClass,
}: {
  label: string
  value: string
  subtitle?: string
  colorClass?: string
}) {
  return (
    <div className="rounded-xl bg-storm-paper/60 p-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-storm-mist mb-1.5">{label}</div>
      {colorClass ? (
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-semibold', colorClass)}>
          {value}
        </span>
      ) : (
        <div className="text-sm font-semibold text-storm-midnight">{value}</div>
      )}
      {subtitle && <div className="text-[11px] text-storm-fog mt-1">{subtitle}</div>}
    </div>
  )
}

function ActualBadge() {
  return (
    <span className="ml-1 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-lightning text-storm-midnight">
      ACTUAL
    </span>
  )
}

function ProfileEditor({
  profile, onCancel, onSave,
}: {
  profile: UserProfile
  onCancel: () => void
  onSave: (p: UserProfile) => void
}) {
  const [draft, setDraft] = useState(profile)
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(draft) }}
      className="grid sm:grid-cols-2 gap-5"
    >
      {([
        ['name', 'Nombre'],
        ['email', 'Email'],
        ['company', 'Empresa'],
        ['phone', 'Teléfono'],
        ['rut', 'RUT'],
      ] as const).map(([k, label]) => (
        <div key={k}>
          <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">
            {label}
          </label>
          <input
            type={k === 'email' ? 'email' : 'text'}
            value={draft[k] ?? ''}
            onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-storm-foam bg-white text-storm-midnight focus:ring-2 focus:ring-lightning/30 focus:border-lightning outline-none text-sm"
          />
        </div>
      ))}
      <div className="sm:col-span-2 flex gap-3 mt-2">
        <button type="submit" className="btn-lightning rounded-xl h-10 px-5 text-sm font-semibold">Guardar cambios</button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-storm-foam text-storm-steel text-sm font-medium hover:border-storm-spray hover:text-storm-midnight transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  )
}

function PlanChangeModal({
  currentPlan, currentCycle, onClose, onConfirm,
}: {
  currentPlan: Plan
  currentCycle: BillingCycle
  onClose: () => void
  onConfirm: (plan: Plan, cycle: BillingCycle) => void
}) {
  const [selPlan, setSelPlan] = useState<Plan>(currentPlan)
  const [selCycle, setSelCycle] = useState<BillingCycle>(currentCycle)
  const price = PLAN_PRICING[selPlan][selCycle]
  const noChange = selPlan === currentPlan && selCycle === currentCycle

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-storm-midnight/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border border-storm-foam p-6 lg:p-8 max-w-lg w-full shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-storm-fog hover:text-storm-midnight hover:bg-storm-paper transition-colors"
          aria-label="Cerrar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
        <h3 className="font-display text-xl font-semibold text-storm-midnight mb-1">
          Cambiar plan
        </h3>
        <p className="text-sm text-storm-mist mb-6">
          Selecciona tu plan y ciclo de facturación.
        </p>

        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-storm-paper mb-5">
          {(['mensual', 'anual'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelCycle(c)}
              className={cn(
                'h-9 px-4 rounded-full text-xs font-semibold transition-all',
                selCycle === c ? 'bg-white shadow-sm text-storm-midnight' : 'text-storm-steel'
              )}
            >
              {c === 'mensual' ? 'Mensual' : 'Anual'}
              {c === 'anual' && (
                <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full bg-lightning text-storm-midnight text-[9px] font-mono font-bold">
                  −17%
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {ALL_PLANS.map((p) => {
            const isSelected = selPlan === p
            const isCurrent = currentPlan === p && currentCycle === selCycle
            const planPrice = PLAN_PRICING[p][selCycle]
            return (
              <button
                key={p}
                type="button"
                onClick={() => setSelPlan(p)}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left transition-all',
                  isSelected ? 'border-lightning bg-lightning/5' : 'border-storm-foam hover:border-storm-spray'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-base font-semibold text-storm-midnight">
                    {PLAN_LABELS[p]}
                  </span>
                  <span className="font-mono text-sm font-semibold text-storm-midnight">
                    {planPrice} UF/{selCycle === 'mensual' ? 'mes' : 'año'}
                  </span>
                </div>
                <p className="text-xs text-storm-mist">
                  {PLAN_CONFIGS[p].descripcion}
                </p>
                {isCurrent && (
                  <span className="inline-flex mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-storm-paper text-storm-steel">
                    Plan actual
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-storm-foam flex items-center justify-between">
          <div>
            <div className="text-xs text-storm-mist">Pagarás</div>
            <div className="font-display text-xl font-semibold text-storm-midnight">
              {price} UF<span className="text-sm text-storm-steel">/{selCycle === 'mensual' ? 'mes' : 'año'}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onConfirm(selPlan, selCycle)}
            disabled={noChange}
            className={cn(
              'rounded-xl h-11 px-6 text-sm font-semibold transition-all',
              noChange
                ? 'bg-storm-foam text-storm-fog cursor-not-allowed'
                : 'btn-lightning'
            )}
          >
            {noChange ? 'Sin cambios' : 'Confirmar cambio'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CancelModal({
  renewsAt, onClose, onConfirm,
}: {
  renewsAt: string
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-storm-midnight/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border border-storm-foam p-6 lg:p-8 max-w-md w-full shadow-2xl">
        <h3 className="font-display text-xl font-semibold text-storm-midnight mb-2">
          ¿Cancelar suscripción?
        </h3>
        <p className="text-sm text-storm-mist mb-5 leading-relaxed">
          Mantendrás acceso completo hasta el{' '}
          <span className="font-semibold text-storm-midnight">{formatDate(renewsAt)}</span>.
          Después de esa fecha tu cuenta quedará en pausa, sin costo, y podrás reactivarla cuando quieras.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-storm-foam text-storm-steel text-sm font-medium hover:border-storm-spray hover:text-storm-midnight transition-colors"
          >
            Mantener suscripción
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── icons ────────────────────────────────────────────────────────────────────
function UserIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
}
function SettingsIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" /><path d="M16.5 10a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" stroke="currentColor" strokeWidth="1.5" /></svg>
}
function StarIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.5 5.5H18l-4.5 3.5 1.5 6L10 14l-5 3 1.5-6L2 7.5h5.5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
}
function DocumentIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 2h8l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" /><path d="M13 2v4h4M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
}
function CardIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M2 9h16M5 13h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
}
function LockIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" /></svg>
}
