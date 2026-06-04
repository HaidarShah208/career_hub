import { useEffect } from 'react'

import { useAuthStore } from '@/app/store/auth.store'
import { setAuthFailureHandler } from '@/shared/services/http'
import * as authApi from '@/features/auth/api/auth.api'

/**
 * On app load, if a persisted token exists we validate it against the backend
 * (`GET /auth/me`). A valid session refreshes the stored user; an invalid /
 * expired one is cleared. Either way the store is marked hydrated so guarded
 * routes can render.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setHydrated = useAuthStore(s => s.setHydrated)

  useEffect(() => {
    // When the HTTP client can no longer refresh a session, clear the store.
    setAuthFailureHandler(() => useAuthStore.getState().logout())

    const { token, updateUser, logout } = useAuthStore.getState()

    if (!token) {
      setHydrated()
      return
    }

    authApi
      .me()
      .then(user => updateUser(user))
      .catch(() => logout())
      .finally(() => setHydrated())
  }, [setHydrated])

  return <>{children}</>
}
