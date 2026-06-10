import { lazy } from 'react'
import { Route } from 'react-router-dom'

import { EmployerLayout } from '@/app/layouts/EmployerLayout'
import { ProtectedRoute } from '@/shared/components/common/ProtectedRoute'

const EmployerOverview = lazy(() => import('@/features/employers/pages/OverviewPage'))
const EmployerCompany = lazy(() => import('@/features/employers/pages/CompanyProfilePage'))
const EmployerJobs = lazy(() => import('@/features/employers/pages/MyJobsPage'))
const EmployerPostJob = lazy(() => import('@/features/employers/pages/PostJobPage'))
const EmployerEditJob = lazy(() => import('@/features/employers/pages/EditJobPage'))
const EmployerApplicants = lazy(() => import('@/features/employers/pages/ApplicantsPage'))
const EmployerApplicantDetail = lazy(() => import('@/features/employers/pages/ApplicantDetailPage'))
const EmployerInterviews = lazy(() => import('@/features/employers/pages/InterviewsPage'))
const EmployerAnalytics = lazy(() => import('@/features/employers/pages/AnalyticsPage'))
const EmployerSettings = lazy(() => import('@/features/employers/pages/SettingsPage'))

export const employerRoutes = (
  <Route
    path="employer"
    element={
      <ProtectedRoute roles="employer">
        <EmployerLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<EmployerOverview />} />
    <Route path="company" element={<EmployerCompany />} />
    <Route path="jobs" element={<EmployerJobs />} />
    <Route path="jobs/new" element={<EmployerPostJob />} />
    <Route path="jobs/:id/edit" element={<EmployerEditJob />} />
    <Route path="applicants" element={<EmployerApplicants />} />
    <Route path="applicants/:id" element={<EmployerApplicantDetail />} />
    <Route path="interviews" element={<EmployerInterviews />} />
    <Route path="analytics" element={<EmployerAnalytics />} />
    <Route path="settings" element={<EmployerSettings />} />
  </Route>
)
