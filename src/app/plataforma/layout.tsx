'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { PlanProvider, usePlan } from '@/lib/plan-context'
import type { Plan } from '@/lib/types'

const navItems = [
  {
    href: '/plataforma',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="7" height="7" rx="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: '/plataforma/informes',
    label: 'Informes',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2h8l4 4v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
        <path d="M12 2v4h4" />
        <path d="M7 10h6M7 13h6M7 16h3" />
      </svg>
    ),
  },
  {
    href: '/plataforma/historico',
    label: 'Historico',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v4l3 2" />
      </svg>
    ),
  },
  {
    href: '/plataforma/admin',
    label: 'Admin',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="3" />
        <path d="M10 1v2M10 17v2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M1 10h2M17 10h2M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
]

function PlanSwitcher() {
  const { plan, setPlan } = usePlan()

  return (
    <div className="px-3 py-3">
      <p className="px-3 mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-storm-fog">
        Plan activo
      </p>
      <div className="flex rounded-lg bg-storm-deep p-1 gap-1">
        <button
          onClick={() => setPlan('grande')}
          className={cn(
            'flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200',
            plan === 'grande'
              ? 'bg-lightning text-storm-midnight shadow-sm'
              : 'text-storm-fog hover:text-storm-spray'
          )}
        >
          Empresa Grande
        </button>
        <button
          onClick={() => setPlan('chica')}
          className={cn(
            'flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200',
            plan === 'chica'
              ? 'bg-lightning text-storm-midnight shadow-sm'
              : 'text-storm-fog hover:text-storm-spray'
          )}
        >
          Empresa Chica
        </button>
      </div>
      <div className="mt-2 px-3">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-[10px] font-medium',
            plan === 'grande' ? 'text-lightning' : 'text-storm-spray'
          )}
        >
          <span className={cn(
            'w-1.5 h-1.5 rounded-full',
            plan === 'grande' ? 'bg-lightning' : 'bg-storm-spray'
          )} />
          {plan === 'grande' ? '60-80 UF/ano - 7 informes/mes' : '0.5-1 UF/mes - 4 informes/mes'}
        </span>
      </div>
    </div>
  )
}

function SidebarContent({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void }) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-storm-midnight flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-storm-deep">
        <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="sidebarLogoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1b3a57" />
                <stop offset="100%" stopColor="#3d5a73" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="20" fill="url(#sidebarLogoGrad)" />
            <path
              d="M11 22c0-2.8 2.2-5 5-5 .5-2.4 2.6-4.2 5.1-4.2 2.9 0 5.2 2.3 5.2 5.2 0 .2 0 .4 0 .6 1.5.4 2.7 1.7 2.7 3.4 0 1.9-1.6 3.5-3.5 3.5H15c-2.2 0-4-1.8-4-3.5z"
              fill="#dce8ef"
              opacity="0.9"
            />
            <path d="M21 21l-3 5h3l-2 5 5-7h-3l2-3h-2z" fill="#f7c948" />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display text-base font-semibold text-white tracking-tight">
            QSA
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-storm-fog">
            Plataforma
          </span>
        </div>
        {/* Close button on mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="ml-auto lg:hidden p-1 text-storm-fog hover:text-white transition-colors"
          aria-label="Cerrar menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 5l10 10M5 15L15 5" />
          </svg>
        </button>
      </div>

      {/* Volver al sitio */}
      <div className="px-3 pt-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-storm-fog hover:text-storm-spray hover:bg-storm-deep/60 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Volver al sitio
        </Link>
      </div>

      {/* Plan Switcher */}
      <PlanSwitcher />

      {/* Nav links + user (Mi Cuenta sits directly under Admin) */}
      <nav className="px-3 py-2 space-y-1 overflow-y-auto border-t border-storm-deep">
        {navItems.map((item) => {
          const isActive =
            item.href === '/plataforma'
              ? pathname === '/plataforma'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-storm-deep text-lightning'
                  : 'text-storm-spray hover:bg-storm-deep/60 hover:text-white'
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}

        <Link
          href="/plataforma/cuenta"
          onClick={() => setSidebarOpen(false)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            pathname.startsWith('/plataforma/cuenta')
              ? 'bg-storm-deep text-lightning'
              : 'text-storm-spray hover:bg-storm-deep/60 hover:text-white'
          )}
        >
          <div className="w-8 h-8 rounded-full bg-storm-navy flex items-center justify-center text-storm-fog text-xs font-bold flex-shrink-0">
            CM
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm truncate">Mi Cuenta</span>
            <span className="text-[10px] text-storm-fog truncate">Carlos Munoz</span>
          </div>
        </Link>
      </nav>

      <div className="flex-1" />
    </aside>
  )
}

export default function PlataformaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <PlanProvider>
      <div className="flex min-h-screen bg-storm-paper">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-storm-midnight/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <SidebarContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <header className="sticky top-0 z-20 flex items-center h-14 px-4 bg-white border-b border-storm-foam lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-storm-midnight"
              aria-label="Abrir menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div className="ml-3 flex items-center gap-2">
              <span className="font-display text-base font-semibold text-storm-midnight">QSA</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-storm-mist">Plataforma</span>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </PlanProvider>
  )
}