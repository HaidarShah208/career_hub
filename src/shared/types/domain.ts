/**
 * Frontend domain models. These mirror the shapes the UI was built against and
 * are produced by mapping the leaner backend DTOs (see `shared/services/mappers`).
 * Fields the backend does not (yet) provide are filled with sensible defaults
 * by the mappers so the UI degrades gracefully rather than breaking.
 */

export interface Company {
  id: string
  name: string
  slug: string
  logoUrl: string
  industry: string
  size: string
  founded: number
  city: string
  website: string
  description: string
  isVerified: boolean
  rating: number
  reviewCount: number
  openJobs: number
  benefits: string[]
}

export type WorkMode = 'onsite' | 'remote' | 'hybrid'
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance' | 'temporary'
export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive'

export interface Job {
  id: string
  title: string
  slug: string
  companyId: string
  company: Company
  category: string
  city: string
  workMode: WorkMode
  jobType: JobType
  experienceLevel: ExperienceLevel
  salaryMin: number
  salaryMax: number
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  skills: string[]
  postedAt: string
  expiresAt: string
  applicants: number
  views: number
  isFeatured: boolean
  isUrgent: boolean
  isGovernment: boolean
  /** How candidates apply. `internal` = apply on PCH, `external` = redirect to applyUrl. */
  applyMethod?: 'internal' | 'external'
  /** External application URL (only used when applyMethod === 'external'). */
  applyUrl?: string
  /** Backend lifecycle status (DRAFT | PUBLISHED | CLOSED), passed through for employer views. */
  backendStatus?: 'DRAFT' | 'PUBLISHED' | 'CLOSED'
}

export type DomainApplicationStatus =
  | 'applied'
  | 'reviewed'
  | 'shortlisted'
  | 'interview'
  | 'offered'
  | 'rejected'
  | 'withdrawn'

export interface ApplicationTimelineEntry {
  status: DomainApplicationStatus
  note?: string
  date: string
}

export interface Application {
  id: string
  jobId: string
  job: Job
  candidateId: string
  candidateName?: string
  candidateEmail?: string
  status: DomainApplicationStatus
  appliedAt: string
  coverLetter?: string
  resumeUrl?: string
  matchScore: number
  timeline?: ApplicationTimelineEntry[]
}

/* ----------------------------- Backend DTOs ------------------------------ */

export type BackendJobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED'
export type BackendEmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'REMOTE'
  | 'INTERNSHIP'
  | 'CONTRACT'
export type BackendApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'REJECTED'
  | 'HIRED'

export interface BackendCompany {
  id: string
  name: string
  description?: string | null
  website?: string | null
  location?: string | null
  logo?: string | null
  industry?: string | null
  companySize?: string | null
  foundedYear?: number | null
  ownerId: string
  jobs?: BackendJob[]
  createdAt: string
  updatedAt: string
}

export interface BackendJob {
  id: string
  title: string
  slug: string
  description: string
  location?: string | null
  employmentType: BackendEmploymentType
  salaryMin?: number | null
  salaryMax?: number | null
  category?: string | null
  experienceLevel?: string | null
  skills?: string[] | null
  applyMethod?: 'internal' | 'external' | null
  applyUrl?: string | null
  isUrgent?: boolean | null
  isFeatured?: boolean | null
  viewCount?: number | null
  status: BackendJobStatus
  companyId: string
  company?: BackendCompany
  createdAt: string
  updatedAt: string
}

export interface BackendStatusHistory {
  id: string
  applicationId: string
  status: BackendApplicationStatus
  note?: string | null
  changedById?: string | null
  createdAt: string
}

export interface BackendCandidate {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface BackendApplication {
  id: string
  candidateId: string
  jobId: string
  status: BackendApplicationStatus
  job?: BackendJob
  candidate?: BackendCandidate
  history?: BackendStatusHistory[]
  createdAt: string
  updatedAt: string
}
