import { getUFRate } from '@/lib/payments/uf-rate'
import { jsonOk, handleError } from '@/lib/api/respond'

export async function GET() {
  try {
    const rate = await getUFRate()
    return jsonOk({ rate, fetchedAt: new Date().toISOString() })
  } catch (err) {
    return handleError(err)
  }
}
