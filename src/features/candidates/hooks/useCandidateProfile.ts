import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/app/store/auth.store'
import { getCandidateProfile } from '../api/candidate.api'

export const candidateProfileKeys = {
  profile: ['candidate', 'profile'] as const,
}

/** The signed-in candidate's profile (avatar / resume / details). */
export function useCandidateProfile() {
  const queryClient = useQueryClient()
  const isCandidate = useAuthStore((s) => s.user?.role === 'candidate')

  const query = useQuery({
    queryKey: candidateProfileKeys.profile,
    queryFn: getCandidateProfile,
    enabled: isCandidate,
  })

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    refetch: () => queryClient.invalidateQueries({ queryKey: candidateProfileKeys.profile }),
  }
}
