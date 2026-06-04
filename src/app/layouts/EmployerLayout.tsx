import { useMemo } from 'react'
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
import { useApplicants } from '@/features/employers/hooks/useApplicants'

export function EmployerLayout() {
  const { applicants } = useApplicants()

  const sections = useMemo<SidebarSection[]>(() => {
    const applicantCount = applicants.length
    const interviewCount = applicants.filter((a) => a.status === 'interview').length
    return [
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
          { label: 'Applicants', to: ROUTES.employerApplicants, icon: Users, badge: applicantCount || undefined },
          { label: 'Interviews', to: ROUTES.employerInterviews, icon: Calendar, badge: interviewCount || undefined },
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
  }, [applicants])

  return <DashboardLayout sections={sections} />
}
