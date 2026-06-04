import type { Job, WorkMode, JobType, ExperienceLevel } from '@/shared/types/domain'

export type { Job, WorkMode, JobType, ExperienceLevel }

export interface JobFilters {
  query: string
  city: string
  category: string
  jobType: string
  experienceLevel: string
  workMode: string
  salaryRange: string
  sort: JobSort
}

export type JobSort = 'relevant' | 'recent' | 'salary_high' | 'salary_low'

export const DEFAULT_JOB_FILTERS: JobFilters = {
  query: '',
  city: '',
  category: '',
  jobType: '',
  experienceLevel: '',
  workMode: '',
  salaryRange: '',
  sort: 'recent',
}

export interface JobQueryResult {
  jobs: Job[]
  total: number
  totalPages: number
  page: number
}
