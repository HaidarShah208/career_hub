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

export async function fetchDashboard(): Promise<DashboardStats> {
  const res = await http.get('/admin/dashboard')
  return unwrap<DashboardStats>(res)
}

interface ListResult<T> {
  items: T[]
  total: number
  totalPages: number
  page: number
}

export async function fetchAdminJobs(page = 1, limit = 20): Promise<ListResult<Job>> {
  const res = await http.get('/admin/jobs', { params: { page, limit, sortOrder: 'DESC' } })
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

export async function fetchAdminCompanies(page = 1, limit = 20): Promise<ListResult<Company>> {
  const res = await http.get('/admin/companies', { params: { page, limit, sortOrder: 'DESC' } })
  const items = unwrap<BackendCompany[]>(res).map(mapCompany)
  const meta = unwrapMeta(res)
  return { items, total: meta?.total ?? items.length, totalPages: meta?.totalPages ?? 1, page: meta?.page ?? page }
}
