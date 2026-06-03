import { MOCK_JOBS, getJobById } from '@/shared/services/mock-data'
import { SALARY_RANGES, PAGINATION } from '@/shared/constants'
import { sleep } from '@/shared/lib/utils'
import type { Job, JobFilters, JobQueryResult, JobSort } from '../types'

/**
 * Mock job API. Mimics a paginated REST endpoint backed by an in-memory dataset.
 * Swap the bodies for real `http` calls when a backend is available.
 */

function applySort(jobs: Job[], sort: JobSort): Job[] {
  const sorted = [...jobs]
  switch (sort) {
    case 'recent':
      return sorted.sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt))
    case 'salary_high':
      return sorted.sort((a, b) => b.salaryMax - a.salaryMax)
    case 'salary_low':
      return sorted.sort((a, b) => a.salaryMin - b.salaryMin)
    case 'relevant':
    default:
      return sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
  }
}

export function filterJobs(jobs: Job[], filters: Partial<JobFilters>): Job[] {
  return jobs.filter(job => {
    if (filters.query) {
      const q = filters.query.toLowerCase()
      const haystack = `${job.title} ${job.company.name} ${job.skills.join(' ')} ${job.category}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    if (filters.city && job.city !== filters.city) return false
    if (filters.category && job.category !== filters.category) return false
    if (filters.jobType && job.jobType !== filters.jobType) return false
    if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) return false
    if (filters.workMode && job.workMode !== filters.workMode) return false
    if (filters.salaryRange) {
      const range = SALARY_RANGES.find(r => r.value === filters.salaryRange)
      if (range && (job.salaryMax < range.min || job.salaryMin > range.max)) return false
    }
    return true
  })
}

export async function fetchJobs(
  filters: Partial<JobFilters>,
  page = 1,
  pageSize = PAGINATION.jobsPerPage,
): Promise<JobQueryResult> {
  await sleep(500)
  const filtered = filterJobs(MOCK_JOBS, filters)
  const sorted = applySort(filtered, (filters.sort as JobSort) ?? 'recent')
  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  return {
    jobs: sorted.slice(start, start + pageSize),
    total,
    totalPages,
    page,
  }
}

export async function fetchJobById(id: string): Promise<Job | null> {
  await sleep(400)
  return getJobById(id) ?? null
}

export async function fetchFeaturedJobs(limit = 6): Promise<Job[]> {
  await sleep(300)
  return MOCK_JOBS.filter(j => j.isFeatured).slice(0, limit)
}

export async function fetchLatestJobs(limit = 8): Promise<Job[]> {
  await sleep(300)
  return [...MOCK_JOBS]
    .sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt))
    .slice(0, limit)
}

export async function fetchRelatedJobs(job: Job, limit = 4): Promise<Job[]> {
  await sleep(300)
  return MOCK_JOBS.filter(j => j.id !== job.id && j.category === job.category).slice(0, limit)
}

export async function fetchSimilarByCompany(companyId: string, excludeId?: string): Promise<Job[]> {
  await sleep(200)
  return MOCK_JOBS.filter(j => j.companyId === companyId && j.id !== excludeId)
}
