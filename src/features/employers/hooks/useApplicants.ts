import { create } from 'zustand'

import { MOCK_JOBS } from '@/shared/services/mock-data'

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

const NAMES = [
  'Ahmed Raza',
  'Sara Malik',
  'Usman Tariq',
  'Hira Shah',
  'Bilal Aslam',
  'Ayesha Noor',
  'Hamza Sheikh',
  'Zainab Ali',
  'Faisal Khan',
  'Mariam Iqbal',
  'Tahir Mehmood',
  'Nida Hassan',
]
const HEADLINES = [
  'Frontend Engineer',
  'Full Stack Developer',
  'Product Designer',
  'Backend Engineer',
  'DevOps Engineer',
  'QA Engineer',
]
const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad']
const SKILLS = ['React', 'Node.js', 'TypeScript', 'AWS', 'Python', 'Figma', 'Docker', 'PostgreSQL']

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]
}

const seedApplicants: Applicant[] = NAMES.map((name, i) => {
  const job = MOCK_JOBS[i % MOCK_JOBS.length]
  const statuses: ApplicantStatus[] = ['new', 'new', 'shortlisted', 'interview', 'new', 'rejected', 'shortlisted', 'new', 'hired', 'new', 'interview', 'new']
  return {
    id: `applicant_${i}`,
    name,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    headline: pick(HEADLINES, i),
    city: pick(CITIES, i),
    jobId: job.id,
    jobTitle: job.title,
    appliedAt: new Date(Date.now() - i * 86400000).toISOString(),
    matchScore: 60 + ((i * 7) % 39),
    experienceYears: 2 + (i % 8),
    status: statuses[i],
    skills: SKILLS.slice(i % 3, (i % 3) + 4),
  }
})

interface ApplicantsState {
  applicants: Applicant[]
  setStatus: (id: string, status: ApplicantStatus) => void
}

export const useApplicants = create<ApplicantsState>(set => ({
  applicants: seedApplicants,
  setStatus: (id, status) =>
    set(state => ({ applicants: state.applicants.map(a => (a.id === id ? { ...a, status } : a)) })),
}))
