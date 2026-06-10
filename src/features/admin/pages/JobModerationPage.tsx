import { Link } from 'react-router-dom'
import { AlertTriangle, Check, Trash2, ShieldCheck } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { useToast } from '@/shared/components/ui/toast'
import { ROUTES } from '@/shared/constants'
import { timeAgo } from '@/shared/lib/utils'
import { useAdminModerationJobs } from '../hooks/useAdminData'

export default function JobModerationPage() {
  const { toast } = useToast()
  const { jobs, isLoading, publish, remove, isMutating } = useAdminModerationJobs()

  async function handleApprove(id: string, title: string) {
    try {
      await publish(id)
      toast({ title: `"${title}" published`, variant: 'success' })
    } catch (err) {
      toast({
        title: 'Could not publish job',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  async function handleRemove(id: string, title: string) {
    try {
      await remove(id)
      toast({ title: `"${title}" removed`, variant: 'info' })
    } catch (err) {
      toast({
        title: 'Could not remove job',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <div>
      <PageHeader title="Job Moderation" description={`${jobs.length} draft listings awaiting review.`} />

      {jobs.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Queue cleared" description="No draft jobs need moderation right now." />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={ROUTES.jobDetails(job.id)} className="font-semibold hover:text-primary">
                      {job.title}
                    </Link>
                    <Badge variant="soft-warning" className="gap-1">
                      <AlertTriangle className="h-3 w-3" /> Draft
                    </Badge>
                    {job.isFeatured && <Badge variant="soft">Featured</Badge>}
                    {job.isUrgent && <Badge variant="soft-destructive">Urgent</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.company.name} · {job.city} · created {timeAgo(job.postedAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" disabled={isMutating} onClick={() => handleApprove(job.id, job.title)}>
                    <Check className="h-4 w-4" /> Publish
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={isMutating}
                    onClick={() => handleRemove(job.id, job.title)}
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
