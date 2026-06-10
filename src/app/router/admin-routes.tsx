import { lazy } from 'react'
import { Route } from 'react-router-dom'

import { AdminLayout } from '@/app/layouts/AdminLayout'
import { ProtectedRoute } from '@/shared/components/common/ProtectedRoute'

const AdminOverview = lazy(() => import('@/features/admin/pages/OverviewPage'))
const AdminUsers = lazy(() => import('@/features/admin/pages/UsersPage'))
const AdminEmployers = lazy(() => import('@/features/admin/pages/EmployerVerificationPage'))
const AdminJobs = lazy(() => import('@/features/admin/pages/JobModerationPage'))
const AdminCategories = lazy(() => import('@/features/admin/pages/CategoriesPage'))
const AdminRevenue = lazy(() => import('@/features/admin/pages/RevenuePage'))
const AdminAnalytics = lazy(() => import('@/features/admin/pages/AnalyticsPage'))
const AdminSettings = lazy(() => import('@/features/admin/pages/SettingsPage'))
const AdminPlans = lazy(() => import('@/features/admin/pages/PlansPage'))
const AdminPayments = lazy(() => import('@/features/admin/pages/PaymentsPage'))

export const adminRoutes = (
  <Route
    path="admin"
    element={
      <ProtectedRoute roles="admin">
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<AdminOverview />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="employers" element={<AdminEmployers />} />
    <Route path="jobs" element={<AdminJobs />} />
    <Route path="categories" element={<AdminCategories />} />
    <Route path="revenue" element={<AdminRevenue />} />
    <Route path="plans" element={<AdminPlans />} />
    <Route path="payments" element={<AdminPayments />} />
    <Route path="analytics" element={<AdminAnalytics />} />
    <Route path="settings" element={<AdminSettings />} />
  </Route>
)
