import { create } from 'zustand'

import { MOCK_APPLICATIONS } from '@/shared/services/mock-data'
import type { Job } from '@/features/jobs/types'
import type { Application, ApplicationStatus } from '../types'

interface ApplicationsState {
  applications: Application[]
  hasApplied: (jobId: string) => boolean
  apply: (job: Job, coverLetter?: string) => void
  withdraw: (applicationId: string) => void
  setStatus: (applicationId: string, status: ApplicationStatus) => void
}

export const useApplications = create<ApplicationsState>((set, get) => ({
  applications: MOCK_APPLICATIONS,

  hasApplied: jobId => get().applications.some(a => a.jobId === jobId && a.status !== 'withdrawn'),

  apply: (job, coverLetter) =>
    set(state => {
      if (state.applications.some(a => a.jobId === job.id && a.status !== 'withdrawn')) {
        return state
      }
      const application: Application = {
        id: `app_${Date.now()}`,
        jobId: job.id,
        job,
        candidateId: 'user_1',
        status: 'applied',
        appliedAt: new Date().toISOString(),
        coverLetter,
        resumeUrl: '/resume.pdf',
        matchScore: Math.floor(60 + Math.random() * 39),
      }
      return { applications: [application, ...state.applications] }
    }),

  withdraw: applicationId =>
    set(state => ({
      applications: state.applications.map(a =>
        a.id === applicationId ? { ...a, status: 'withdrawn' } : a,
      ),
    })),

  setStatus: (applicationId, status) =>
    set(state => ({
      applications: state.applications.map(a =>
        a.id === applicationId ? { ...a, status } : a,
      ),
    })),
}))
