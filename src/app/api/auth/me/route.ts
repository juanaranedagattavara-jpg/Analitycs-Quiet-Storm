import { getCurrentUser } from '@/lib/auth/current-user'
import { jsonOk, handleError } from '@/lib/api/respond'

export async function GET() {
  try {
    const me = await getCurrentUser()
    if (!me) return jsonOk({ user: null, organization: null, orgRole: null, subscription: null })
    return jsonOk({
      user: me.user,
      organization: me.organization,
      orgRole: me.orgRole,
      subscription: me.subscription,
    })
  } catch (err) {
    return handleError(err)
  }
}
