import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { useToast } from '@/shared/components/ui/toast'
import { JobForm } from '../components/JobForm'
import { useEmployerJob, useEmployerJobMutations } from '../hooks/useEmployerJobs'
import { buildJobPayload, formValuesFromJob } from '../lib/job-mapper'
import { ROUTES } from '@/shared/constants'
import type { PostJobFormValues } from '../schemas'

export default function EditJobPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { job, isLoading } = useEmployerJob(id)
  const { updateJob } = useEmployerJobMutations()

  if (isLoading) return <PageLoader />

  if (!job) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-xl font-bold">Job not found</h1>
        <Button asChild className="mt-4">
          <Link to={ROUTES.employerJobs}>Back to my jobs</Link>
        </Button>
      </div>
    )
  }

  async function handleSubmit(values: PostJobFormValues) {
    try {
      await updateJob({ id: job!.id, input: buildJobPayload(values) })
      toast({ title: 'Job updated', description: `${values.title} has been saved.`, variant: 'success' })
      navigate(ROUTES.employerJobs)
    } catch (err) {
      toast({
        title: 'Could not save job',
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
      <PageHeader title="Edit Job" description="Update the details of your job listing." />
      <JobForm submitLabel="Save changes" defaultValues={formValuesFromJob(job)} onSubmit={handleSubmit} />
    </div>
  )
}
