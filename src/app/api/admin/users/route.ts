import { requireAdmin } from '@/lib/auth/current-user'
import { listUsers } from '@/lib/db/users'
import { findSubscriptionByUserId } from '@/lib/db/subscriptions'
import { toPublicUser } from '@/lib/db/types'
import { jsonOk, handleError } from '@/lib/api/respond'

export async function GET() {
  try {
    await requireAdmin()
    const userRows = await listUsers()
    const users = await Promise.all(
      userRows.map(async (u) => ({
        ...toPublicUser(u),
        subscription: await findSubscriptionByUserId(u.id),
      }))
    )
    return jsonOk({ users })
  } catch (err) {
    return handleError(err)
  }
}
