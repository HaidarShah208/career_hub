import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { listApplicants, updateApplicantStatus } from '../api/employer.api'
import type { BackendApplicationStatus, DomainApplicationStatus } from '@/shared/types/domain'

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

  const applicants: Applicant[] = (query.data?.applicants ?? []).map((a) => {
    const name = a.candidateName || 'Candidate'
    return {
      id: a.id,
      name,
      avatarUrl: dicebear(name),
      headline: a.job.title,
      city: a.job.city || '',
      jobId: a.jobId,
      jobTitle: a.job.title,
      appliedAt: a.appliedAt,
      matchScore: a.matchScore,
      experienceYears: 0,
      status: DOMAIN_TO_APPLICANT[a.status] ?? 'new',
      skills: [],
    }
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicantStatus }) =>
      updateApplicantStatus(id, APPLICANT_TO_BACKEND[status]),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicantKeys.all }),
  })

  return {
    applicants,
    isLoading: query.isLoading,
    isError: query.isError,
    setStatus: (id: string, status: ApplicantStatus) =>
      statusMutation.mutateAsync({ id, status }),
  }
}
