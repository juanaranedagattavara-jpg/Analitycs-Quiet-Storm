'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { cn } from '@/lib/cn'
import { getRealReports } from '@/lib/real-reports'
import type { ReportType, Industry, UploadedFile, MonthOption } from '@/lib/types'

// Month/year options for the admin upload form. Covers a wide range so
// admins can backfill or schedule a new upload.
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

// ─── Constants ──────────────────────────────────────────────────────────────

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

// ─── Page Component ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formType, setFormType] = useState<ReportType>('pdf')
  const [formIndustry, setFormIndustry] = useState<Industry>('mitilicultura')
  const [formMonth, setFormMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [formPlan, setFormPlan] = useState('ambos')
  const [formDescription, setFormDescription] = useState('')
  const [formTags, setFormTags] = useState('')

  // Combined table: real reports + admin-created uploads
  const allReports = useMemo(() => {
    const real = getRealReports()
    const combined: Array<{
      id: string
      title: string
      type: ReportType
      industry: Industry
      month: number
      year: number
      plan: string
      status: 'published' | 'draft' | 'processing'
      uploadDate: string
    }> = real.map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      industry: r.industry,
      month: r.month,
      year: r.year,
      plan: r.plan,
      status: 'published' as const,
      uploadDate: r.uploadDate,
    }))

    for (const uf of uploadedFiles) {
      combined.push({
        id: uf.id,
        title: uf.name,
        type: uf.type,
        industry: uf.industry,
        month: uf.month,
        year: uf.year,
        plan: 'ambos',
        status: uf.status,
        uploadDate: uf.uploadDate,
      })
    }

    combined.sort((a, b) => b.uploadDate.localeCompare(a.uploadDate))
    return combined
  }, [uploadedFiles])

  const stats = useMemo(() => {
    const total = allReports.length
    const now = new Date()
    const thisMonth = allReports.filter(
      (r) => r.month === now.getMonth() + 1 && r.year === now.getFullYear()
    ).length
    const enterpriseOnly = allReports.filter((r) => r.plan === 'enterprise').length
    const profesionalOnly = allReports.filter((r) => r.plan === 'profesional').length
    const pymeOnly = allReports.filter((r) => r.plan === 'pyme').length
    const ambos = allReports.filter((r) => r.plan === 'ambos').length
    return { total, thisMonth, enterpriseOnly, profesionalOnly, pymeOnly, ambos }
  }, [allReports])

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Drag handlers
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
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }, [])

  const removeFile = useCallback(() => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(1) + ' MB'
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB'
    return bytes + ' B'
  }

  const handleSubmit = useCallback(
    (asDraft: boolean) => {
      if (!formTitle.trim()) {
        setToast({ message: 'El titulo del informe es obligatorio', type: 'error' })
        return
      }

      const [yearStr, monthStr] = formMonth.split('-')
      const newFile: UploadedFile = {
        id: `upload-${Date.now()}`,
        name: formTitle,
        type: formType,
        industry: formIndustry,
        month: parseInt(monthStr, 10),
        year: parseInt(yearStr, 10),
        size: selectedFile ? formatFileSize(selectedFile.size) : '0 KB',
        uploadDate: new Date().toISOString().split('T')[0],
        status: asDraft ? 'draft' : 'published',
      }

      setUploadedFiles((prev) => [newFile, ...prev])
      setToast({
        message: asDraft
          ? 'Borrador guardado correctamente'
          : 'Informe publicado correctamente',
        type: 'success',
      })

      // Reset form
      setFormTitle('')
      setFormType('pdf')
      setFormIndustry('mitilicultura')
      {
        const now = new Date()
        setFormMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
      }
      setFormPlan('ambos')
      setFormDescription('')
      setFormTags('')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    [formTitle, formType, formIndustry, formMonth, selectedFile]
  )

  const handleDelete = useCallback(
    (id: string) => {
      if (deleteConfirm === id) {
        setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
        setDeleteConfirm(null)
        setToast({ message: 'Informe eliminado', type: 'success' })
      } else {
        setDeleteConfirm(id)
      }
    },
    [deleteConfirm]
  )

  const inputClasses = 'w-full px-4 py-3 rounded-xl border border-storm-foam bg-white text-storm-midnight placeholder:text-storm-fog focus:ring-2 focus:ring-lightning/30 focus:border-lightning outline-none transition-all text-sm'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-storm-midnight">
          Panel de Administracion
        </h1>
        <p className="text-sm text-storm-mist mt-1">
          Gestiona informes, sube datos y administra la plataforma
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total informes"
          value={String(stats.total)}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3h14v14H3V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 8h6M7 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
        <StatCard
          label="Este mes"
          value={String(stats.thisMonth)}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
        <StatCard
          label="Plan Enterprise"
          value={String(stats.enterpriseOnly)}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2l2.5 5.5H18l-4.5 3.5 1.5 6L10 14l-5 3 1.5-6L2 7.5h5.5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatCard
          label="Plan Pyme"
          value={String(stats.pymeOnly)}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 6v8M7 8.5h3.5a1.5 1.5 0 010 3H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
        <StatCard
          label="Todos los planes"
          value={String(stats.ambos)}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="8" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          }
        />
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
        <div className="px-6 py-4 border-b border-storm-foam">
          <h2 className="font-display text-lg font-semibold text-storm-midnight">
            Cargar Nuevo Informe
          </h2>
        </div>

        <div className="p-6 lg:p-8">
          {/* Drop Zone */}
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
                : 'border-storm-fog/40 hover:border-lightning hover:bg-lightning/5'
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
                  <p className="text-sm font-medium text-storm-midnight truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-storm-mist">
                    {formatFileSize(selectedFile.size)}
                  </p>
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
                  Arrastra archivos aqui o haz clic para seleccionar
                </p>
                <p className="text-xs text-storm-fog">
                  PDF, Excel, HTML, CSV
                </p>
              </>
            )}
          </div>

          {/* Form Fields */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">
                Titulo del informe
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ej: Analisis Exportaciones Mejillones - Junio 2026"
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">
                Tipo
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as ReportType)}
                className={inputClasses}
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">
                Industria
              </label>
              <select
                value={formIndustry}
                onChange={(e) => setFormIndustry(e.target.value as Industry)}
                className={inputClasses}
              >
                {INDUSTRY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">
                Mes
              </label>
              <select
                value={formMonth}
                onChange={(e) => setFormMonth(e.target.value)}
                className={inputClasses}
              >
                {adminMonthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">
                Plan destino
              </label>
              <select
                value={formPlan}
                onChange={(e) => setFormPlan(e.target.value)}
                className={inputClasses}
              >
                {PLAN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-storm-fog mt-1">
                Selecciona a que plan va dirigido este informe
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-storm-mist mb-2">
                Descripcion
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                placeholder="Descripcion breve del contenido del informe..."
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

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleSubmit(false)}
              className="btn-lightning px-8 py-3 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 10v3a1 1 0 001 1h10a1 1 0 001-1v-3M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Publicar informe
            </button>
            <button
              onClick={() => handleSubmit(true)}
              className="px-8 py-3 rounded-xl font-semibold text-sm border-2 border-storm-foam text-storm-steel hover:border-storm-spray hover:text-storm-midnight transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 2H4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 2v5h8V2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Guardar borrador
            </button>
          </div>
        </div>
      </div>

      {/* Published Files Table */}
      <div className="bg-white rounded-2xl border border-storm-foam overflow-hidden">
        <div className="px-6 py-4 border-b border-storm-foam">
          <h2 className="font-display text-lg font-semibold text-storm-midnight">
            Informes Publicados
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-storm-paper">
              <tr>
                <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-6">
                  Titulo
                </th>
                <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-4">
                  Tipo
                </th>
                <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-4">
                  Industria
                </th>
                <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-4">
                  Mes
                </th>
                <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-4">
                  Plan
                </th>
                <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-4">
                  Estado
                </th>
                <th className="text-right font-mono text-[11px] uppercase tracking-wider text-storm-mist py-3 px-6">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-storm-foam">
              {allReports.slice(0, 20).map((report) => {
                const status = statusBadge[report.status]
                const planBadge = planBadgeConfig[report.plan] || planBadgeConfig.ambos
                return (
                  <tr key={report.id} className="hover:bg-storm-paper/50 transition-colors">
                    <td className="py-3 px-6">
                      <div className="text-sm font-medium text-storm-midnight max-w-xs truncate">
                        {report.title}
                      </div>
                      <div className="text-xs text-storm-fog mt-0.5">
                        {report.uploadDate}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'inline-flex px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider border',
                          reportTypeBadge[report.type]
                        )}
                      >
                        {reportTypeLabels[report.type]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-storm-steel">
                      {industryLabels[report.industry]}
                    </td>
                    <td className="py-3 px-4 text-sm text-storm-steel font-mono">
                      {MONTH_NAMES_ES[report.month - 1]} {report.year}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'inline-flex px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider border',
                          planBadge.className
                        )}
                      >
                        {planBadge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'inline-flex px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider border',
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-storm-steel hover:bg-storm-paper hover:text-storm-midnight transition-colors">
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            deleteConfirm === report.id
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'text-red-500 hover:bg-red-50'
                          )}
                        >
                          {deleteConfirm === report.id ? 'Confirmar' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {allReports.length > 20 && (
          <div className="px-6 py-4 border-t border-storm-foam">
            <p className="text-center text-sm text-storm-mist">
              Mostrando 20 de {allReports.length} informes
            </p>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all',
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'
          )}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 8.5l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 4v4M8 10.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-storm-foam p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-storm-paper flex items-center justify-center text-storm-mist flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="font-mono text-xl font-bold text-storm-midnight">{value}</p>
          <p className="text-xs text-storm-mist">{label}</p>
        </div>
      </div>
    </div>
  )
}
