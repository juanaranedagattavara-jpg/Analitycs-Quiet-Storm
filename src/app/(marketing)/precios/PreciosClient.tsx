'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'
import { PLAN_PRICING, getMonthlyEquivalent, getYearlyDiscount } from '@/lib/types'
import type { BillingCycle, Plan } from '@/lib/types'
import { ctas } from '@/lib/site'

const PLAN_META: Record<Plan, {
  name: string
  description: string
  features: string[]
  featured: boolean
}> = {
  chica: {
    name: 'Plan Empresa Chica',
    description:
      'Para empresas que necesitan datos de precios. Están por iniciar temporada y necesitan precios históricos para fijar los suyos.',
    features: [
      'Acceso a la plataforma web QSA',
      'Datos de precios de mercado actualizados',
      'Tendencias de mercado por producto y destino',
      'Reportes Price Check',
      'Información de precios históricos por temporada',
    ],
    featured: false,
  },
  grande: {
    name: 'Plan Empresa Grande',
    description:
      'Para empresas que quieren compararse contra su competencia: precios, volúmenes, participación de mercado y desglose por calibre.',
    features: [
      'Acceso completo a la plataforma web QSA',
      'Dashboards interactivos: MUSSEL · SEAFARM · MOSS METRICS',
      'Reportes PDF personalizados (4-5 por cliente)',
      'Análisis competitivo y participación de mercado',
      'Desglose por calibre (CA1-CA4, EN1-EN4, MV1-MV4)',
      'Archivos Excel detallados (producto × destino × empresa × calibre)',
      'Price Check incluido',
      'Múltiples reportes por período',
    ],
    featured: true,
  },
}

export function PreciosClient() {
  const [cycle, setCycle] = useState<BillingCycle>('mensual')

  return (
    <>
      <section className="bg-storm-paper">
        <Container className="pt-20 pb-12 lg:pt-28 lg:pb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
            Precios
          </p>
          <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-medium text-storm-midnight leading-[1.05] tracking-tight max-w-4xl">
            Dos planes. Pricing en UF.{' '}
            <span className="text-sunset-storm">Sin sorpresas.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-storm-steel leading-relaxed">
            Elige tu plan y tu ciclo de facturación: mensual para máxima
            flexibilidad o anual para ahorrar el equivalente a 2 meses. Ambos
            con prueba gratuita de 1 mes sin tarjeta.
          </p>

          <div className="mt-10 inline-flex items-center gap-1 p-1 rounded-full bg-white border border-storm-foam shadow-sm">
            <CycleButton active={cycle === 'mensual'} onClick={() => setCycle('mensual')}>
              Mensual
            </CycleButton>
            <CycleButton active={cycle === 'anual'} onClick={() => setCycle('anual')}>
              Anual
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-lightning text-storm-midnight text-[10px] font-mono font-bold uppercase tracking-wider">
                −17%
              </span>
            </CycleButton>
          </div>
        </Container>
      </section>

      <section className="bg-storm-paper pb-16 lg:pb-24">
        <Container>
          <div id="planes" className="grid lg:grid-cols-2 gap-6">
            <PlanCard plan="chica" cycle={cycle} />
            <PlanCard plan="grande" cycle={cycle} />
          </div>

          <p className="mt-10 text-center text-sm text-storm-steel">
            <span className="font-medium text-storm-midnight">Prueba gratuita de 1 mes</span>{' '}
            sin compromiso. Sin tarjeta de crédito para empezar.
            <br />
            <span className="font-mono text-xs text-storm-mist mt-2 inline-block">
              1 UF ≈ CLP $38.000 (referencia junio 2026)
            </span>
          </p>
        </Container>
      </section>
    </>
  )
}

function CycleButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-10 px-5 rounded-full inline-flex items-center justify-center text-sm font-semibold transition-all',
        active
          ? 'bg-storm-midnight text-white shadow-md'
          : 'text-storm-steel hover:text-storm-midnight'
      )}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

function PlanCard({ plan, cycle }: { plan: Plan; cycle: BillingCycle }) {
  const meta = PLAN_META[plan]
  const price = PLAN_PRICING[plan][cycle]
  const monthlyEq = getMonthlyEquivalent(plan, cycle)
  const yearlySaving = getYearlyDiscount(plan)
  const featured = meta.featured

  return (
    <div
      id={`plan-${plan}`}
      className={cn(
        'scroll-mt-24 rounded-2xl p-8 lg:p-10 relative',
        featured
          ? 'bg-storm-midnight text-white border-2 border-lightning'
          : 'bg-white border-2 border-storm-foam'
      )}
    >
      {featured && (
        <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-lightning text-storm-midnight font-mono text-[10px] uppercase tracking-wider font-bold">
          Más completo
        </div>
      )}

      <div className={cn('font-mono text-[10px] uppercase tracking-[0.18em]', featured ? 'text-lightning' : 'text-storm-mist')}>
        {meta.name}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className={cn('font-display text-6xl lg:text-7xl font-medium', featured ? 'text-white' : 'text-storm-midnight')}>
          {price}
        </span>
        <span className={cn('font-mono text-sm', featured ? 'text-storm-spray' : 'text-storm-steel')}>
          UF / {cycle === 'mensual' ? 'mes' : 'año'}
        </span>
      </div>

      {cycle === 'anual' && (
        <div className={cn('mt-2 text-xs font-mono', featured ? 'text-storm-spray' : 'text-storm-mist')}>
          ≈ {monthlyEq.toFixed(2)} UF/mes · Ahorras {yearlySaving} UF al año
        </div>
      )}

      <p className={cn('mt-5 text-[15px] leading-relaxed', featured ? 'text-storm-spray' : 'text-storm-steel')}>
        {meta.description}
      </p>

      <ul className="mt-8 space-y-3">
        {meta.features.map((f) => (
          <li key={f} className={cn('flex items-start gap-3 text-sm', featured ? 'text-storm-spray' : 'text-storm-steel')}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className={cn('flex-shrink-0 mt-0.5', featured ? 'text-lightning' : 'text-storm-midnight')}
            >
              <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.2" />
              <path d="M5.5 9.5l2.5 2.5L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10 space-y-2">
        <Link
          href={`${ctas.trial.href}?plan=${plan}&cycle=${cycle}`}
          className={cn(
            'block w-full text-center h-14 rounded-full font-semibold inline-flex items-center justify-center transition-all',
            featured
              ? 'btn-lightning'
              : 'border-2 border-storm-midnight text-storm-midnight hover:bg-storm-midnight hover:text-white'
          )}
        >
          Empieza tu prueba gratis →
        </Link>
        <p className={cn('text-center text-xs', featured ? 'text-storm-fog' : 'text-storm-mist')}>
          30 días sin tarjeta · Cancelas cuando quieras
        </p>
      </div>
    </div>
  )
}
