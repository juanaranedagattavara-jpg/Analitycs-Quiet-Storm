'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { usePlan } from '@/lib/plan-context'
import { PLAN_CONFIGS } from '@/lib/types'
import type { Plan } from '@/lib/types'

const user = {
  name: 'Carlos Munoz',
  email: 'carlos@toralla.cl',
  company: 'Toralla S.A.',
  memberSince: 'Marzo 2020',
  reportsViewed: 12,
  exportsDownloaded: 8,
  renewalDate: '15 Marzo 2027',
}

const planPricing: Record<Plan, { price: string; period: string }> = {
  grande: { price: '70 UF', period: 'ano' },
  chica: { price: '0.75 UF', period: 'mes' },
}

const FEATURE_COMPARISON: { feature: string; grande: string; chica: string }[] = [
  { feature: 'Informes mensuales', grande: '7 informes', chica: '4 informes' },
  { feature: 'Ranking de empresas', grande: 'Completo', chica: 'No incluido' },
  { feature: 'Desglose por calibre', grande: 'CA0-CA4 detallado', chica: 'No incluido' },
  { feature: 'Analisis competitivo', grande: 'Si', chica: 'No incluido' },
  { feature: 'Analisis por destino', grande: 'Detallado', chica: 'General' },
  { feature: 'Datos por empresa', grande: 'Completo', chica: 'No incluido' },
  { feature: 'Price Check', grande: 'Incluido', chica: 'Incluido' },
  { feature: 'Tendencias de mercado', grande: 'Detallado', chica: 'General' },
  { feature: 'Exportar a Excel', grande: 'Si', chica: 'No incluido' },
  { feature: 'Dashboard interactivo', grande: 'Completo', chica: 'Basico' },
  { feature: 'Historicos completos', grande: 'Si', chica: 'Limitado' },
]

export default function CuentaPage() {
  const { plan, setPlan } = usePlan()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [language, setLanguage] = useState('es')
  const [showPlanModal, setShowPlanModal] = useState(false)

  const currentPlanConfig = PLAN_CONFIGS[plan]
  const pricing = planPricing[plan]
  const reportsMax = plan === 'grande' ? 30 : 15
  const exportsMax = plan === 'grande' ? 20 : 5

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-storm-midnight">
          Mi Cuenta
        </h1>
        <p className="text-sm text-storm-mist mt-1">
          Gestiona tu perfil, plan y preferencias
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Profile + Plan */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Info Card */}
          <div className="bg-white rounded-2xl border border-storm-foam p-6 lg:p-8">
            <h2 className="font-display text-lg font-semibold text-storm-midnight mb-6 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-storm-paper text-storm-mist">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              Informacion Personal
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <InfoField label="Nombre" value={user.name} />
              <InfoField label="Email" value={user.email} />
              <InfoField label="Empresa" value={user.company} />
              <InfoField label="Miembro desde" value={user.memberSince} />
            </div>
          </div>

          {/* Plan Details Card */}
          <div className={cn(
            'rounded-2xl p-6 lg:p-8 border-2',
            plan === 'grande'
              ? 'border-lightning bg-lightning/5'
              : 'border-storm-spray bg-storm-spray/5'
          )}>
            <h2 className="font-display text-lg font-semibold text-storm-midnight mb-6 flex items-center gap-3">
              <div className={cn(
                'p-2.5 rounded-xl',
                plan === 'grande' ? 'bg-lightning/20 text-storm-midnight' : 'bg-storm-spray/30 text-storm-steel'
              )}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2l2.5 5.5H18l-4.5 3.5 1.5 6L10 14l-5 3 1.5-6L2 7.5h5.5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              Detalle del Plan
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-storm-mist mb-1">
                  Plan actual
                </div>
                <div className="font-display text-3xl font-medium text-storm-midnight">
                  {plan === 'grande' ? 'Empresa Grande' : 'Empresa Chica'}
                </div>
              </div>
              <div className="sm:ml-auto text-right">
                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-storm-mist mb-1">
                  Precio
                </div>
                <div className="font-display text-2xl font-medium text-storm-midnight">
                  {pricing.price}/{pricing.period}
                </div>
              </div>
            </div>

            {/* Plan features summary */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <FeaturePill
                label="Informes mensuales"
                value={`${currentPlanConfig.features.reportesCantidad}`}
                enabled={true}
              />
              <FeaturePill
                label="Ranking de empresas"
                value={currentPlanConfig.features.rankingEmpresas ? 'Si' : 'No'}
                enabled={currentPlanConfig.features.rankingEmpresas}
              />
              <FeaturePill
                label="Desglose calibre"
                value={currentPlanConfig.features.desgloseCalibre ? 'Si' : 'No'}
                enabled={currentPlanConfig.features.desgloseCalibre}
              />
              <FeaturePill
                label="Analisis competitivo"
                value={currentPlanConfig.features.analisisCompetitivo ? 'Si' : 'No'}
                enabled={currentPlanConfig.features.analisisCompetitivo}
              />
              <FeaturePill
                label="Exportar Excel"
                value={currentPlanConfig.features.exportExcel ? 'Si' : 'No'}
                enabled={currentPlanConfig.features.exportExcel}
              />
              <FeaturePill
                label="Historicos completos"
                value={currentPlanConfig.features.historicosCompletos ? 'Si' : 'No'}
                enabled={currentPlanConfig.features.historicosCompletos}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-storm-foam/60">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-storm-mist mb-1">
                  Proxima renovacion
                </div>
                <div className="text-sm font-medium text-storm-midnight">
                  {user.renewalDate}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-storm-mist mb-1">
                  Estado
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Activo
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowPlanModal(true)}
                className={cn(
                  'px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                  plan === 'grande'
                    ? 'bg-storm-midnight text-white hover:bg-storm-deep'
                    : 'btn-lightning'
                )}
              >
                {plan === 'grande' ? 'Cambiar plan' : 'Mejorar a Plan Grande'}
              </button>
              <button className="px-5 py-2.5 rounded-xl border border-storm-foam text-storm-steel text-sm font-medium hover:border-storm-spray hover:text-storm-midnight transition-colors">
                Ver historial de pagos
              </button>
            </div>
          </div>

          {/* Plan Comparison Table */}
          <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
            <div className="px-6 py-4 border-b border-storm-foam">
              <h2 className="font-display text-lg font-semibold text-storm-midnight">
                Comparacion de Planes
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-storm-paper">
                    <th className="px-6 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist">
                      Caracteristica
                    </th>
                    <th className={cn(
                      'px-6 py-3 text-center font-mono text-[11px] uppercase tracking-wider',
                      plan === 'grande' ? 'text-lightning bg-storm-midnight text-white' : 'text-storm-mist'
                    )}>
                      Empresa Grande
                      {plan === 'grande' && (
                        <span className="ml-1 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-lightning text-storm-midnight">
                          ACTUAL
                        </span>
                      )}
                    </th>
                    <th className={cn(
                      'px-6 py-3 text-center font-mono text-[11px] uppercase tracking-wider',
                      plan === 'chica' ? 'text-white bg-storm-midnight' : 'text-storm-mist'
                    )}>
                      Empresa Chica
                      {plan === 'chica' && (
                        <span className="ml-1 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-lightning text-storm-midnight">
                          ACTUAL
                        </span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-storm-foam">
                  <tr className="bg-storm-paper/50">
                    <td className="px-6 py-3 font-medium text-storm-midnight">Precio</td>
                    <td className="px-6 py-3 text-center font-mono font-semibold text-storm-midnight">60-80 UF/ano</td>
                    <td className="px-6 py-3 text-center font-mono font-semibold text-storm-midnight">0.5-1 UF/mes</td>
                  </tr>
                  {FEATURE_COMPARISON.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-storm-paper/30'}>
                      <td className="px-6 py-3 text-storm-steel">{row.feature}</td>
                      <td className="px-6 py-3 text-center">
                        {row.grande.includes('No') ? (
                          <span className="text-storm-fog">{row.grande}</span>
                        ) : (
                          <span className="text-storm-midnight font-medium flex items-center justify-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-green-600 flex-shrink-0">
                              <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {row.grande}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {row.chica.includes('No') ? (
                          <span className="text-storm-fog flex items-center justify-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-storm-fog flex-shrink-0">
                              <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            {row.chica}
                          </span>
                        ) : (
                          <span className="text-storm-midnight font-medium flex items-center justify-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-green-600 flex-shrink-0">
                              <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {row.chica}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-2xl border border-storm-foam p-6 lg:p-8">
            <h2 className="font-display text-lg font-semibold text-storm-midnight mb-6 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-storm-paper text-storm-mist">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M16.5 10a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              Configuracion
            </h2>

            <div className="space-y-6">
              {/* Email notifications toggle */}
              <div className="flex items-center justify-between py-3 border-b border-storm-foam">
                <div>
                  <div className="text-sm font-medium text-storm-midnight">
                    Notificaciones por email
                  </div>
                  <div className="text-xs text-storm-mist mt-0.5">
                    Recibe alertas cuando se publiquen nuevos informes
                  </div>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={cn(
                    'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
                    emailNotifications ? 'bg-lightning' : 'bg-storm-fog'
                  )}
                  role="switch"
                  aria-checked={emailNotifications}
                >
                  <span
                    className={cn(
                      'inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform',
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>

              {/* Language preference */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium text-storm-midnight">
                    Idioma preferido
                  </div>
                  <div className="text-xs text-storm-mist mt-0.5">
                    Idioma de la interfaz y los informes
                  </div>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-storm-foam bg-white text-storm-midnight text-sm focus:ring-2 focus:ring-lightning/30 focus:border-lightning outline-none"
                >
                  <option value="es">Espanol</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Usage Stats + Actions */}
        <div className="space-y-6">
          {/* Current Plan Badge */}
          <div className={cn(
            'rounded-2xl p-6 border-2',
            plan === 'grande'
              ? 'border-lightning bg-lightning/5'
              : 'border-storm-spray bg-storm-spray/5'
          )}>
            <div className="text-center">
              <div className={cn(
                'w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3',
                plan === 'grande' ? 'bg-lightning/20' : 'bg-storm-spray/30'
              )}>
                {plan === 'grande' ? (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 3l3.5 7.5H25l-6 5 2 8L14 19l-7 4.5 2-8-6-5h7.5L14 3z" stroke="#f7c948" strokeWidth="1.5" strokeLinejoin="round" fill="#f7c948" fillOpacity="0.3" />
                  </svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="10" stroke="#5b7a8f" strokeWidth="1.5" />
                    <path d="M14 8v12M10 11h5a2 2 0 010 4H10" stroke="#5b7a8f" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <h3 className="font-display text-lg font-semibold text-storm-midnight">
                {plan === 'grande' ? 'Plan Grande' : 'Plan Chica'}
              </h3>
              <p className="text-sm text-storm-mist mt-1">
                {pricing.price}/{pricing.period}
              </p>
              <p className="text-xs text-storm-fog mt-2">
                {currentPlanConfig.features.reportesCantidad} informes/mes
              </p>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-white rounded-2xl border border-storm-foam p-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-5">
              Uso este mes
            </h3>
            <div className="space-y-5">
              <UsageStat
                label="Informes visualizados"
                value={user.reportsViewed}
                max={reportsMax}
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                }
              />
              <UsageStat
                label="Exportaciones descargadas"
                value={user.exportsDownloaded}
                max={exportsMax}
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 10v3a1 1 0 001 1h10a1 1 0 001-1v-3M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-white rounded-2xl border border-storm-foam p-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-5">
              Acceso rapido
            </h3>
            <div className="space-y-2">
              <QuickLink label="Ir al Dashboard" href="/plataforma" />
              <QuickLink label="Archivo historico" href="/plataforma/historico" />
              <QuickLink label="Ver informes" href="/plataforma/informes" />
              <QuickLink label="Soporte" href="/contacto" />
            </div>
          </div>

          {/* Account Info */}
          <div className="rounded-2xl border border-storm-foam bg-storm-paper p-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-4">
              Cuenta
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-storm-midnight text-white flex items-center justify-center font-display text-sm font-medium">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium text-storm-midnight">
                    {user.name}
                  </div>
                  <div className="text-xs text-storm-mist">{user.email}</div>
                </div>
              </div>
            </div>
            <button className="mt-6 w-full px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-colors">
              Cerrar sesion
            </button>
          </div>
        </div>
      </div>

      {/* Plan Change Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-storm-midnight/50 backdrop-blur-sm" onClick={() => setShowPlanModal(false)} />
          <div className="relative bg-white rounded-2xl border border-storm-foam p-8 max-w-md w-full shadow-2xl">
            <button
              onClick={() => setShowPlanModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-storm-fog hover:text-storm-midnight hover:bg-storm-paper transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
            <h3 className="font-display text-xl font-semibold text-storm-midnight mb-2">
              Cambiar Plan
            </h3>
            <p className="text-sm text-storm-mist mb-6">
              Selecciona el plan que mejor se ajuste a tus necesidades.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => { setPlan('grande'); setShowPlanModal(false) }}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left transition-all',
                  plan === 'grande'
                    ? 'border-lightning bg-lightning/5'
                    : 'border-storm-foam hover:border-storm-spray'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-base font-semibold text-storm-midnight">Empresa Grande</span>
                  <span className="font-mono text-sm font-semibold text-storm-midnight">60-80 UF/ano</span>
                </div>
                <p className="text-xs text-storm-mist">Rankings, calibres, analisis competitivo, 7 informes/mes, Excel</p>
                {plan === 'grande' && (
                  <span className="inline-flex mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-lightning text-storm-midnight">Plan actual</span>
                )}
              </button>
              <button
                onClick={() => { setPlan('chica'); setShowPlanModal(false) }}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left transition-all',
                  plan === 'chica'
                    ? 'border-lightning bg-lightning/5'
                    : 'border-storm-foam hover:border-storm-spray'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-base font-semibold text-storm-midnight">Empresa Chica</span>
                  <span className="font-mono text-sm font-semibold text-storm-midnight">0.5-1 UF/mes</span>
                </div>
                <p className="text-xs text-storm-mist">Price check, tendencias generales, 4 informes/mes</p>
                {plan === 'chica' && (
                  <span className="inline-flex mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-lightning text-storm-midnight">Plan actual</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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

function FeaturePill({ label, value, enabled }: { label: string; value: string; enabled: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm ${enabled ? 'bg-green-50/50' : 'bg-storm-paper/50'}`}>
      <span className="text-storm-steel">{label}</span>
      <span className={`font-medium ${enabled ? 'text-green-700' : 'text-storm-fog'}`}>{value}</span>
    </div>
  )
}

function UsageStat({ label, value, max, icon }: { label: string; value: number; max: number; icon?: React.ReactNode }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-xs text-storm-mist flex items-center gap-1.5">{icon}{label}</span>
        <span className="font-mono text-xs text-storm-steel">{value}/{max}</span>
      </div>
      <div className="w-full h-2 bg-storm-foam rounded-full overflow-hidden">
        <div className="h-full bg-lightning rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function QuickLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-storm-steel hover:bg-storm-paper hover:text-storm-midnight transition-colors">
      {label}
    </a>
  )
}
