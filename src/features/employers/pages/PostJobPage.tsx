import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { useToast } from '@/shared/components/ui/toast'
import { JobForm } from '../components/JobForm'
import { useEmployerJobMutations } from '../hooks/useEmployerJobs'
import { useEmployerCompany } from '../hooks/useEmployerCompany'
import { buildJobPayload } from '../lib/job-mapper'
import { ROUTES } from '@/shared/constants'
import type { PostJobFormValues } from '../schemas'

export default function PostJobPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { createJob } = useEmployerJobMutations()
  const { hasCompany, isLoading } = useEmployerCompany()

  async function handleSubmit(values: PostJobFormValues) {
    if (!hasCompany) {
      toast({
        title: 'Create your company first',
        description: 'You need a company profile before posting jobs.',
        variant: 'warning',
      })
      navigate(ROUTES.employerCompany)
      return
    }
    try {
      await createJob(buildJobPayload(values, 'PUBLISHED'))
      toast({ title: 'Job posted!', description: `${values.title} is now live.`, variant: 'success' })
      navigate(ROUTES.employerJobs)
    } catch (err) {
      toast({
        title: 'Could not post job',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-2 -ml-2 text-muted-foreground"
        onClick={() => navigate(ROUTES.employerJobs)}
      >
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Button>
      <PageHeader title="Post a New Job" description="Fill in the details to publish your job listing." />
      {!isLoading && !hasCompany && (
        <p className="mb-4 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-warning-foreground">
          You haven’t created a company yet. Create one on the{' '}
          <button className="font-medium underline" onClick={() => navigate(ROUTES.employerCompany)}>
            Company
          </button>{' '}
          page before posting.
        </p>
      )}
      <JobForm submitLabel="Publish job" onSubmit={handleSubmit} />
    </div>
  )
}
