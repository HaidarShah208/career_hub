import { create } from 'zustand'

import { MOCK_JOBS, MOCK_COMPANIES } from '@/shared/services/mock-data'
import type { Job } from '@/features/jobs/types'

export type EmployerJobStatus = 'active' | 'paused' | 'closed' | 'draft'

export interface EmployerJob extends Job {
  status: EmployerJobStatus
}

const seedCompany = MOCK_COMPANIES[2]

const seedJobs: EmployerJob[] = MOCK_JOBS.slice(0, 8).map((job, i) => ({
  ...job,
  company: seedCompany,
  companyId: seedCompany.id,
  status: (['active', 'active', 'active', 'paused', 'closed', 'active', 'draft', 'active'] as EmployerJobStatus[])[i],
}))

interface EmployerJobsState {
  jobs: EmployerJob[]
  getById: (id: string) => EmployerJob | undefined
  addJob: (job: Omit<EmployerJob, 'id'>) => string
  updateJob: (id: string, patch: Partial<EmployerJob>) => void
  removeJob: (id: string) => void
  setStatus: (id: string, status: EmployerJobStatus) => void
}

export const useEmployerJobs = create<EmployerJobsState>((set, get) => ({
  jobs: seedJobs,
  getById: id => get().jobs.find(j => j.id === id),
  addJob: job => {
    const id = `emp_job_${Date.now()}`
    set(state => ({ jobs: [{ ...job, id } as EmployerJob, ...state.jobs] }))
    return id
  },
  updateJob: (id, patch) =>
    set(state => ({ jobs: state.jobs.map(j => (j.id === id ? { ...j, ...patch } : j)) })),
  removeJob: id => set(state => ({ jobs: state.jobs.filter(j => j.id !== id) })),
  setStatus: (id, status) =>
    set(state => ({ jobs: state.jobs.map(j => (j.id === id ? { ...j, status } : j)) })),
}))
