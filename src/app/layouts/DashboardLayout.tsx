import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

import { DashboardSidebar, type SidebarSection } from '@/shared/components/common/DashboardSidebar'
import { DashboardHeader } from '@/shared/components/common/DashboardHeader'
import { ScrollToTop } from '@/shared/components/common/ScrollToTop'
import { useUIStore } from '@/app/store/ui.store'

interface DashboardLayoutProps {
  sections: SidebarSection[]
}

export function DashboardLayout({ sections }: DashboardLayoutProps) {
  const location = useLocation()
  const { isSidebarOpen, isSidebarCollapsed, setSidebarOpen, toggleSidebar, toggleSidebarCollapsed } =
    useUIStore()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname, setSidebarOpen])

  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar
        sections={sections}
        open={isSidebarOpen}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapsed}
      />
      {isSidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
        />
      )}
      <div className="flex min-h-screen flex-1 flex-col">
        <DashboardHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      <ScrollToTop />
    </div>
  )
}
