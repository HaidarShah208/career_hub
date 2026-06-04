import { useQuery } from '@tanstack/react-query'

import { fetchCompanies, fetchCompanyById, fetchTopCompanies } from '../api/companies.api'
import { fetchSimilarByCompany } from '@/features/jobs/api/jobs.api'
import type { CompanyFilters } from '../types'

export const companyKeys = {
  all: ['companies'] as const,
  list: (filters: Partial<CompanyFilters>) => ['companies', 'list', filters] as const,
  top: (limit?: number) => ['companies', 'top', limit] as const,
  detail: (id: string) => ['companies', 'detail', id] as const,
  jobs: (id: string) => ['companies', 'jobs', id] as const,
}

export function useCompanies(filters: Partial<CompanyFilters>) {
  const query = useQuery({
    queryKey: companyKeys.list(filters),
    queryFn: () => fetchCompanies(filters),
    placeholderData: (prev) => prev,
  })
  return { companies: query.data ?? [], isLoading: query.isLoading }
}

export function useTopCompanies(limit?: number) {
  const query = useQuery({
    queryKey: companyKeys.top(limit),
    queryFn: () => fetchTopCompanies(limit),
  })
  return { companies: query.data ?? [], isLoading: query.isLoading }
}

export function useCompany(id: string | undefined) {
  const companyQuery = useQuery({
    queryKey: companyKeys.detail(id ?? ''),
    queryFn: () => fetchCompanyById(id as string),
    enabled: Boolean(id),
  })

  const company = companyQuery.data ?? null

  const jobsQuery = useQuery({
    queryKey: companyKeys.jobs(id ?? ''),
    queryFn: () => fetchSimilarByCompany(company!.id),
    enabled: Boolean(company),
  })

  return {
    company,
    jobs: jobsQuery.data ?? [],
    isLoading: companyQuery.isLoading,
  }
}
