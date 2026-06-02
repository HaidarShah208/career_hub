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

const sections: SidebarSection[] = [
  {
    items: [{ label: 'Overview', to: ROUTES.adminDashboard, icon: LayoutDashboard, end: true }],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users', to: ROUTES.adminUsers, icon: Users },
      { label: 'Employer Verification', to: ROUTES.adminEmployers, icon: ShieldCheck, badge: 8 },
      { label: 'Job Moderation', to: ROUTES.adminJobs, icon: Briefcase, badge: 12 },
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

export function AdminLayout() {
  return <DashboardLayout sections={sections} />
}
