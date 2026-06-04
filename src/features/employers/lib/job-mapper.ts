import { toBackendEmploymentType } from '@/shared/services/mappers'
import type { EmployerJobInput } from '../api/employer.api'
import type { Job } from '@/features/jobs/types'
import type { PostJobFormValues } from '../schemas'

/** Maps the post/edit job form onto the backend create/update payload. */
export function buildJobPayload(
  values: PostJobFormValues,
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED',
): EmployerJobInput {
  const skills = values.skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return {
    title: values.title,
    description: values.description,
    location: values.workMode === 'remote' ? 'Remote' : values.city,
    employmentType: toBackendEmploymentType(values.jobType, values.workMode),
    salaryMin: values.salaryMin,
    salaryMax: values.salaryMax,
    category: values.category,
    experienceLevel: values.experienceLevel,
    skills,
    applyMethod: values.applyMethod,
    applyUrl: values.applyMethod === 'external' ? values.applyUrl || undefined : undefined,
    isUrgent: values.isUrgent,
    isFeatured: values.isFeatured,
    ...(status ? { status } : {}),
  }
}

/** Pre-fills the form from an existing job (edit screen). */
export function formValuesFromJob(job: Job): PostJobFormValues {
  return {
    title: job.title,
    category: job.category,
    city: job.city,
    workMode: job.workMode,
    jobType: job.jobType,
    experienceLevel: job.experienceLevel,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    description: job.description,
    skills: job.skills.join(', '),
    applyMethod: job.applyMethod ?? 'internal',
    applyUrl: job.applyUrl ?? '',
    isUrgent: job.isUrgent,
    isFeatured: job.isFeatured,
  }
}
