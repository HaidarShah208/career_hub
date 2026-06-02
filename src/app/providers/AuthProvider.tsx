import { useEffect } from 'react'

import { useAuthStore } from '@/app/store/auth.store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setHydrated = useAuthStore(s => s.setHydrated)

  useEffect(() => {
    setHydrated()
  }, [setHydrated])

  return <>{children}</>
}
