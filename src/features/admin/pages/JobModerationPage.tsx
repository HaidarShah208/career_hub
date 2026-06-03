import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Check, Trash2 } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { useToast } from '@/shared/components/ui/toast'
import { MODERATION_JOBS } from '../data'
import { ROUTES } from '@/shared/constants'
import { timeAgo } from '@/shared/lib/utils'
import { ShieldCheck } from 'lucide-react'

export default function JobModerationPage() {
  const { toast } = useToast()
  const [jobs, setJobs] = useState(MODERATION_JOBS)

  function resolve(id: string, approved: boolean) {
    setJobs(prev => prev.filter(j => j.id !== id))
    toast({ title: approved ? 'Job approved' : 'Job removed', variant: approved ? 'success' : 'info' })
  }

  return (
    <div>
      <PageHeader title="Job Moderation" description={`${jobs.length} listings in the moderation queue.`} />

      {jobs.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Queue cleared" description="No jobs need moderation right now." />
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
                    {job.flagReason && (
                      <Badge variant="soft-destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" /> {job.flagReason}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.company} · {job.city} · posted {timeAgo(job.postedAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => resolve(job.id, true)}>
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => resolve(job.id, false)}
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
