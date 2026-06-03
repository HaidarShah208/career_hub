import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { JobCard } from '@/features/jobs/components/JobCard'
import { useSavedJobs } from '@/features/jobs/hooks/useSavedJobs'
import { getJobById } from '@/shared/services/mock-data'
import { ROUTES } from '@/shared/constants'

export default function SavedJobsPage() {
  const { ids, clear } = useSavedJobs()
  const jobs = ids.map(getJobById).filter(Boolean)

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

      {jobs.length === 0 ? (
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
