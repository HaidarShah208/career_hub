import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Bookmark,
  Bell,
  Sparkles,
  Settings,
} from 'lucide-react'

import { DashboardLayout } from './DashboardLayout'
import { ROUTES } from '@/shared/constants'
import type { SidebarSection } from '@/shared/components/common/DashboardSidebar'

const sections: SidebarSection[] = [
  {
    items: [
      { label: 'Overview', to: ROUTES.candidateDashboard, icon: LayoutDashboard, end: true },
      { label: 'My Profile', to: ROUTES.candidateProfile, icon: User },
      { label: 'My Resume', to: ROUTES.candidateResume, icon: FileText },
    ],
  },
  {
    title: 'Jobs',
    items: [
      { label: 'Recommended', to: ROUTES.candidateRecommended, icon: Sparkles, badge: 12 },
      { label: 'Applications', to: ROUTES.candidateApplications, icon: Briefcase, badge: 18 },
      { label: 'Saved Jobs', to: ROUTES.candidateSavedJobs, icon: Bookmark },
      { label: 'Job Alerts', to: ROUTES.candidateAlerts, icon: Bell },
    ],
  },
  {
    title: 'AI Tools',
    items: [{ label: 'Career AI', to: ROUTES.candidateAi, icon: Sparkles }],
  },
  {
    title: 'Account',
    items: [{ label: 'Settings', to: `${ROUTES.candidateDashboard}/settings`, icon: Settings }],
  },
]

export function CandidateLayout() {
  return <DashboardLayout sections={sections} />
}
