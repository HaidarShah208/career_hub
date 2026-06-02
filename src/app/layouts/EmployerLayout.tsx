import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Plus,
} from 'lucide-react'

import { DashboardLayout } from './DashboardLayout'
import { ROUTES } from '@/shared/constants'
import type { SidebarSection } from '@/shared/components/common/DashboardSidebar'

const sections: SidebarSection[] = [
  {
    items: [
      { label: 'Overview', to: ROUTES.employerDashboard, icon: LayoutDashboard, end: true },
      { label: 'Company Profile', to: ROUTES.employerCompany, icon: Building2 },
    ],
  },
  {
    title: 'Hiring',
    items: [
      { label: 'My Jobs', to: ROUTES.employerJobs, icon: Briefcase, end: true },
      { label: 'Post New Job', to: ROUTES.employerPostJob, icon: Plus },
      { label: 'Applicants', to: ROUTES.employerApplicants, icon: Users, badge: 24 },
      { label: 'Interviews', to: ROUTES.employerInterviews, icon: Calendar, badge: 5 },
    ],
  },
  {
    title: 'Insights',
    items: [{ label: 'Analytics', to: ROUTES.employerAnalytics, icon: BarChart3 }],
  },
  {
    title: 'Account',
    items: [{ label: 'Settings', to: `${ROUTES.employerDashboard}/settings`, icon: Settings }],
  },
]

export function EmployerLayout() {
  return <DashboardLayout sections={sections} />
}
