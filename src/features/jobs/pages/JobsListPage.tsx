import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Briefcase, Search } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { Pagination } from '@/shared/components/common/Pagination'
import { JobFiltersPanel } from '../components/JobFilters'
import { JobCard, JobCardSkeleton } from '../components/JobCard'
import { useJobs } from '../hooks/useJobs'
import { DEFAULT_JOB_FILTERS, type JobFilters, type JobSort } from '../types'

const SORT_OPTIONS: { value: JobSort; label: string }[] = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'salary_high', label: 'Salary: High to Low' },
  { value: 'salary_low', label: 'Salary: Low to High' },
]

function filtersFromParams(params: URLSearchParams): JobFilters {
  return {
    query: params.get('q') ?? '',
    city: params.get('city') ?? '',
    category: params.get('category') ?? '',
    jobType: params.get('type') ?? '',
    experienceLevel: params.get('experience') ?? '',
    workMode: params.get('mode') ?? '',
    salaryRange: params.get('salary') ?? '',
    sort: (params.get('sort') as JobSort) ?? 'recent',
  }
}

export default function JobsListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams])
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [queryInput, setQueryInput] = useState(filters.query)

  useEffect(() => {
    setQueryInput(filters.query)
  }, [filters.query])

  const { jobs, total, totalPages, isLoading } = useJobs(filters, page)

  function updateParams(patch: Partial<JobFilters>, resetPage = true) {
    const next = new URLSearchParams(searchParams)
    const map: Record<keyof JobFilters, string> = {
      query: 'q',
      city: 'city',
      category: 'category',
      jobType: 'type',
      experienceLevel: 'experience',
      workMode: 'mode',
      salaryRange: 'salary',
      sort: 'sort',
    }
    for (const [key, value] of Object.entries(patch)) {
      const paramKey = map[key as keyof JobFilters]
      if (value) next.set(paramKey, String(value))
      else next.delete(paramKey)
    }
    if (resetPage) {
      next.delete('page')
      setPage(1)
    }
    setSearchParams(next)
  }

  function resetFilters() {
    setSearchParams(new URLSearchParams())
    setPage(1)
  }

  function changePage(p: number) {
    setPage(p)
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Find Jobs in Pakistan</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Searching…' : `${total.toLocaleString()} jobs match your criteria`}
        </p>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault()
          updateParams({ query: queryInput })
        }}
        className="mb-6 flex flex-col gap-2 sm:flex-row"
      >
        <Input
          value={queryInput}
          onChange={e => setQueryInput(e.target.value)}
          placeholder="Search by title, skill or company"
          leftIcon={<Search />}
          className="h-11"
        />
        <Button type="submit" size="lg" className="h-11 shrink-0">
          Search
        </Button>
      </form>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <JobFiltersPanel
            filters={filters}
            onChange={patch => updateParams(patch)}
            onReset={resetFilters}
          />
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {!isLoading && `Page ${page} of ${totalPages}`}
            </p>
            <div className="w-48">
              <Select value={filters.sort} onValueChange={v => updateParams({ sort: v as JobSort })}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs found"
              description="Try adjusting your filters or search keywords to see more results."
              action={
                <Button variant="outline" onClick={resetFilters}>
                  Clear all filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={changePage}
                className="mt-8"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
