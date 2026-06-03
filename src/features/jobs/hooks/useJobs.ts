import { useCallback, useEffect, useRef, useState } from 'react'

import {
  fetchJobs,
  fetchJobById,
  fetchFeaturedJobs,
  fetchLatestJobs,
  fetchRelatedJobs,
} from '../api/jobs.api'
import type { Job, JobFilters, JobQueryResult } from '../types'

interface UseJobsState extends JobQueryResult {
  isLoading: boolean
  error: string | null
}

const initialResult: JobQueryResult = { jobs: [], total: 0, totalPages: 1, page: 1 }

export function useJobs(filters: Partial<JobFilters>, page: number) {
  const [state, setState] = useState<UseJobsState>({
    ...initialResult,
    isLoading: true,
    error: null,
  })
  const requestId = useRef(0)
  const filtersKey = JSON.stringify(filters)

  useEffect(() => {
    const id = ++requestId.current
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    fetchJobs(filters, page)
      .then(res => {
        if (id !== requestId.current) return
        setState({ ...res, isLoading: false, error: null })
      })
      .catch(() => {
        if (id !== requestId.current) return
        setState({ ...initialResult, isLoading: false, error: 'Failed to load jobs' })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, page])

  return state
}

export function useJob(id: string | undefined) {
  const [job, setJob] = useState<Job | null>(null)
  const [related, setRelated] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    setIsLoading(true)
    setError(null)
    fetchJobById(id)
      .then(async result => {
        if (!active) return
        setJob(result)
        if (result) setRelated(await fetchRelatedJobs(result))
        if (!result) setError('Job not found')
      })
      .catch(() => active && setError('Failed to load job'))
      .finally(() => active && setIsLoading(false))
    return () => {
      active = false
    }
  }, [id])

  return { job, related, isLoading, error }
}

export function useJobCollection(kind: 'featured' | 'latest', limit?: number) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(() => {
    setIsLoading(true)
    const promise = kind === 'featured' ? fetchFeaturedJobs(limit) : fetchLatestJobs(limit)
    promise.then(setJobs).finally(() => setIsLoading(false))
  }, [kind, limit])

  useEffect(() => {
    load()
  }, [load])

  return { jobs, isLoading, reload: load }
}
