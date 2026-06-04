import http, { unwrap, unwrapMeta } from '@/shared/services/http'
import { mapApplication, mapCompany, mapJob } from '@/shared/services/mappers'
import type {
  Application,
  BackendApplication,
  BackendApplicationStatus,
  BackendCompany,
  BackendEmploymentType,
  BackendJob,
  Company,
  Job,
} from '@/shared/types/domain'

/* -------------------------------- Company -------------------------------- */

export interface CompanyInput {
  name: string
  logo?: string
  website?: string
  description?: string
  industry?: string
  companySize?: string
  foundedYear?: number
  location?: string
}

/** GET /employer/company — returns null when the employer has no company yet. */
export async function getMyCompany(): Promise<Company | null> {
  try {
    const res = await http.get('/employer/company')
    return mapCompany(unwrap<BackendCompany>(res))
  } catch (err) {
    if ((err as { status?: number })?.status === 404) return null
    throw err
  }
}

export async function createMyCompany(input: CompanyInput): Promise<Company> {
  const res = await http.post('/employer/company', input)
  return mapCompany(unwrap<BackendCompany>(res))
}

export async function updateMyCompany(input: Partial<CompanyInput>): Promise<Company> {
  const res = await http.put('/employer/company', input)
  return mapCompany(unwrap<BackendCompany>(res))
}

export async function deleteMyCompany(): Promise<void> {
  await http.delete('/employer/company')
}

/* --------------------------------- Jobs ---------------------------------- */

export interface EmployerJobInput {
  title: string
  description: string
  location?: string
  employmentType: BackendEmploymentType
  salaryMin?: number
  salaryMax?: number
  category?: string
  experienceLevel?: string
  skills?: string[]
  applyMethod?: 'internal' | 'external'
  applyUrl?: string
  isUrgent?: boolean
  isFeatured?: boolean
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED'
}

export interface JobListResult {
  jobs: Job[]
  total: number
  totalPages: number
  page: number
}

export async function listMyJobs(page = 1, limit = 50): Promise<JobListResult> {
  const res = await http.get('/employer/jobs', { params: { page, limit, sortOrder: 'DESC' } })
  const jobs = unwrap<BackendJob[]>(res).map(mapJob)
  const meta = unwrapMeta(res)
  return {
    jobs,
    total: meta?.total ?? jobs.length,
    totalPages: meta?.totalPages ?? 1,
    page: meta?.page ?? page,
  }
}

export async function getMyJob(id: string): Promise<Job> {
  const res = await http.get(`/employer/jobs/${id}`)
  return mapJob(unwrap<BackendJob>(res))
}

export async function createMyJob(input: EmployerJobInput): Promise<Job> {
  const res = await http.post('/employer/jobs', input)
  return mapJob(unwrap<BackendJob>(res))
}

export async function updateMyJob(id: string, input: Partial<EmployerJobInput>): Promise<Job> {
  const res = await http.put(`/employer/jobs/${id}`, input)
  return mapJob(unwrap<BackendJob>(res))
}

export async function deleteMyJob(id: string): Promise<void> {
  await http.delete(`/employer/jobs/${id}`)
}

export async function publishMyJob(id: string): Promise<Job> {
  const res = await http.patch(`/employer/jobs/${id}/publish`)
  return mapJob(unwrap<BackendJob>(res))
}

export async function closeMyJob(id: string): Promise<Job> {
  const res = await http.patch(`/employer/jobs/${id}/close`)
  return mapJob(unwrap<BackendJob>(res))
}

/* ------------------------------ Applicants ------------------------------- */

export interface ApplicantListResult {
  applicants: Application[]
  total: number
  totalPages: number
  page: number
}

export async function listApplicants(page = 1, limit = 50, status?: string): Promise<ApplicantListResult> {
  const res = await http.get('/employer/applicants', {
    params: { page, limit, sortOrder: 'DESC', ...(status ? { status } : {}) },
  })
  const applicants = unwrap<BackendApplication[]>(res).map(mapApplication)
  const meta = unwrapMeta(res)
  return {
    applicants,
    total: meta?.total ?? applicants.length,
    totalPages: meta?.totalPages ?? 1,
    page: meta?.page ?? page,
  }
}

export async function getApplicant(id: string): Promise<Application> {
  const res = await http.get(`/employer/applicants/${id}`)
  return mapApplication(unwrap<BackendApplication>(res))
}

export async function updateApplicantStatus(
  id: string,
  status: BackendApplicationStatus,
  note?: string,
): Promise<Application> {
  const res = await http.patch(`/employer/applications/${id}/status`, { status, note })
  return mapApplication(unwrap<BackendApplication>(res))
}

/* ------------------------------ Dashboard -------------------------------- */

export interface EmployerDashboard {
  company: { id: string; name: string }
  totalJobs: number
  activeJobs: number
  totalApplicants: number
  hiredCandidates: number
  recentApplications: Application[]
}

export async function getEmployerDashboard(): Promise<EmployerDashboard> {
  const res = await http.get('/employer/dashboard')
  const data = unwrap<{
    company: { id: string; name: string }
    totalJobs: number
    activeJobs: number
    totalApplicants: number
    hiredCandidates: number
    recentApplications: BackendApplication[]
  }>(res)
  return {
    company: data.company,
    totalJobs: data.totalJobs,
    activeJobs: data.activeJobs,
    totalApplicants: data.totalApplicants,
    hiredCandidates: data.hiredCandidates,
    recentApplications: (data.recentApplications ?? []).map(mapApplication),
  }
}
