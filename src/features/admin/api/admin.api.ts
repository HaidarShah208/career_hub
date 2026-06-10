import http, { unwrap, unwrapMeta } from '@/shared/services/http'
import { mapApplication, mapCompany, mapJob } from '@/shared/services/mappers'
import type {
  Application,
  BackendApplication,
  BackendCompany,
  BackendJob,
  Company,
  Job,
} from '@/shared/types/domain'

export interface DashboardStats {
  users: { total: number }
  companies: { total: number }
  jobs: { total: number; byStatus: Record<string, number> }
  applications: { total: number; byStatus: Record<string, number> }
}

export interface BackendPublicUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'candidate' | 'employer' | 'admin'
  status: 'active' | 'suspended'
  joinedAt: string
  avatarUrl: string
}

export interface PendingEmployer {
  id: string
  name: string
  industry?: string | null
  location?: string | null
  logo?: string | null
  ownerName: string
  ownerEmail: string
  createdAt: string
}

export interface AdminAnalytics {
  totalUsers: number
  usersByRole: Array<{ name: string; value: number }>
  totalJobViews: number
  weeklyJobViews: number
  weeklySignups: number
  weeklyApplications: number
  trafficByDay: Array<{ day: string; signups: number; applications: number }>
  jobsByCategory: Array<{ name: string; value: number }>
}

export interface AdminRevenue {
  totalRevenueYtd: number
  revenueThisMonth: number
  activePremiumListings: number
  pendingRevenue: number
  revenueByMonth: Array<{ month: string; revenue: number }>
  recentTransactions: Array<{
    id: string
    company: string
    plan: string
    amount: number
    status: 'paid' | 'pending'
    createdAt: string
  }>
}

interface ListResult<T> {
  items: T[]
  total: number
  totalPages: number
  page: number
}

function dicebear(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`
}

function mapAdminUser(u: BackendPublicUser): AdminUser {
  const roleMap = { CANDIDATE: 'candidate', EMPLOYER: 'employer', ADMIN: 'admin' } as const
  const name = `${u.firstName} ${u.lastName}`.trim()
  return {
    id: u.id,
    name,
    email: u.email,
    role: roleMap[u.role],
    status: u.isActive ? 'active' : 'suspended',
    joinedAt: u.createdAt,
    avatarUrl: dicebear(name),
  }
}

export async function fetchDashboard(): Promise<DashboardStats> {
  const res = await http.get('/admin/dashboard')
  return unwrap<DashboardStats>(res)
}

export async function fetchAdminUsers(
  page = 1,
  limit = 50,
  opts?: { search?: string; role?: string },
): Promise<ListResult<AdminUser>> {
  const res = await http.get('/admin/users', {
    params: { page, limit, sortOrder: 'DESC', ...opts },
  })
  const items = unwrap<BackendPublicUser[]>(res).map(mapAdminUser)
  const meta = unwrapMeta(res)
  return {
    items,
    total: meta?.total ?? items.length,
    totalPages: meta?.totalPages ?? 1,
    page: meta?.page ?? page,
  }
}

export async function updateAdminUserStatus(id: string, isActive: boolean): Promise<AdminUser> {
  const res = await http.patch(`/admin/users/${id}/status`, { isActive })
  return mapAdminUser(unwrap<BackendPublicUser>(res))
}

export async function fetchPendingEmployers(): Promise<PendingEmployer[]> {
  const res = await http.get('/admin/employers/pending')
  return unwrap<PendingEmployer[]>(res)
}

export async function verifyEmployerCompany(id: string, verified: boolean): Promise<void> {
  await http.patch(`/admin/companies/${id}/verification`, { verified })
}

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  const res = await http.get('/admin/analytics')
  return unwrap<AdminAnalytics>(res)
}

export async function fetchAdminRevenue(): Promise<AdminRevenue> {
  const res = await http.get('/admin/revenue')
  return unwrap<AdminRevenue>(res)
}

export async function fetchAdminJobs(
  page = 1,
  limit = 50,
  status?: string,
): Promise<ListResult<Job>> {
  const res = await http.get('/admin/jobs', {
    params: { page, limit, sortOrder: 'DESC', ...(status ? { status } : {}) },
  })
  const items = unwrap<BackendJob[]>(res).map(mapJob)
  const meta = unwrapMeta(res)
  return { items, total: meta?.total ?? items.length, totalPages: meta?.totalPages ?? 1, page: meta?.page ?? page }
}

export async function fetchAdminApplications(page = 1, limit = 20): Promise<ListResult<Application>> {
  const res = await http.get('/admin/applications', { params: { page, limit, sortOrder: 'DESC' } })
  const items = unwrap<BackendApplication[]>(res).map(mapApplication)
  const meta = unwrapMeta(res)
  return { items, total: meta?.total ?? items.length, totalPages: meta?.totalPages ?? 1, page: meta?.page ?? page }
}

export async function publishAdminJob(id: string): Promise<Job> {
  const res = await http.put(`/jobs/${id}`, { status: 'PUBLISHED' })
  return mapJob(unwrap<BackendJob>(res))
}

export async function deleteAdminJob(id: string): Promise<void> {
  await http.delete(`/jobs/${id}`)
}

export async function fetchAdminCompanies(page = 1, limit = 20): Promise<ListResult<Company>> {
  const res = await http.get('/admin/companies', { params: { page, limit, sortOrder: 'DESC' } })
  const items = unwrap<BackendCompany[]>(res).map(mapCompany)
  const meta = unwrapMeta(res)
  return { items, total: meta?.total ?? items.length, totalPages: meta?.totalPages ?? 1, page: meta?.page ?? page }
}
