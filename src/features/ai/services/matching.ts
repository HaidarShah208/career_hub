import type { Job } from '@/features/jobs/types'

export interface CandidateProfile {
  skills: string[]
  preferredCity: string
  preferredCategory: string
  experienceLevel: Job['experienceLevel']
}

export interface JobMatch {
  job: Job
  score: number
  reasons: string[]
}

const EXPERIENCE_ORDER: Job['experienceLevel'][] = ['entry', 'junior', 'mid', 'senior', 'lead', 'executive']

/**
 * Deterministic, explainable job-matching score (0-100).
 * Weights: skills 55%, category 20%, location 15%, experience proximity 10%.
 */
export function scoreJob(profile: CandidateProfile, job: Job): JobMatch {
  const reasons: string[] = []

  const candidateSkills = profile.skills.map(s => s.toLowerCase())
  const jobSkills = job.skills.map(s => s.toLowerCase())
  const matchedSkills = jobSkills.filter(s => candidateSkills.includes(s))
  const skillRatio = jobSkills.length ? matchedSkills.length / jobSkills.length : 0
  const skillScore = skillRatio * 55
  if (matchedSkills.length) {
    reasons.push(`${matchedSkills.length} matching skill${matchedSkills.length > 1 ? 's' : ''}`)
  }

  const categoryScore = profile.preferredCategory && job.category === profile.preferredCategory ? 20 : 0
  if (categoryScore) reasons.push('Matches your preferred field')

  const locationScore =
    !profile.preferredCity || job.city === profile.preferredCity || job.workMode === 'remote' ? 15 : 4
  if (job.workMode === 'remote') reasons.push('Remote-friendly')
  else if (profile.preferredCity && job.city === profile.preferredCity) reasons.push(`Located in ${job.city}`)

  const candidateExp = EXPERIENCE_ORDER.indexOf(profile.experienceLevel)
  const jobExp = EXPERIENCE_ORDER.indexOf(job.experienceLevel)
  const expDistance = Math.abs(candidateExp - jobExp)
  const expScore = Math.max(0, 10 - expDistance * 4)
  if (expDistance === 0) reasons.push('Experience level fits perfectly')

  const score = Math.round(Math.min(100, skillScore + categoryScore + locationScore + expScore))
  return { job, score, reasons }
}

/**
 * Ranks the provided jobs against the candidate profile. The job list is
 * supplied by the caller (fetched from the real API) so this stays pure.
 */
export function getRecommendations(
  profile: CandidateProfile,
  jobs: Job[],
  limit = 12,
): JobMatch[] {
  return jobs
    .map((job) => scoreJob(profile, job))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export const DEMO_PROFILE: CandidateProfile = {
  skills: ['React', 'TypeScript', 'Node.js', 'JavaScript', 'Tailwind CSS', 'REST APIs', 'Git'],
  preferredCity: 'Lahore',
  preferredCategory: 'software',
  experienceLevel: 'mid',
}
