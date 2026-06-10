import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import { PageLoader } from '@/shared/components/common/PageLoader'
import { publicRoutes, authRoutes } from './public-routes'
import { candidateRoutes } from './candidate-routes'
import { employerRoutes } from './employer-routes'
import { adminRoutes } from './admin-routes'

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {publicRoutes}
        {authRoutes}
        {candidateRoutes}
        {employerRoutes}
        {adminRoutes}
      </Routes>
    </Suspense>
  )
}
