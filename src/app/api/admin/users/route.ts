import { requireAdmin } from '@/lib/auth/current-user'
import { listUsers } from '@/lib/db/users'
import { findSubscriptionByOrgId } from '@/lib/db/subscriptions'
import { findUserPrimaryOrg } from '@/lib/db/organizations'
import { toPublicUser } from '@/lib/db/types'
import { jsonOk, handleError } from '@/lib/api/respond'

export async function GET() {
  try {
    await requireAdmin()
    const userRows = await listUsers()
    const users = await Promise.all(
      userRows.map(async (u) => {
        const primaryOrg = await findUserPrimaryOrg(u.id)
        const subscription = primaryOrg
          ? await findSubscriptionByOrgId(primaryOrg.org.id)
          : null
        return {
          ...toPublicUser(u),
          organization: primaryOrg?.org ?? null,
          subscription,
        }
      })
    )
    return jsonOk({ users })
  } catch (err) {
    return handleError(err)
  }
}
