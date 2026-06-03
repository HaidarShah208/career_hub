import type { MockCompany } from '@/shared/services/mock-data'

export type Company = MockCompany

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
