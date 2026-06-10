import { Navigate, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/app/store/auth.store'
import { AppSplash } from '@/shared/components/common/AppSplash'
import { ROUTES } from '@/shared/constants'
import type { UserRole } from '@/shared/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: UserRole | UserRole[]
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isHydrated, hasRole } = useAuthStore()

  if (!isHydrated) {
    return <AppSplash />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location.pathname }} replace />
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <>{children}</>
}
