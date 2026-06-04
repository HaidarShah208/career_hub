import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/shared/components/ui/button'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { JobCard, JobCardSkeleton } from '@/features/jobs/components/JobCard'
import { useSavedJobs } from '@/features/jobs/hooks/useSavedJobs'
import { fetchJobById } from '@/features/jobs/api/jobs.api'
import type { Job } from '@/features/jobs/types'
import { ROUTES } from '@/shared/constants'

export default function SavedJobsPage() {
  const { ids, clear } = useSavedJobs()
  const { data, isLoading } = useQuery({
    queryKey: ['saved-jobs', ids],
    queryFn: async () => {
      const results = await Promise.all(ids.map((id) => fetchJobById(id)))
      return results.filter((j): j is Job => Boolean(j))
    },
    enabled: ids.length > 0,
  })
  const jobs = data ?? []

  return (
    <div>
      <PageHeader
        title="Saved Jobs"
        description={`${jobs.length} job${jobs.length === 1 ? '' : 's'} saved for later.`}
        actions={
          jobs.length > 0 ? (
            <Button variant="outline" onClick={clear}>
              Clear all
            </Button>
          ) : undefined
        }
      />

      {isLoading && ids.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: Math.min(ids.length, 6) }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Tap the bookmark icon on any job to save it here for later."
          action={
            <Button asChild>
              <Link to={ROUTES.jobs}>Browse jobs</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map(job => (
            <JobCard key={job!.id} job={job!} />
          ))}
        </div>
      )}
    </div>
  )
}
