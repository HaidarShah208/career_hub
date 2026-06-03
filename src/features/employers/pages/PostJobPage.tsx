import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { useToast } from '@/shared/components/ui/toast'
import { JobForm } from '../components/JobForm'
import { useEmployerJobs } from '../hooks/useEmployerJobs'
import { buildJobFromForm } from '../lib/job-mapper'
import { ROUTES } from '@/shared/constants'
import type { PostJobFormValues } from '../schemas'

export default function PostJobPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const addJob = useEmployerJobs(s => s.addJob)

  function handleSubmit(values: PostJobFormValues) {
    addJob(buildJobFromForm(values, 'active'))
    toast({ title: 'Job posted!', description: `${values.title} is now live.`, variant: 'success' })
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
      <PageHeader title="Post a New Job" description="Fill in the details to publish your job listing." />
      <JobForm submitLabel="Publish job" onSubmit={handleSubmit} />
    </div>
  )
}
