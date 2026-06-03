import { useEffect, useState } from 'react'

import { fetchCompanies, fetchCompanyById, fetchTopCompanies } from '../api/companies.api'
import { fetchSimilarByCompany } from '@/features/jobs/api/jobs.api'
import type { Job } from '@/features/jobs/types'
import type { Company, CompanyFilters } from '../types'

export function useCompanies(filters: Partial<CompanyFilters>) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const key = JSON.stringify(filters)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    fetchCompanies(filters)
      .then(res => active && setCompanies(res))
      .finally(() => active && setIsLoading(false))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { companies, isLoading }
}

export function useTopCompanies(limit?: number) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchTopCompanies(limit)
      .then(res => active && setCompanies(res))
      .finally(() => active && setIsLoading(false))
    return () => {
      active = false
    }
  }, [limit])

  return { companies, isLoading }
}

export function useCompany(id: string | undefined) {
  const [company, setCompany] = useState<Company | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let active = true
    setIsLoading(true)
    fetchCompanyById(id)
      .then(async res => {
        if (!active) return
        setCompany(res)
        if (res) setJobs(await fetchSimilarByCompany(res.id))
      })
      .finally(() => active && setIsLoading(false))
    return () => {
      active = false
    }
  }, [id])

  return { company, jobs, isLoading }
}
