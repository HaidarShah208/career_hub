import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  fetchAdminAnalytics,
  fetchAdminRevenue,
  fetchAdminUsers,
  fetchPendingEmployers,
  updateAdminUserStatus,
  verifyEmployerCompany,
} from '../api/admin.api'

export const adminKeys = {
  users: (search: string, role: string) => ['admin', 'users', search, role] as const,
  pendingEmployers: ['admin', 'employers', 'pending'] as const,
  analytics: ['admin', 'analytics'] as const,
  revenue: ['admin', 'revenue'] as const,
}

export function useAdminUsers(search = '', role = 'all') {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: adminKeys.users(search, role),
    queryFn: () =>
      fetchAdminUsers(1, 100, {
        ...(search ? { search } : {}),
        ...(role !== 'all' ? { role: role.toUpperCase() } : {}),
      }),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateAdminUserStatus(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })

  return {
    users: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    toggleStatus: (id: string, isActive: boolean) => statusMutation.mutateAsync({ id, isActive }),
  }
}

export function usePendingEmployers() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: adminKeys.pendingEmployers,
    queryFn: fetchPendingEmployers,
  })

  const verifyMutation = useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      verifyEmployerCompany(id, verified),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.pendingEmployers }),
  })

  return {
    pending: query.data ?? [],
    isLoading: query.isLoading,
    resolve: (id: string, approved: boolean) => verifyMutation.mutateAsync({ id, verified: approved }),
    isResolving: verifyMutation.isPending,
  }
}

export function useAdminAnalytics() {
  const query = useQuery({
    queryKey: adminKeys.analytics,
    queryFn: fetchAdminAnalytics,
    refetchOnWindowFocus: true,
  })
  return { analytics: query.data ?? null, isLoading: query.isLoading, isError: query.isError }
}

export function useAdminRevenue() {
  const query = useQuery({
    queryKey: adminKeys.revenue,
    queryFn: fetchAdminRevenue,
    refetchOnWindowFocus: true,
  })
  return { revenue: query.data ?? null, isLoading: query.isLoading, isError: query.isError }
}
