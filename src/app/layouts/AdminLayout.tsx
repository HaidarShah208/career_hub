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
  CreditCard,
  Layers,
} from 'lucide-react'

import { DashboardLayout } from './DashboardLayout'
import { ROUTES } from '@/shared/constants'
import type { SidebarSection } from '@/shared/components/common/DashboardSidebar'
import { usePendingEmployers, useAdminModerationJobs } from '@/features/admin/hooks/useAdminData'
import { useAdminPayments } from '@/features/admin/hooks/useAdminBilling'

export function AdminLayout() {
  const { pending } = usePendingEmployers()
  const { jobs: draftJobs } = useAdminModerationJobs()
  const { payments: pendingPayments } = useAdminPayments('PENDING')

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
        title: 'Billing',
        items: [
          { label: 'Plans', to: ROUTES.adminPlans, icon: Layers },
          {
            label: 'Payments',
            to: ROUTES.adminPayments,
            icon: CreditCard,
            badge: pendingPayments.length > 0 ? pendingPayments.length : undefined,
          },
          { label: 'Revenue', to: ROUTES.adminRevenue, icon: DollarSign },
        ],
      },
      {
        title: 'Insights',
        items: [{ label: 'Site Analytics', to: ROUTES.adminAnalytics, icon: BarChart3 }],
      },
      {
        title: 'System',
        items: [{ label: 'Settings', to: `${ROUTES.adminDashboard}/settings`, icon: Settings }],
      },
    ]
  }, [pending.length, draftJobs.length, pendingPayments.length])

  return <DashboardLayout sections={sections} />
}
