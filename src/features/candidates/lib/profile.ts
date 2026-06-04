import type { Job } from '@/features/jobs/types'
import type { User } from '@/shared/types'
import type { CandidateProfile } from '../api/candidate.api'
import type { CandidateProfile as CandidateProfileMatch } from '@/features/ai/services/matching'

export type ExperienceLevel = Job['experienceLevel']

const LEVEL_TO_YEARS: Record<ExperienceLevel, number> = {
  entry: 0,
  junior: 2,
  mid: 4,
  senior: 6,
  lead: 10,
  executive: 14,
}

/** Maps a UI experience level to a representative number of years. */
export function levelToYears(level: ExperienceLevel): number {
  return LEVEL_TO_YEARS[level] ?? 0
}

/** Maps a stored years-of-experience value back to a UI experience level. */
export function yearsToLevel(years: number): ExperienceLevel {
  if (years < 1) return 'entry'
  if (years < 3) return 'junior'
  if (years < 5) return 'mid'
  if (years < 8) return 'senior'
  if (years < 12) return 'lead'
  return 'executive'
}

export interface ProfileStep {
  label: string
  done: boolean
}

/** Real, data-driven profile completion checklist. */
export function computeProfileSteps(
  profile: CandidateProfile | null,
  user: User | null,
): ProfileStep[] {
  return [
    { label: 'Basic info', done: Boolean(profile?.headline && (profile?.city || user?.city)) },
    { label: 'About / bio', done: Boolean(profile?.bio) },
    { label: 'Skills added', done: (profile?.skills?.length ?? 0) >= 3 },
    { label: 'Experience set', done: (profile?.experienceYears ?? 0) > 0 },
    { label: 'Avatar uploaded', done: Boolean(profile?.avatarUrl) },
    { label: 'Resume uploaded', done: Boolean(profile?.resumeUrl) },
  ]
}

export function profileScore(steps: ProfileStep[]): number {
  if (!steps.length) return 0
  return Math.round((steps.filter((s) => s.done).length / steps.length) * 100)
}

/** Builds the job-matching profile from real candidate data. */
export function toMatchProfile(
  profile: CandidateProfile | null,
  user: User | null,
): CandidateProfileMatch {
  return {
    skills: profile?.skills ?? [],
    preferredCity: profile?.city || user?.city || '',
    preferredCategory: '',
    experienceLevel: yearsToLevel(profile?.experienceYears ?? 0),
  }
}
