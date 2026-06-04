import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  closeMyJob,
  createMyJob,
  deleteMyJob,
  getMyJob,
  listMyJobs,
  publishMyJob,
  updateMyJob,
  type EmployerJobInput,
} from '../api/employer.api'
import type { Job } from '@/features/jobs/types'

export type EmployerJobStatus = 'active' | 'closed' | 'draft'

export interface EmployerJob extends Job {
  status: EmployerJobStatus
}

export const employerJobKeys = {
  all: ['employer', 'jobs'] as const,
  detail: (id: string) => ['employer', 'jobs', id] as const,
}

function toEmployerStatus(status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED'): EmployerJobStatus {
  if (status === 'CLOSED') return 'closed'
  if (status === 'DRAFT') return 'draft'
  return 'active'
}

function withStatus(job: Job): EmployerJob {
  return { ...job, status: toEmployerStatus(job.backendStatus) }
}

/** List + lifecycle mutations for the signed-in employer's own jobs. */
export function useEmployerJobs() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: employerJobKeys.all,
    queryFn: () => listMyJobs(),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: employerJobKeys.all })

  const removeMutation = useMutation({ mutationFn: deleteMyJob, onSuccess: invalidate })
  const publishMutation = useMutation({ mutationFn: publishMyJob, onSuccess: invalidate })
  const closeMutation = useMutation({ mutationFn: closeMyJob, onSuccess: invalidate })

  return {
    jobs: (query.data?.jobs ?? []).map(withStatus),
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    removeJob: (id: string) => removeMutation.mutateAsync(id),
    publishJob: (id: string) => publishMutation.mutateAsync(id),
    closeJob: (id: string) => closeMutation.mutateAsync(id),
  }
}

/** Single owned job (for the edit screen). */
export function useEmployerJob(id: string | undefined) {
  const query = useQuery({
    queryKey: employerJobKeys.detail(id ?? ''),
    queryFn: () => getMyJob(id as string),
    enabled: Boolean(id),
  })
  return {
    job: query.data ? withStatus(query.data) : null,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}

/** Create / update mutations used by the post & edit job forms. */
export function useEmployerJobMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: employerJobKeys.all })

  const create = useMutation({
    mutationFn: (input: EmployerJobInput) => createMyJob(input),
    onSuccess: invalidate,
  })
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<EmployerJobInput> }) =>
      updateMyJob(id, input),
    onSuccess: invalidate,
  })

  return {
    createJob: create.mutateAsync,
    updateJob: update.mutateAsync,
    isCreating: create.isPending,
    isUpdating: update.isPending,
  }
}
