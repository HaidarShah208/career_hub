import { lazy } from 'react'
import { Route } from 'react-router-dom'

import { PublicLayout } from '@/app/layouts/PublicLayout'

const HomePage = lazy(() => import('@/features/jobs/pages/HomePage'))
const JobsListPage = lazy(() => import('@/features/jobs/pages/JobsListPage'))
const JobDetailsPage = lazy(() => import('@/features/jobs/pages/JobDetailsPage'))
const RemoteJobsPage = lazy(() => import('@/features/jobs/pages/RemoteJobsPage'))
const GovernmentJobsPage = lazy(() => import('@/features/jobs/pages/GovernmentJobsPage'))
const CompaniesListPage = lazy(() => import('@/features/companies/pages/CompaniesListPage'))
const CompanyDetailsPage = lazy(() => import('@/features/companies/pages/CompanyDetailsPage'))
const AboutPage = lazy(() => import('@/features/jobs/pages/AboutPage'))
const ContactPage = lazy(() => import('@/features/jobs/pages/ContactPage'))
const PrivacyPage = lazy(() => import('@/features/jobs/pages/PrivacyPage'))
const TermsPage = lazy(() => import('@/features/jobs/pages/TermsPage'))
const NotFoundPage = lazy(() => import('@/features/jobs/pages/NotFoundPage'))

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'))
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'))

export const publicRoutes = (
  <Route element={<PublicLayout />}>
    <Route index element={<HomePage />} />
    <Route path="jobs" element={<JobsListPage />} />
    <Route path="jobs/remote" element={<RemoteJobsPage />} />
    <Route path="jobs/government" element={<GovernmentJobsPage />} />
    <Route path="jobs/:id" element={<JobDetailsPage />} />
    <Route path="companies" element={<CompaniesListPage />} />
    <Route path="companies/:id" element={<CompanyDetailsPage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="privacy" element={<PrivacyPage />} />
    <Route path="terms" element={<TermsPage />} />

    <Route path="auth/login" element={<LoginPage />} />
    <Route path="auth/register" element={<RegisterPage />} />
    <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="auth/reset-password" element={<ResetPasswordPage />} />
    <Route path="auth/verify-email" element={<VerifyEmailPage />} />

    <Route path="*" element={<NotFoundPage />} />
  </Route>
)
