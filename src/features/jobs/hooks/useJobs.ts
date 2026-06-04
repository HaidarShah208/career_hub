import { useQuery } from '@tanstack/react-query'

import {
  fetchJobs,
  fetchJobById,
  fetchFeaturedJobs,
  fetchLatestJobs,
  fetchRelatedJobs,
} from '../api/jobs.api'
import type { JobFilters } from '../types'

export const jobKeys = {
  all: ['jobs'] as const,
  list: (filters: Partial<JobFilters>, page: number) => ['jobs', 'list', filters, page] as const,
  detail: (id: string) => ['jobs', 'detail', id] as const,
  related: (id: string) => ['jobs', 'related', id] as const,
  collection: (kind: string, limit?: number) => ['jobs', 'collection', kind, limit] as const,
}

export function useJobs(filters: Partial<JobFilters>, page: number) {
  const query = useQuery({
    queryKey: jobKeys.list(filters, page),
    queryFn: () => fetchJobs(filters, page),
    placeholderData: (prev) => prev,
  })

  return {
    jobs: query.data?.jobs ?? [],
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    page: query.data?.page ?? page,
    isLoading: query.isLoading,
    error: query.isError ? 'Failed to load jobs' : null,
  }
}

export function useJob(id: string | undefined) {
  const jobQuery = useQuery({
    queryKey: jobKeys.detail(id ?? ''),
    queryFn: () => fetchJobById(id as string),
    enabled: Boolean(id),
  })

  const job = jobQuery.data ?? null

  const relatedQuery = useQuery({
    queryKey: jobKeys.related(id ?? ''),
    queryFn: () => fetchRelatedJobs(job!),
    enabled: Boolean(job),
  })

  return {
    job,
    related: relatedQuery.data ?? [],
    isLoading: jobQuery.isLoading,
    error: jobQuery.isError ? 'Failed to load job' : !jobQuery.isLoading && !job ? 'Job not found' : null,
  }
}

export function useJobCollection(kind: 'featured' | 'latest', limit?: number) {
  const query = useQuery({
    queryKey: jobKeys.collection(kind, limit),
    queryFn: () => (kind === 'featured' ? fetchFeaturedJobs(limit) : fetchLatestJobs(limit)),
  })

  return {
    jobs: query.data ?? [],
    isLoading: query.isLoading,
    reload: query.refetch,
  }
}
