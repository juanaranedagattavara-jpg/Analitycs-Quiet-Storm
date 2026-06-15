'use client'

import { useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { register, ApiError, type RegisterPayload } from '@/lib/auth/client'

const INDUSTRIES = [
  { value: 'mitilicultura', label: 'Mitilicultura (mejillones)' },
  { value: 'erizos-jaibas', label: 'Erizos y Jaibas' },
  { value: 'algas', label: 'Algas y Musgos' },
  { value: 'otra', label: 'Otra' },
] as const

const COMPANY_SIZES = [
  { value: 'pyme', label: 'Pyme o MicroPyme · necesito datos de precios' },
  { value: 'profesional', label: 'Empresa en crecimiento · necesito análisis competitivo' },
  { value: 'enterprise', label: 'Empresa mediana o grande · necesito inteligencia completa' },
  { value: 'no-se', label: 'No estoy seguro · quiero explorar' },
] as const

interface FieldErrors {
  name?: string
  email?: string
  password?: string
  company?: string
  phone?: string
}

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function RegistroForm() {
  const router = useRouter()
  const params = useSearchParams()
  const planParam = params.get('plan')
  const intent =
    planParam === 'pyme'
      ? 'pyme'
      : planParam === 'profesional'
        ? 'profesional'
        : planParam === 'enterprise'
          ? 'enterprise'
          : 'enterprise'

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [industry, setIndustry] = useState<(typeof INDUSTRIES)[number]['value']>('mitilicultura')
  const [size, setSize] = useState<(typeof COMPANY_SIZES)[number]['value']>(intent)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  function validate(): FieldErrors {
    const next: FieldErrors = {}
    if (!name.trim()) next.name = 'Tu nombre es obligatorio'
    if (!email.trim()) next.email = 'El email es obligatorio'
    else if (!validateEmail(email)) next.email = 'Email inválido'
    if (!password) next.password = 'La contraseña es obligatoria'
    else if (password.length < 8) next.password = 'Mínimo 8 caracteres'
    if (!company.trim()) next.company = 'El nombre de la empresa es obligatorio'
    if (phone && !/^[\d\s+()-]{6,}$/.test(phone)) next.phone = 'Teléfono inválido'
    return next
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError(null)
    setTouched({ name: true, email: true, password: true, company: true, phone: true })
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setSubmitting(true)
    try {
      const payload: RegisterPayload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        company: company.trim(),
        phone: phone.trim() || undefined,
        industry,
        size,
        acceptedTerms: true,
      }
      await register(payload)
      router.push('/registro/confirmacion')
      router.refresh()
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setServerError('Ya existe una cuenta con ese email. Intenta iniciar sesión.')
        } else if (err.status === 429) {
          setServerError('Demasiados intentos. Espera un momento e intenta de nuevo.')
        } else {
          setServerError(err.message || 'No pudimos completar el registro.')
        }
      } else {
        setServerError('Hubo un problema. Verifica tu conexión e intenta de nuevo.')
      }
      setSubmitting(false)
    }
  }

  const inputClasses = (key: keyof FieldErrors) =>
    cn(
      'w-full px-4 py-3 rounded-xl border bg-white text-storm-midnight placeholder:text-storm-fog focus:ring-2 focus:ring-lightning/30 outline-none transition-all text-sm',
      errors[key] && touched[key]
        ? 'border-red-300 focus:border-red-400'
        : 'border-storm-foam focus:border-lightning',
    )

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white border border-storm-foam p-8 lg:p-10 shadow-sm"
      noValidate
    >
      <h2 className="font-display text-2xl font-semibold text-storm-midnight">Crea tu cuenta</h2>
      <p className="text-sm text-storm-mist mt-1">Tarda menos de 1 minuto. Sin tarjeta.</p>

      {serverError && (
        <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Nombre completo *" htmlFor="r-name" error={touched.name ? errors.name : undefined}>
          <input
            id="r-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            placeholder="Juan Aranéda"
            className={inputClasses('name')}
            aria-invalid={!!(touched.name && errors.name)}
          />
        </Field>

        <Field label="Email corporativo *" htmlFor="r-email" error={touched.email ? errors.email : undefined}>
          <input
            id="r-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="tu@empresa.cl"
            className={inputClasses('email')}
            aria-invalid={!!(touched.email && errors.email)}
          />
        </Field>

        <Field label="Contraseña *" htmlFor="r-password" error={touched.password ? errors.password : undefined}>
          <input
            id="r-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="Mínimo 8 caracteres"
            className={inputClasses('password')}
            aria-invalid={!!(touched.password && errors.password)}
          />
        </Field>

        <Field label="Empresa *" htmlFor="r-company" error={touched.company ? errors.company : undefined}>
          <input
            id="r-company"
            type="text"
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, company: true }))}
            placeholder="Toralla S.A."
            className={inputClasses('company')}
            aria-invalid={!!(touched.company && errors.company)}
          />
        </Field>

        <Field label="Teléfono (opcional)" htmlFor="r-phone" error={touched.phone ? errors.phone : undefined}>
          <input
            id="r-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            placeholder="+56 9 1234 5678"
            className={inputClasses('phone')}
            aria-invalid={!!(touched.phone && errors.phone)}
          />
        </Field>

        <Field label="Industria" htmlFor="r-industry">
          <select
            id="r-industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value as typeof industry)}
            className={inputClasses('name')}
          >
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Tipo de empresa" htmlFor="r-size">
          <select
            id="r-size"
            value={size}
            onChange={(e) => setSize(e.target.value as typeof size)}
            className={inputClasses('name')}
          >
            {COMPANY_SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <label className="mt-6 flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-storm-foam text-lightning focus:ring-lightning"
          required
        />
        <span className="text-sm text-storm-steel leading-relaxed">
          Acepto los{' '}
          <Link href="/legal/terminos" className="underline text-storm-midnight">
            términos
          </Link>{' '}
          y la{' '}
          <Link href="/legal/privacidad" className="underline text-storm-midnight">
            política de privacidad
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting || !acceptedTerms}
        className={cn(
          'mt-8 w-full h-14 rounded-full font-semibold inline-flex items-center justify-center gap-2 transition-all',
          submitting || !acceptedTerms
            ? 'bg-storm-foam text-storm-fog cursor-not-allowed'
            : 'btn-lightning',
        )}
      >
        {submitting ? (
          <>
            <Spinner /> Creando cuenta…
          </>
        ) : (
          <>Empezar prueba gratis →</>
        )}
      </button>

      <p className="text-center mt-4 text-xs text-storm-fog">
        Sin tarjeta. Cancelas cuando quieras desde Mi Cuenta.
      </p>

      <p className="text-center mt-4 text-sm text-storm-mist">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-semibold text-storm-midnight hover:text-lightning">
          Iniciar sesión
        </Link>
      </p>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="animate-spin">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
      <path
        d="M14 8a6 6 0 00-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
