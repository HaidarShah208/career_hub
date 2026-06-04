import type { Company } from '@/shared/types/domain'

export type { Company }

export interface CompanyFilters {
  query: string
  industry: string
  city: string
  sort: 'rating' | 'jobs' | 'name'
}

export const DEFAULT_COMPANY_FILTERS: CompanyFilters = {
  query: '',
  industry: '',
  city: '',
  sort: 'jobs',
}
