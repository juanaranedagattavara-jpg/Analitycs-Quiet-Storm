'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'
import { PLAN_PRICING, PLAN_LABELS, getMonthlyEquivalent, getYearlyDiscount } from '@/lib/types'
import type { BillingCycle, Plan } from '@/lib/types'
import { ctas } from '@/lib/site'

const PLAN_META: Record<Plan, {
  name: string
  description: string
  features: string[]
  featured: boolean
}> = {
  pyme: {
    name: PLAN_LABELS.pyme,
    description:
      'Para empresas que necesitan datos de precios. Están por iniciar temporada y necesitan precios históricos para fijar los suyos.',
    features: [
      'Price Check',
      'Resumen Ejecutivo',
      'Base de Datos Compilada',
      'Beautiful Soup',
      'Country Index',
    ],
    featured: false,
  },
  profesional: {
    name: PLAN_LABELS.profesional,
    description:
      'Análisis competitivo, outliers y landscape completo para empresas que necesitan posicionarse estratégicamente.',
    features: [
      'Price Check',
      'Resumen Ejecutivo',
      'Base de Datos Compilada',
      'Beautiful Soup',
      'Country Index',
      'Outliers Analysis',
      'Competitive Landscape',
      'Análisis de Calibres',
    ],
    featured: true,
  },
  enterprise: {
    name: PLAN_LABELS.enterprise,
    description:
      'Inteligencia competitiva completa: rankings, market share, calibres, flujos de bienes, clusters y análisis de tendencias.',
    features: [
      'Price Check',
      'Resumen Ejecutivo',
      'Base de Datos Compilada',
      'Beautiful Soup',
      'Country Index',
      'Outliers Analysis',
      'Competitive Landscape',
      'Análisis de Calibres',
      'Análisis de Patrones de Mercado',
      'Posicionamiento',
      'Ranking de Empresas',
      'Ranking de Mercados',
      'Análisis de Mix de Productos',
      'Market Share',
      'Desempeño Comparado',
      'Informe de Clientes Extranjeros',
      'Análisis de Tendencias',
      'Análisis de Flujos de Bienes',
      'Análisis de Clusters Jerárquicos',
    ],
    featured: false,
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
            Tres planes. Pricing en UF.{' '}
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
          <div id="planes" className="grid lg:grid-cols-3 gap-6">
            <PlanCard plan="pyme" cycle={cycle} />
            <PlanCard plan="profesional" cycle={cycle} />
            <PlanCard plan="enterprise" cycle={cycle} />
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
          Mejor valor
        </div>
      )}

      <div className={cn('font-mono text-[10px] uppercase tracking-[0.18em]', featured ? 'text-lightning' : 'text-storm-mist')}>
        {meta.name}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className={cn('font-display text-6xl lg:text-7xl font-medium', featured ? 'text-white' : 'text-storm-midnight')}>
          {plan === 'pyme' ? 1 : price}
        </span>
        <span className={cn('font-mono text-sm', featured ? 'text-storm-spray' : 'text-storm-steel')}>
          UF / {plan === 'pyme' ? 'mes' : cycle === 'mensual' ? 'mes' : 'año'}
        </span>
      </div>

      {cycle === 'anual' && plan !== 'pyme' && (
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
