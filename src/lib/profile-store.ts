import type { UserProfile } from './types'

const KEY = 'qsa.profile.v1'

// Empty defaults — no AI-invented user. The real profile is filled in via
// /registro on signup and stored in localStorage; until then everything is
// blank and the UI shows a "complete tu perfil" empty state.
const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  company: '',
  phone: '',
  rut: '',
  memberSince: '',
}

type Listener = () => void

class ProfileStore {
  private listeners = new Set<Listener>()
  private cache: UserProfile | null = null

  getSnapshot = (): UserProfile => {
    if (typeof window === 'undefined') return DEFAULT_PROFILE
    if (this.cache !== null) return this.cache
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) {
        const stored = JSON.parse(raw) as Partial<UserProfile>
        this.cache = {
          name: stored.name || DEFAULT_PROFILE.name,
          email: stored.email || DEFAULT_PROFILE.email,
          company: stored.company || DEFAULT_PROFILE.company,
          phone: stored.phone || DEFAULT_PROFILE.phone,
          rut: stored.rut || DEFAULT_PROFILE.rut,
          memberSince: stored.memberSince || DEFAULT_PROFILE.memberSince,
        }
        return this.cache
      }
    } catch {
      /* ignore */
    }
    this.cache = DEFAULT_PROFILE
    return this.cache
  }

  getServerSnapshot = (): UserProfile => DEFAULT_PROFILE

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        this.cache = null
        listener()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      this.listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }

  set = (next: UserProfile): void => {
    this.cache = next
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
    this.listeners.forEach((l) => l())
  }
}

export const profileStore = new ProfileStore()
