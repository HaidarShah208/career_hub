import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getApplicant,
  listApplicants,
  updateApplicantStatus,
} from '../api/employer.api'
import type {
  Application,
  BackendApplicationStatus,
  DomainApplicationStatus,
} from '@/shared/types/domain'
import { employerCompanyKeys } from './useEmployerCompany'

export type ApplicantStatus = 'new' | 'shortlisted' | 'interview' | 'rejected' | 'hired'

export interface Applicant {
  id: string
  name: string
  avatarUrl: string
  headline: string
  city: string
  jobId: string
  jobTitle: string
  appliedAt: string
  matchScore: number
  experienceYears: number
  status: ApplicantStatus
  skills: string[]
}

export const applicantKeys = {
  all: ['employer', 'applicants'] as const,
  detail: (id: string) => ['employer', 'applicants', id] as const,
}

function dicebear(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`
}

const DOMAIN_TO_APPLICANT: Record<DomainApplicationStatus, ApplicantStatus> = {
  applied: 'new',
  reviewed: 'new',
  shortlisted: 'shortlisted',
  interview: 'interview',
  offered: 'hired',
  rejected: 'rejected',
  withdrawn: 'rejected',
}

const APPLICANT_TO_BACKEND: Record<ApplicantStatus, BackendApplicationStatus> = {
  new: 'APPLIED',
  shortlisted: 'SHORTLISTED',
  interview: 'INTERVIEW_SCHEDULED',
  rejected: 'REJECTED',
  hired: 'HIRED',
}

/** Applicants across all of the employer's jobs, plus a status mutation. */
export function useApplicants() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: applicantKeys.all,
    queryFn: () => listApplicants(1, 100),
  })

  function toApplicant(a: Application): Applicant {
    const name = a.candidateName || 'Candidate'
    const profile = a.candidateProfile
    return {
      id: a.id,
      name,
      avatarUrl: profile?.avatarUrl || dicebear(name),
      headline: profile?.headline || 'Candidate',
      city: profile?.city || a.job.city || '',
      jobId: a.jobId,
      jobTitle: a.job.title,
      appliedAt: a.appliedAt,
      matchScore: a.matchScore,
      experienceYears: profile?.experienceYears ?? 0,
      status: DOMAIN_TO_APPLICANT[a.status] ?? 'new',
      skills: profile?.skills ?? [],
    }
  }

  const applicants: Applicant[] = (query.data?.applicants ?? []).map(toApplicant)

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicantStatus }) =>
      updateApplicantStatus(id, APPLICANT_TO_BACKEND[status]),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: applicantKeys.all })
      queryClient.invalidateQueries({ queryKey: applicantKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: employerCompanyKeys.analytics })
      queryClient.invalidateQueries({ queryKey: employerCompanyKeys.dashboard })
    },
  })

  return {
    applicants,
    isLoading: query.isLoading,
    isError: query.isError,
    setStatus: (id: string, status: ApplicantStatus) =>
      statusMutation.mutateAsync({ id, status }),
  }
}

/** Single applicant with full profile + application timeline. */
export function useApplicant(id: string | undefined) {
  const query = useQuery({
    queryKey: applicantKeys.detail(id ?? ''),
    queryFn: () => getApplicant(id!),
    enabled: Boolean(id),
  })

  const application = query.data
  const name = application?.candidateName || 'Candidate'
  const profile = application?.candidateProfile

  return {
    application,
    name,
    avatarUrl: profile?.avatarUrl || dicebear(name),
    headline: profile?.headline,
    bio: profile?.bio,
    city: profile?.city,
    skills: profile?.skills ?? [],
    experienceYears: profile?.experienceYears ?? 0,
    resumeUrl: profile?.resumeUrl || application?.resumeUrl,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
