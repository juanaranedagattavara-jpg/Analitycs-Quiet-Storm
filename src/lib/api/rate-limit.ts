interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export interface RateLimitOptions {
  limit: number
  windowMs: number
}

export function rateLimit(key: string, opts: RateLimitOptions): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  const existing = buckets.get(key)
  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs })
    return { ok: true, retryAfter: 0 }
  }
  if (existing.count < opts.limit) {
    existing.count += 1
    return { ok: true, retryAfter: 0 }
  }
  return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) }
}

let lastCleanup = Date.now()
export function cleanupRateLimit(): void {
  const now = Date.now()
  if (now - lastCleanup < 60_000) return
  lastCleanup = now
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt < now) buckets.delete(key)
  }
}
