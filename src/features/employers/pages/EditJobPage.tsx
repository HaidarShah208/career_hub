import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { useToast } from '@/shared/components/ui/toast'
import { JobForm } from '../components/JobForm'
import { useEmployerJobs } from '../hooks/useEmployerJobs'
import { buildJobFromForm, formValuesFromJob } from '../lib/job-mapper'
import { ROUTES } from '@/shared/constants'
import type { PostJobFormValues } from '../schemas'

export default function EditJobPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getById, updateJob } = useEmployerJobs()
  const job = id ? getById(id) : undefined

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

  function handleSubmit(values: PostJobFormValues) {
    updateJob(job!.id, buildJobFromForm(values, job!.status))
    toast({ title: 'Job updated', description: `${values.title} has been saved.`, variant: 'success' })
    navigate(ROUTES.employerJobs)
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
