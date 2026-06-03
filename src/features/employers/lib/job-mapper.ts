import { MOCK_COMPANIES } from '@/shared/services/mock-data'
import { slugify } from '@/shared/lib/utils'
import type { EmployerJob, EmployerJobStatus } from '../hooks/useEmployerJobs'
import type { Job } from '@/features/jobs/types'
import type { PostJobFormValues } from '../schemas'

const company = MOCK_COMPANIES[2]

export function buildJobFromForm(
  values: PostJobFormValues,
  status: EmployerJobStatus,
): Omit<EmployerJob, 'id'> {
  const skills = values.skills
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  return {
    title: values.title,
    slug: slugify(values.title),
    companyId: company.id,
    company,
    category: values.category,
    city: values.city,
    workMode: values.workMode as Job['workMode'],
    jobType: values.jobType as Job['jobType'],
    experienceLevel: values.experienceLevel as Job['experienceLevel'],
    salaryMin: values.salaryMin,
    salaryMax: values.salaryMax,
    description: values.description,
    requirements: ['Relevant professional experience', 'Strong communication skills'],
    responsibilities: ['Deliver high-quality work', 'Collaborate with the team'],
    benefits: company.benefits,
    skills,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    applicants: 0,
    views: 0,
    isFeatured: Boolean(values.isFeatured),
    isUrgent: Boolean(values.isUrgent),
    isGovernment: false,
    applyMethod: values.applyMethod,
    applyUrl: values.applyMethod === 'external' ? values.applyUrl : undefined,
    status,
  }
}

export function formValuesFromJob(job: EmployerJob): PostJobFormValues {
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
