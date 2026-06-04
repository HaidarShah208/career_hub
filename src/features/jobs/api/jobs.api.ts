import http, { unwrap, unwrapMeta } from '@/shared/services/http'
import { SALARY_RANGES, PAGINATION } from '@/shared/constants'
import { mapJob, toBackendEmploymentType, type BackendJobInput } from '@/shared/services/mappers'
import type { BackendJob } from '@/shared/types/domain'
import type { Job, JobFilters, JobQueryResult, JobSort } from '../types'

/** Translates the rich UI filter set into backend query params it understands. */
function buildParams(filters: Partial<JobFilters>, page: number, pageSize: number) {
  const params: Record<string, string | number> = {
    page,
    limit: pageSize,
    sortOrder: 'DESC',
    status: 'PUBLISHED',
  }
  if (filters.query) params.search = filters.query
  if (filters.city && filters.city !== 'Remote') {
    // Jobs persist their city in the `location` field.
    params.location = filters.city
    params.city = filters.city
  }

  // workMode === remote maps to the REMOTE employment type on the backend.
  if (filters.workMode === 'remote') params.employmentType = 'REMOTE'
  else if (filters.jobType) params.employmentType = toBackendEmploymentType(filters.jobType, '')

  if (filters.salaryRange) {
    const range = SALARY_RANGES.find((r) => r.value === filters.salaryRange)
    if (range) {
      params.salaryMin = range.min
      if (range.max < 9_000_000) params.salaryMax = range.max
    }
  }
  return params
}

function applyClientSort(jobs: Job[], sort?: JobSort): Job[] {
  if (!sort || sort === 'recent' || sort === 'relevant') return jobs
  const sorted = [...jobs]
  if (sort === 'salary_high') return sorted.sort((a, b) => b.salaryMax - a.salaryMax)
  if (sort === 'salary_low') return sorted.sort((a, b) => a.salaryMin - b.salaryMin)
  return sorted
}

/** Client-side filtering for attributes the backend does not model yet. */
export function filterJobs(jobs: Job[], filters: Partial<JobFilters>): Job[] {
  return jobs.filter((job) => {
    if (filters.city && job.city !== filters.city) return false
    if (filters.workMode && job.workMode !== filters.workMode) return false
    return true
  })
}

export async function fetchJobs(
  filters: Partial<JobFilters>,
  page = 1,
  pageSize = PAGINATION.jobsPerPage,
): Promise<JobQueryResult> {
  const res = await http.get('/jobs', { params: buildParams(filters, page, pageSize) })
  const jobs = unwrap<BackendJob[]>(res).map(mapJob)
  const meta = unwrapMeta(res)
  return {
    jobs: applyClientSort(jobs, filters.sort as JobSort),
    total: meta?.total ?? jobs.length,
    totalPages: meta?.totalPages ?? 1,
    page: meta?.page ?? page,
  }
}

export async function fetchJobById(id: string): Promise<Job | null> {
  try {
    const res = await http.get(`/jobs/${id}`)
    return mapJob(unwrap<BackendJob>(res))
  } catch {
    return null
  }
}

export async function fetchFeaturedJobs(limit = 6): Promise<Job[]> {
  const res = await http.get('/jobs', {
    params: { page: 1, limit, status: 'PUBLISHED', sortOrder: 'DESC' },
  })
  return unwrap<BackendJob[]>(res).map(mapJob)
}

export async function fetchLatestJobs(limit = 8): Promise<Job[]> {
  const res = await http.get('/jobs', {
    params: { page: 1, limit, status: 'PUBLISHED', sortOrder: 'DESC' },
  })
  return unwrap<BackendJob[]>(res).map(mapJob)
}

export async function fetchRelatedJobs(job: Job, limit = 4): Promise<Job[]> {
  const res = await http.get('/jobs', {
    params: { page: 1, limit: limit + 1, companyId: job.companyId, status: 'PUBLISHED' },
  })
  return unwrap<BackendJob[]>(res)
    .map(mapJob)
    .filter((j) => j.id !== job.id)
    .slice(0, limit)
}

export async function fetchSimilarByCompany(companyId: string, excludeId?: string): Promise<Job[]> {
  const res = await http.get('/jobs', {
    params: { page: 1, limit: 20, companyId, status: 'PUBLISHED' },
  })
  return unwrap<BackendJob[]>(res)
    .map(mapJob)
    .filter((j) => j.id !== excludeId)
}

/* -------- Admin job mutations (POST/PUT/DELETE /jobs) -------- */

export async function createJob(input: BackendJobInput & { companyId: string }): Promise<Job> {
  const res = await http.post('/jobs', input)
  return mapJob(unwrap<BackendJob>(res))
}

export async function updateJob(id: string, input: Partial<BackendJobInput>): Promise<Job> {
  const res = await http.put(`/jobs/${id}`, input)
  return mapJob(unwrap<BackendJob>(res))
}

export async function deleteJob(id: string): Promise<void> {
  await http.delete(`/jobs/${id}`)
}
