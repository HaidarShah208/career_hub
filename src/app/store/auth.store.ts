import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { User, UserRole } from '@/shared/types'
import { STORAGE_KEYS } from '@/shared/constants'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isHydrated: boolean
  setAuth: (user: User, token: string) => void
  updateUser: (user: Partial<User>) => void
  logout: () => void
  setHydrated: () => void
  hasRole: (role: UserRole | UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (user, token) => {
        localStorage.setItem(STORAGE_KEYS.authToken, token)
        set({ user, token, isAuthenticated: true })
      },

      updateUser: partial => {
        const current = get().user
        if (!current) return
        set({ user: { ...current, ...partial } })
      },

      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.authToken)
        localStorage.removeItem(STORAGE_KEYS.authUser)
        set({ user: null, token: null, isAuthenticated: false })
      },

      setHydrated: () => set({ isHydrated: true }),

      hasRole: role => {
        const userRole = get().user?.role
        if (!userRole) return false
        return Array.isArray(role) ? role.includes(userRole) : userRole === role
      },
    }),
    {
      name: STORAGE_KEYS.authUser,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
