'use client'

import type { ReportPayload } from './serializer'

export type ClientReport = ReportPayload & { accessible?: boolean }

async function jsonFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'same-origin' })
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(data.error || `Error ${res.status}`)
  }
  return (await res.json()) as T
}

export function listReports(): Promise<{ reports: ClientReport[] }> {
  return jsonFetch('/api/reports')
}

export function getReport(id: string): Promise<{ report: ClientReport }> {
  return jsonFetch(`/api/reports/${encodeURIComponent(id)}`)
}

export function downloadUrl(id: string): string {
  return `/api/reports/${encodeURIComponent(id)}/download`
}

export function inlineUrl(id: string): string {
  return `/api/reports/${encodeURIComponent(id)}/download?disposition=inline`
}
