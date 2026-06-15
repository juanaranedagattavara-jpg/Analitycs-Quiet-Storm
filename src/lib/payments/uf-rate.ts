interface UFRateCache {
  rate: number
  fetchedAt: number
}

const FALLBACK_UF_CLP = 39000
let cache: UFRateCache | null = null
const TTL_MS = 6 * 60 * 60 * 1000

interface MindicadorResponse {
  serie?: Array<{ valor: number; fecha: string }>
}

export async function getUFRate(): Promise<number> {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) {
    return cache.rate
  }

  const url = process.env.UF_RATE_SOURCE || 'https://mindicador.cl/api/uf'
  try {
    const res = await fetch(url, { next: { revalidate: 21600 } })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const data = (await res.json()) as MindicadorResponse
    const value = data.serie?.[0]?.valor
    if (typeof value === 'number' && Number.isFinite(value)) {
      cache = { rate: value, fetchedAt: Date.now() }
      return value
    }
  } catch {
    /* fall through */
  }

  cache = { rate: FALLBACK_UF_CLP, fetchedAt: Date.now() }
  return FALLBACK_UF_CLP
}

export function ufToCLP(uf: number, rate: number): number {
  return Math.round(uf * rate)
}
