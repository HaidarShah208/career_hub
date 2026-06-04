import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/app/store/auth.store'
import { applyToJob, fetchMyApplications } from '../api/applications.api'

export const applicationKeys = {
  mine: ['applications', 'my'] as const,
  detail: (id: string) => ['applications', 'detail', id] as const,
}

/**
 * The current candidate's applications plus the apply mutation. The list query
 * is only enabled for authenticated candidates (the `/applications/my`
 * endpoint requires the CANDIDATE role).
 */
export function useApplications() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const enabled = isAuthenticated && user?.role === 'candidate'

  const query = useQuery({
    queryKey: applicationKeys.mine,
    queryFn: fetchMyApplications,
    enabled,
  })

  const applications = query.data ?? []

  const applyMutation = useMutation({
    mutationFn: (jobId: string) => applyToJob(jobId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationKeys.mine }),
  })

  return {
    applications,
    isLoading: query.isLoading && enabled,
    isError: query.isError,
    hasApplied: (jobId: string) => applications.some((a) => a.jobId === jobId),
    apply: (jobId: string) => applyMutation.mutateAsync(jobId),
    isApplying: applyMutation.isPending,
    /** Withdrawing an application is not supported by the backend yet. */
    withdraw: (_applicationId: string) => undefined,
  }
}
