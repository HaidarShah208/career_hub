import { useMemo } from 'react'

import { useAuthStore } from '@/app/store/auth.store'
import { useCandidateProfile } from './useCandidateProfile'
import { toMatchProfile } from '../lib/profile'

/** The candidate's real matching profile, derived from their saved profile. */
export function useMatchProfile() {
  const user = useAuthStore((s) => s.user)
  const { profile } = useCandidateProfile()
  return useMemo(() => toMatchProfile(profile, user), [profile, user])
}
