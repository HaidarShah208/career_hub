import { Outlet } from 'react-router-dom'

import { PublicNavbar } from '@/shared/components/common/PublicNavbar'
import { PublicFooter } from '@/shared/components/common/PublicFooter'
import { ScrollToTop } from '@/shared/components/common/ScrollToTop'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
