import { Link } from 'react-router-dom'
import { Eye, MoreVertical, Pencil, Plus, Trash2, Users } from 'lucide-react'

import { Badge, type BadgeProps } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { useToast } from '@/shared/components/ui/toast'
import { useEmployerJobs, type EmployerJobStatus } from '../hooks/useEmployerJobs'
import { ROUTES } from '@/shared/constants'
import { formatSalaryRange, timeAgo } from '@/shared/lib/utils'
import { Briefcase } from 'lucide-react'

const STATUS_VARIANT: Record<EmployerJobStatus, BadgeProps['variant']> = {
  active: 'success',
  paused: 'soft-warning',
  closed: 'secondary',
  draft: 'outline',
}

export default function MyJobsPage() {
  const { toast } = useToast()
  const { jobs, removeJob, setStatus } = useEmployerJobs()

  return (
    <div>
      <PageHeader
        title="My Jobs"
        description={`${jobs.length} job posting${jobs.length === 1 ? '' : 's'}.`}
        actions={
          <Button asChild>
            <Link to={ROUTES.employerPostJob}>
              <Plus className="h-4 w-4" /> Post a job
            </Link>
          </Button>
        }
      />

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Post your first job to start receiving applications."
          action={
            <Button asChild>
              <Link to={ROUTES.employerPostJob}>Post a job</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <Card key={job.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={ROUTES.jobDetails(job.id)} className="font-semibold hover:text-primary">
                      {job.title}
                    </Link>
                    <Badge variant={STATUS_VARIANT[job.status]} className="capitalize">
                      {job.status}
                    </Badge>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{job.city}</span>
                    <span>{formatSalaryRange(job.salaryMin, job.salaryMax)}</span>
                    <span>Posted {timeAgo(job.postedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    to={ROUTES.employerApplicants}
                    className="flex items-center gap-1.5 text-sm font-medium text-primary"
                  >
                    <Users className="h-4 w-4" /> {job.applicants}
                  </Link>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" /> {job.views.toLocaleString()}
                  </span>
                  <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.employerEditJob(job.id)}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="More actions">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setStatus(job.id, job.status === 'active' ? 'paused' : 'active')}>
                        {job.status === 'active' ? 'Pause job' : 'Activate job'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus(job.id, 'closed')}>Mark as closed</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          removeJob(job.id)
                          toast({ title: 'Job deleted', variant: 'success' })
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
