import { useMemo } from 'react'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Briefcase,
  FolderTree,
  DollarSign,
  BarChart3,
  Settings,
} from 'lucide-react'

import { DashboardLayout } from './DashboardLayout'
import { ROUTES } from '@/shared/constants'
import type { SidebarSection } from '@/shared/components/common/DashboardSidebar'
import { usePendingEmployers, useAdminModerationJobs } from '@/features/admin/hooks/useAdminData'

export function AdminLayout() {
  const { pending } = usePendingEmployers()
  const { jobs: draftJobs } = useAdminModerationJobs()

  const sections = useMemo<SidebarSection[]>(() => {
    const pendingEmployers = pending.length
    const moderationQueue = draftJobs.length

    return [
      {
        items: [{ label: 'Overview', to: ROUTES.adminDashboard, icon: LayoutDashboard, end: true }],
      },
      {
        title: 'Management',
        items: [
          { label: 'Users', to: ROUTES.adminUsers, icon: Users },
          {
            label: 'Employer Verification',
            to: ROUTES.adminEmployers,
            icon: ShieldCheck,
            badge: pendingEmployers > 0 ? pendingEmployers : undefined,
          },
          {
            label: 'Job Moderation',
            to: ROUTES.adminJobs,
            icon: Briefcase,
            badge: moderationQueue > 0 ? moderationQueue : undefined,
          },
          { label: 'Categories', to: ROUTES.adminCategories, icon: FolderTree },
        ],
      },
      {
        title: 'Insights',
        items: [
          { label: 'Revenue', to: ROUTES.adminRevenue, icon: DollarSign },
          { label: 'Site Analytics', to: ROUTES.adminAnalytics, icon: BarChart3 },
        ],
      },
      {
        title: 'System',
        items: [{ label: 'Settings', to: `${ROUTES.adminDashboard}/settings`, icon: Settings }],
      },
    ]
  }, [pending.length, draftJobs.length])

  return <DashboardLayout sections={sections} />
}
