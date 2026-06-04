import http, { unwrap } from '@/shared/services/http'

export interface CandidateProfile {
  id: string
  headline?: string | null
  bio?: string | null
  skills?: string[] | null
  experienceYears: number
  city?: string | null
  avatarUrl?: string | null
  resumeUrl?: string | null
}

/** GET /candidates/profile — the signed-in candidate's profile. */
export async function getCandidateProfile(): Promise<CandidateProfile> {
  const res = await http.get('/candidates/profile')
  return unwrap<CandidateProfile>(res)
}

export interface UpdateCandidateProfileInput {
  headline?: string
  bio?: string
  skills?: string[]
  experienceYears?: number
  city?: string
}

/** PUT /candidates/profile — persists the backend-supported profile fields. */
export async function updateCandidateProfile(
  input: UpdateCandidateProfileInput,
): Promise<CandidateProfile> {
  const res = await http.put('/candidates/profile', input)
  return unwrap<CandidateProfile>(res)
}
