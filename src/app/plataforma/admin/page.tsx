'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { cn } from '@/lib/cn'
import type { ReportType, Industry, MonthOption } from '@/lib/types'

const adminMonthOptions: MonthOption[] = (() => {
  const MN = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const o: MonthOption[] = []
  const now = new Date()
  const ey = now.getFullYear()
  for (let y = 2015; y <= ey + 1; y++) {
    for (let m = 1; m <= 12; m++) {
      o.push({ value: `${y}-${String(m).padStart(2, '0')}`, label: `${MN[m - 1]} ${y}` })
    }
  }
  return o
})()

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const TYPE_OPTIONS: { value: ReportType; label: string }[] = [
  { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'Excel' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'price-check', label: 'Price Check' },
]

const INDUSTRY_OPTIONS: { value: Industry; label: string }[] = [
  { value: 'mitilicultura', label: 'Mitilicultura' },
  { value: 'erizos-jaibas', label: 'Erizos y Jaibas' },
  { value: 'algas', label: 'Algas y Musgos' },
  { value: 'general', label: 'General' },
]

const PLAN_OPTIONS = [
  { value: 'enterprise', label: 'Empresas Medianas y Grandes' },
  { value: 'profesional', label: 'Profesional' },
  { value: 'pyme', label: 'Pymes y MicroPymes' },
  { value: 'ambos', label: 'Todos los planes' },
]

const reportTypeLabels: Record<string, string> = {
  pdf: 'PDF',
  excel: 'Excel',
  dashboard: 'Dashboard',
  'price-check': 'Price Check',
}

const reportTypeBadge: Record<string, string> = {
  pdf: 'bg-red-50 text-red-700 border-red-200',
  excel: 'bg-green-50 text-green-700 border-green-200',
  dashboard: 'bg-blue-50 text-blue-700 border-blue-200',
  'price-check': 'bg-amber-50 text-amber-700 border-amber-200',
}

const industryLabels: Record<string, string> = {
  mitilicultura: 'Mitilicultura',
  'erizos-jaibas': 'Erizos y Jaibas',
  algas: 'Algas y Musgos',
  general: 'General',
}

const statusBadge: Record<string, { label: string; className: string }> = {
  published: { label: 'Publicado', className: 'bg-green-50 text-green-700 border-green-200' },
  draft: { label: 'Borrador', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  processing: { label: 'Procesando', className: 'bg-blue-50 text-blue-700 border-blue-200' },
}

const planBadgeConfig: Record<string, { label: string; className: string }> = {
  enterprise: { label: 'Enterprise', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  profesional: { label: 'Profesional', className: 'bg-purple-50 text-purple-700 border-purple-200' },
  pyme: { label: 'Pyme', className: 'bg-green-50 text-green-700 border-green-200' },
  ambos: { label: 'Todos', className: 'bg-storm-paper text-storm-steel border-storm-foam' },
}

const ACCEPTED_TYPES = '.pdf,.xlsx,.xls,.html,.csv'

interface AdminReport {
  id: string
  title: string
  description: string
  type: ReportType
  industry: Industry
  month: number
  year: number
  plan: 'pyme' | 'profesional' | 'enterprise' | 'ambos'
  tags: string[]
  fileSize?: string
  status: 'draft' | 'published' | 'processing'
  uploadDate: string
}

export default function AdminPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [reports, setReports] = useState<AdminReport[]>([])
  const [loadingReports, setLoadingReports] = useState(true)

  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formType, setFormType] = useState<ReportType>('pdf')
  const [formIndustry, setFormIndustry] = useState<Industry>('mitilicultura')
  const [formMonth, setFormMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [formPlan, setFormPlan] = useState('ambos')
  const [formTags, setFormTags] = useState('')

  const loadReports = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/reports', { credentials: 'same-origin' })
      if (!res.ok) throw new Error('No se pudieron cargar los informes')
      const data = (await res.json()) as { reports: AdminReport[] }
      setReports(data.reports)
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Error', type: 'error' })
    } finally {
      setLoadingReports(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/reports', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('No se pudieron cargar los informes'))))
      .then((data: { reports: AdminReport[] }) => {
        if (!cancelled) setReports(data.reports)
      })
      .catch((err: Error) => {
        if (!cancelled) setToast({ message: err.message, type: 'error' })
      })
      .finally(() => {
        if (!cancelled) setLoadingReports(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => {
    const total = reports.length
    const now = new Date()
    const thisMonth = reports.filter(
      (r) => r.month === now.getMonth() + 1 && r.year === now.getFullYear(),
    ).length
    const enterpriseOnly = reports.filter((r) => r.plan === 'enterprise').length
    const profesionalOnly = reports.filter((r) => r.plan === 'profesional').length
    const pymeOnly = reports.filter((r) => r.plan === 'pyme').length
    const ambos = reports.filter((r) => r.plan === 'ambos').length
    return { total, thisMonth, enterpriseOnly, profesionalOnly, pymeOnly, ambos }
  }, [reports])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) setSelectedFile(files[0])
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) setSelectedFile(files[0])
  }, [])

  const removeFile = useCallback(() => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(1) + ' MB'
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB'
    return bytes + ' B'
  }

  const resetForm = useCallback(() => {
    setFormTitle('')
    setFormDescription('')
    setFormType('pdf')
    setFormIndustry('mitilicultura')
    const now = new Date()
    setFormMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
    setFormPlan('ambos')
    setFormTags('')
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const handleSubmit = useCallback(
    async (asDraft: boolean) => {
      if (!formTitle.trim()) {
        setToast({ message: 'El título es obligatorio', type: 'error' })
        return
      }
      setSubmitting(true)
      try {
        const [yearStr, monthStr] = formMonth.split('-')
        const fd = new FormData()
        fd.set('title', formTitle.trim())
        fd.set('description', formDescription.trim())
        fd.set('type', formType)
        fd.set('industry', formIndustry)
        fd.set('month', monthStr)
        fd.set('year', yearStr)
        fd.set('plan', formPlan)
        fd.set('tags', formTags)
        fd.set('status', asDraft ? 'draft' : 'published')
        if (selectedFile) fd.set('file', selectedFile)

        const res = await fetch('/api/admin/reports', {
          method: 'POST',
          body: fd,
          credentials: 'same-origin',
        })
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        if (!res.ok) {
          throw new Error(data.error || `Error ${res.status}`)
        }
        setToast({
          message: asDraft ? 'Borrador guardado' : 'Informe publicado',
          type: 'success',
        })
        resetForm()
        loadReports()
      } catch (err) {
        setToast({ message: err instanceof Error ? err.message : 'Error', type: 'error' })
      } finally {
        setSubmitting(false)
      }
    },
    [formTitle, formDescription, formType, formIndustry, formMonth, formPlan, formTags, selectedFile, resetForm, loadReports],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      if (deleteConfirm !== id) {
        setDeleteConfirm(id)
        return
      }
      try {
        const res = await fetch(`/api/admin/reports/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          credentials: 'same-origin',
        })
        if (!res.ok) throw new Error('No se pudo eliminar')
        setToast({ message: 'Informe eliminado', type: 'success' })
        setDeleteConfirm(null)
        loadReports()
      } catch (err) {
        setToast({ message: err instanceof Error ? err.message : 'Error', type: 'error' })
      }
    },
    [deleteConfirm, loadReports],
  )

  const inputClasses =
    'w-full px-4 py-3 rounded-xl border border-storm-foam bg-white text-storm-midnight placeholder:text-storm-fog focus:ring-2 focus:ring-lightning/30 focus:border-lightning outline-none transition-all text-sm'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-storm-midnight">
          Panel de Administración
        </h1>
        <p className="text-sm text-storm-mist mt-1">
          Gestiona informes, sube datos y administra la plataforma.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total informes" value={String(stats.total)} />
        <StatCard label="Este mes" value={String(stats.thisMonth)} />
        <StatCard label="Plan Enterprise" value={String(stats.enterpriseOnly)} />
        <StatCard label="Plan Profesional" value={String(stats.profesionalOnly)} />
        <StatCard label="Pyme + Todos" value={String(stats.pymeOnly + stats.ambos)} />
      </div>

      <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
        <div className="px-6 py-4 border-b border-storm-foam">
          <h2 className="font-display text-lg font-semibold text-storm-midnight">Cargar Nuevo Informe</h2>
        </div>

        <div className="p-6 lg:p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'min-h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all',
              isDragging
                ? 'border-lightning bg-lightning/10'
                : selectedFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-storm-fog/40 hover:border-lightning hover:bg-lightning/5',
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex items-center gap-3 px-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600 flex-shrink-0">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                </svg>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-storm-midnight truncate">{selectedFile.name}</p>
                  <p className="text-xs text-storm-mist">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                  className="ml-2 p-1.5 rounded-lg hover:bg-red-50 text-storm-fog hover:text-red-500 transition-colors"
                  aria-label="Eliminar archivo"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className={isDragging ? 'text-lightning' : 'text-storm-fog'}>
                  <path d="M18 6v18M10 14l8-8 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 22v4a4 4 0 004 4h16a4 4 0 004-4v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className={cn('text-sm font-medium', isDragging ? 'text-lightning' : 'text-storm-steel')}>
                  Arrastra el archivo aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-storm-fog">PDF, Excel, HTML, CSV — máx 50 MB</p>
              </>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">
                Título del informe
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ej: Análisis Exportaciones Mejillones — Junio 2026"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">Tipo</label>
              <select value={formType} onChange={(e) => setFormType(e.target.value as ReportType)} className={inputClasses}>
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">Industria</label>
              <select value={formIndustry} onChange={(e) => setFormIndustry(e.target.value as Industry)} className={inputClasses}>
                {INDUSTRY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">Mes</label>
              <select value={formMonth} onChange={(e) => setFormMonth(e.target.value)} className={inputClasses}>
                {adminMonthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">Plan destino</label>
              <select value={formPlan} onChange={(e) => setFormPlan(e.target.value)} className={inputClasses}>
                {PLAN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">Descripción</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                placeholder="Descripción breve del contenido del informe…"
                className={cn(inputClasses, 'resize-none')}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">
                Tags (separados por coma)
              </label>
              <input
                type="text"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="mejillones, precios, exportaciones"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className={cn(
                'px-8 py-3 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2',
                submitting ? 'bg-storm-foam text-storm-fog cursor-not-allowed' : 'btn-lightning',
              )}
            >
              {submitting ? 'Subiendo…' : 'Publicar informe'}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="px-8 py-3 rounded-xl font-semibold text-sm border-2 border-storm-foam text-storm-steel hover:border-storm-spray hover:text-storm-midnight transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Guardar borrador
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
        <div className="px-6 py-4 border-b border-storm-foam">
          <h2 className="font-display text-lg font-semibold text-storm-midnight">Informes</h2>
        </div>

        {loadingReports ? (
          <div className="p-8 text-center text-sm text-storm-mist">Cargando…</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-storm-steel font-medium">Sin informes</p>
            <p className="text-sm text-storm-mist mt-1">Sube el primer informe usando el formulario de arriba.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-storm-paper">
                <tr>
                  <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-6">Título</th>
                  <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-4">Tipo</th>
                  <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-4">Industria</th>
                  <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-4">Mes</th>
                  <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-4">Plan</th>
                  <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-4">Estado</th>
                  <th className="text-right font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-storm-foam">
                {reports.slice(0, 50).map((report) => {
                  const status = statusBadge[report.status]
                  const planBadge = planBadgeConfig[report.plan] || planBadgeConfig.ambos
                  return (
                    <tr key={report.id} className="hover:bg-storm-paper/50 transition-colors">
                      <td className="py-3 px-6">
                        <div className="text-sm font-medium text-storm-midnight max-w-xs truncate">{report.title}</div>
                        <div className="text-xs text-storm-fog mt-0.5">{report.uploadDate}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider border', reportTypeBadge[report.type])}>
                          {reportTypeLabels[report.type]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-storm-steel">{industryLabels[report.industry]}</td>
                      <td className="py-3 px-4 text-sm text-storm-steel font-mono">{MONTH_NAMES_ES[report.month - 1]} {report.year}</td>
                      <td className="py-3 px-4">
                        <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider border', planBadge.className)}>
                          {planBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider border', status.className)}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <button
                          onClick={() => handleDelete(report.id)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            deleteConfirm === report.id
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'text-red-500 hover:bg-red-50',
                          )}
                        >
                          {deleteConfirm === report.id ? 'Confirmar' : 'Eliminar'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {reports.length > 50 && (
              <div className="px-6 py-4 border-t border-storm-foam">
                <p className="text-center text-sm text-storm-mist">Mostrando 50 de {reports.length} informes</p>
              </div>
            )}
          </div>
        )}
      </div>

      {toast && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white',
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-500',
          )}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-storm-foam p-5">
      <p className="font-mono text-xl font-bold text-storm-midnight">{value}</p>
      <p className="text-xs text-storm-mist mt-1">{label}</p>
    </div>
  )
}
