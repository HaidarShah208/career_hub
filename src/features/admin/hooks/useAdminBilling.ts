import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  fetchAdminPayments,
  fetchAdminPlans,
  verifyAdminPayment,
  type AdminPayment,
  type AdminPlan,
} from '../api/admin-billing.api'

export const adminBillingKeys = {
  plans: ['admin', 'billing', 'plans'] as const,
  payments: (status?: string) => ['admin', 'billing', 'payments', status] as const,
}

export function useAdminPlans() {
  const query = useQuery({
    queryKey: adminBillingKeys.plans,
    queryFn: fetchAdminPlans,
  })
  return { plans: (query.data ?? []) as AdminPlan[], isLoading: query.isLoading }
}

export function useAdminPayments(status?: string) {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: adminBillingKeys.payments(status),
    queryFn: () => fetchAdminPayments(status),
  })

  const verifyMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) =>
      verifyAdminPayment(id, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'billing', 'payments'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'revenue'] })
    },
  })

  return {
    payments: (query.data ?? []) as AdminPayment[],
    isLoading: query.isLoading,
    verify: (id: string, approved: boolean) => verifyMutation.mutateAsync({ id, approved }),
    isVerifying: verifyMutation.isPending,
  }
}
