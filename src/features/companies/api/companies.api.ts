import http, { unwrap } from '@/shared/services/http'
import { mapCompany } from '@/shared/services/mappers'
import type { BackendCompany } from '@/shared/types/domain'
import type { Company, CompanyFilters } from '../types'

export async function fetchCompanies(filters: Partial<CompanyFilters> = {}): Promise<Company[]> {
  const res = await http.get('/companies', {
    params: { page: 1, limit: 100, ...(filters.query ? { search: filters.query } : {}) },
  })
  let list = unwrap<BackendCompany[]>(res).map(mapCompany)

  if (filters.industry) list = list.filter((c) => c.industry === filters.industry)
  if (filters.city) list = list.filter((c) => c.city === filters.city)

  switch (filters.sort) {
    case 'rating':
      list.sort((a, b) => b.rating - a.rating)
      break
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'jobs':
    default:
      list.sort((a, b) => b.openJobs - a.openJobs)
  }
  return list
}

export async function fetchTopCompanies(limit = 8): Promise<Company[]> {
  const res = await http.get('/companies', { params: { page: 1, limit } })
  return unwrap<BackendCompany[]>(res)
    .map(mapCompany)
    .sort((a, b) => b.openJobs - a.openJobs)
    .slice(0, limit)
}

export async function fetchCompanyById(id: string): Promise<Company | null> {
  try {
    const res = await http.get(`/companies/${id}`)
    return mapCompany(unwrap<BackendCompany>(res))
  } catch {
    return null
  }
}

/** Industries are derived from the loaded companies (no dedicated endpoint). */
export async function listIndustries(): Promise<string[]> {
  const companies = await fetchCompanies()
  return Array.from(new Set(companies.map((c) => c.industry))).sort()
}
