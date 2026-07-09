import type {
  Application,
  ApplicationTimelineEntry,
  BackendApplication,
  BackendApplicationStatus,
  BackendCompany,
  BackendEmploymentType,
  BackendJob,
  BackendStatusHistory,
  Company,
  DomainApplicationStatus,
  ExperienceLevel,
  Job,
  JobType,
  WorkMode,
} from '@/shared/types/domain'

function dicebear(seed: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    seed,
  )}&backgroundColor=16a34a,15803d,166534,059669&textColor=ffffff`
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

/* ------------------------------- Company -------------------------------- */

export function mapCompany(c: BackendCompany): Company {
  return {
    id: c.id,
    name: c.name,
    slug: slugify(c.name),
    logo: c.logo ?? null,
    logoUrl: c.logo || dicebear(c.name),
    industry: c.industry || 'General',
    size: c.companySize || '—',
    founded: c.foundedYear ?? 0,
    city: c.location || '',
    website: c.website || '',
    description: c.description || '',
    isVerified: c.isVerified ?? true,
    rating: 0,
    reviewCount: 0,
    openJobs: c.jobs?.length ?? 0,
    benefits: [],
  }
}

/** A minimal placeholder company for jobs returned without an embedded company. */
function placeholderCompany(companyId: string): Company {
  return {
    id: companyId,
    name: 'Company',
    slug: 'company',
    logo: null,
    logoUrl: dicebear('Company'),
    industry: 'General',
    size: '—',
    founded: 0,
    city: '',
    website: '',
    description: '',
    isVerified: true,
    rating: 0,
    reviewCount: 0,
    openJobs: 0,
    benefits: [],
  }
}

/* --------------------------------- Job ---------------------------------- */

const EMPLOYMENT_TO_JOBTYPE: Record<BackendEmploymentType, JobType> = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  REMOTE: 'full_time',
  INTERNSHIP: 'internship',
  CONTRACT: 'contract',
}

export function mapJob(j: BackendJob): Job {
  const company = j.company ? mapCompany(j.company) : placeholderCompany(j.companyId)
  const workMode: WorkMode = j.employmentType === 'REMOTE' ? 'remote' : 'onsite'
  const city = j.employmentType === 'REMOTE' ? 'Remote' : j.location || company.city || ''

  return {
    id: j.id,
    title: j.title,
    slug: j.slug,
    companyId: j.companyId,
    company,
    category: j.category || 'software',
    city,
    workMode,
    jobType: EMPLOYMENT_TO_JOBTYPE[j.employmentType] ?? 'full_time',
    experienceLevel: (j.experienceLevel as ExperienceLevel) || ('mid' as ExperienceLevel),
    salaryMin: j.salaryMin ?? 0,
    salaryMax: j.salaryMax ?? 0,
    description: j.description,
    requirements: [],
    responsibilities: [],
    benefits: [],
    skills: j.skills ?? [],
    postedAt: j.createdAt,
    expiresAt: addDays(j.createdAt, 30),
    applicants: 0,
    views: j.viewCount ?? 0,
    isFeatured: Boolean(j.isFeatured),
    isUrgent: Boolean(j.isUrgent),
    isGovernment: j.category === 'government',
    applyMethod: j.applyMethod || 'internal',
    applyUrl: j.applyUrl || undefined,
    backendStatus: j.status,
  }
}

/** Maps the employer job-form values onto the backend create/update payload. */
export interface BackendJobInput {
  title: string
  description: string
  location?: string
  employmentType: BackendEmploymentType
  salaryMin?: number
  salaryMax?: number
  category?: string
  experienceLevel?: string
  skills?: string[]
  applyMethod?: 'internal' | 'external'
  applyUrl?: string
  isUrgent?: boolean
  isFeatured?: boolean
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED'
}

export function toBackendEmploymentType(jobType: string, workMode: string): BackendEmploymentType {
  if (workMode === 'remote') return 'REMOTE'
  switch (jobType) {
    case 'part_time':
      return 'PART_TIME'
    case 'internship':
      return 'INTERNSHIP'
    case 'contract':
    case 'freelance':
    case 'temporary':
      return 'CONTRACT'
    default:
      return 'FULL_TIME'
  }
}

/* ----------------------------- Application ------------------------------ */

const BACKEND_TO_DOMAIN_STATUS: Record<BackendApplicationStatus, DomainApplicationStatus> = {
  APPLIED: 'applied',
  UNDER_REVIEW: 'reviewed',
  SHORTLISTED: 'shortlisted',
  INTERVIEW_SCHEDULED: 'interview',
  REJECTED: 'rejected',
  HIRED: 'offered',
}

export function mapApplicationStatus(status: BackendApplicationStatus): DomainApplicationStatus {
  return BACKEND_TO_DOMAIN_STATUS[status] ?? 'applied'
}

function mapTimeline(history?: BackendStatusHistory[]): ApplicationTimelineEntry[] | undefined {
  if (!history?.length) return undefined
  return history.map((h) => ({
    status: mapApplicationStatus(h.status),
    note: h.note ?? undefined,
    date: h.createdAt,
  }))
}

export function mapApplication(a: BackendApplication): Application {
  const job = a.job
    ? mapJob(a.job)
    : ({
        id: a.jobId,
        title: 'Job',
        company: placeholderCompany(''),
      } as unknown as Job)

  const candidateName = a.candidate
    ? `${a.candidate.firstName} ${a.candidate.lastName}`.trim()
    : undefined

  const profile = a.candidateProfile
  const candidateProfile = profile
    ? {
        headline: profile.headline ?? undefined,
        bio: profile.bio ?? undefined,
        skills: profile.skills ?? [],
        experienceYears: profile.experienceYears ?? 0,
        city: profile.city ?? undefined,
        avatarUrl: profile.avatarUrl ?? undefined,
        resumeUrl: profile.resumeUrl ?? undefined,
      }
    : undefined

  return {
    id: a.id,
    jobId: a.jobId,
    job,
    candidateId: a.candidateId,
    candidateName,
    candidateEmail: a.candidate?.email,
    candidateProfile,
    status: mapApplicationStatus(a.status),
    appliedAt: a.createdAt,
    matchScore: 0,
    resumeUrl: candidateProfile?.resumeUrl,
    timeline: mapTimeline(a.history),
  }
}
