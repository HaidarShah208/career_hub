import { lazy } from 'react'
import { Route } from 'react-router-dom'

import { CandidateLayout } from '@/app/layouts/CandidateLayout'
import { ProtectedRoute } from '@/shared/components/common/ProtectedRoute'

const CandidateOverview = lazy(() => import('@/features/candidates/pages/OverviewPage'))
const CandidateProfile = lazy(() => import('@/features/candidates/pages/ProfilePage'))
const CandidateResume = lazy(() => import('@/features/resumes/pages/ResumePage'))
const CandidateApplications = lazy(() => import('@/features/applications/pages/ApplicationsPage'))
const CandidateSavedJobs = lazy(() => import('@/features/candidates/pages/SavedJobsPage'))
const CandidateAlerts = lazy(() => import('@/features/candidates/pages/JobAlertsPage'))
const CandidateRecommended = lazy(() => import('@/features/candidates/pages/RecommendedJobsPage'))
const CandidateAi = lazy(() => import('@/features/ai/pages/CareerAIPage'))
const CandidateSettings = lazy(() => import('@/features/candidates/pages/SettingsPage'))

export const candidateRoutes = (
  <Route
    path="candidate"
    element={
      <ProtectedRoute roles="candidate">
        <CandidateLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<CandidateOverview />} />
    <Route path="profile" element={<CandidateProfile />} />
    <Route path="resume" element={<CandidateResume />} />
    <Route path="applications" element={<CandidateApplications />} />
    <Route path="saved" element={<CandidateSavedJobs />} />
    <Route path="alerts" element={<CandidateAlerts />} />
    <Route path="recommended" element={<CandidateRecommended />} />
    <Route path="ai" element={<CandidateAi />} />
    <Route path="settings" element={<CandidateSettings />} />
  </Route>
)
