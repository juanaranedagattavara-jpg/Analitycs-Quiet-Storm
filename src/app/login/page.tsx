import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Container } from '@/components/ui/Container'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar sesión · QSA',
  description: 'Accede a tu plataforma de inteligencia de mercado para el sector marino chileno.',
}

export default function LoginPage() {
  return (
    <section className="bg-storm-paper min-h-screen py-20 lg:py-28">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-3">
              Plataforma QSA
            </p>
            <h1 className="font-display text-3xl lg:text-4xl font-medium text-storm-midnight leading-tight tracking-tight">
              Bienvenido de vuelta
            </h1>
            <p className="mt-3 text-storm-steel">
              Ingresa con tu cuenta para acceder a tus informes.
            </p>
          </div>
          <Suspense fallback={<LoginFallback />}>
            <LoginForm />
          </Suspense>
        </div>
      </Container>
    </section>
  )
}

function LoginFallback() {
  return (
    <div className="rounded-2xl bg-white border border-storm-foam p-8 animate-pulse">
      <div className="space-y-4">
        <div className="h-12 bg-storm-paper rounded-lg" />
        <div className="h-12 bg-storm-paper rounded-lg" />
        <div className="h-14 bg-storm-foam rounded-full mt-2" />
      </div>
    </div>
  )
}
