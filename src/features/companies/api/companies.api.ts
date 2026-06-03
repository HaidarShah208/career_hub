import { MOCK_COMPANIES, getCompanyById } from '@/shared/services/mock-data'
import { sleep } from '@/shared/lib/utils'
import type { Company, CompanyFilters } from '../types'

export async function fetchCompanies(filters: Partial<CompanyFilters> = {}): Promise<Company[]> {
  await sleep(400)
  let list = [...MOCK_COMPANIES]

  if (filters.query) {
    const q = filters.query.toLowerCase()
    list = list.filter(c => `${c.name} ${c.industry}`.toLowerCase().includes(q))
  }
  if (filters.industry) list = list.filter(c => c.industry === filters.industry)
  if (filters.city) list = list.filter(c => c.city === filters.city)

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
  await sleep(300)
  return [...MOCK_COMPANIES].sort((a, b) => b.openJobs - a.openJobs).slice(0, limit)
}

export async function fetchCompanyById(id: string): Promise<Company | null> {
  await sleep(300)
  return getCompanyById(id) ?? null
}

export function listIndustries(): string[] {
  return Array.from(new Set(MOCK_COMPANIES.map(c => c.industry))).sort()
}
