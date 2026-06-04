import { useMemo } from 'react'
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
import { useApplications } from '@/features/applications/hooks/useApplications'
import { useSavedJobs } from '@/features/jobs/hooks/useSavedJobs'
import { useJobCollection } from '@/features/jobs/hooks/useJobs'
import { useMatchProfile } from '@/features/candidates/hooks/useMatchProfile'
import { getRecommendations } from '@/features/ai/services/matching'

export function CandidateLayout() {
  const { applications } = useApplications()
  const savedCount = useSavedJobs(s => s.ids.length)
  const { jobs } = useJobCollection('latest', 30)
  const matchProfile = useMatchProfile()

  const recommendedCount = useMemo(
    () => getRecommendations(matchProfile, jobs, 30).filter(m => m.score > 0).length,
    [matchProfile, jobs],
  )
  const applicationCount = applications.filter(a => a.status !== 'withdrawn').length

  const sections = useMemo<SidebarSection[]>(
    () => [
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
          {
            label: 'Recommended',
            to: ROUTES.candidateRecommended,
            icon: Sparkles,
            badge: recommendedCount || undefined,
          },
          {
            label: 'Applications',
            to: ROUTES.candidateApplications,
            icon: Briefcase,
            badge: applicationCount || undefined,
          },
          {
            label: 'Saved Jobs',
            to: ROUTES.candidateSavedJobs,
            icon: Bookmark,
            badge: savedCount || undefined,
          },
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
    ],
    [recommendedCount, applicationCount, savedCount],
  )

  return <DashboardLayout sections={sections} />
}
