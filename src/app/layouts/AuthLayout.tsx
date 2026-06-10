import { Outlet } from 'react-router-dom'

import { ScrollToTop } from '@/shared/components/common/ScrollToTop'

/** Full-viewport layout for sign-in / sign-up — no navbar or footer. */
export function AuthLayout() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Outlet />
    </div>
  )
}
