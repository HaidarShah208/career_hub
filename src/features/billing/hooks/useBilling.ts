import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createStripeCheckout,
  fetchBillingOverview,
  fetchPlans,
  scheduleDowngrade,
  submitManualPayment,
  type BillingOverview,
  type Plan,
} from '../api/billing.api'

export const billingKeys = {
  plans: ['billing', 'plans'] as const,
  overview: ['billing', 'overview'] as const,
}

export function usePlans() {
  const query = useQuery({
    queryKey: billingKeys.plans,
    queryFn: fetchPlans,
  })
  return { plans: query.data ?? [], isLoading: query.isLoading }
}

export function useBillingOverview() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: billingKeys.overview,
    queryFn: fetchBillingOverview,
  })

  const manualPayment = useMutation({
    mutationFn: submitManualPayment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: billingKeys.overview }),
  })

  const stripeCheckout = useMutation({
    mutationFn: createStripeCheckout,
  })

  const downgrade = useMutation({
    mutationFn: scheduleDowngrade,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: billingKeys.overview }),
  })

  return {
    overview: query.data as BillingOverview | undefined,
    isLoading: query.isLoading,
    submitManualPayment: manualPayment.mutateAsync,
    startStripeCheckout: stripeCheckout.mutateAsync,
    scheduleDowngrade: downgrade.mutateAsync,
    isSubmitting: manualPayment.isPending || stripeCheckout.isPending,
  }
}

export function formatLimit(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'Unlimited'
  return String(value)
}

export function planFeatures(plan: Plan): string[] {
  const features: string[] = []
  features.push(`${formatLimit(plan.jobLimit)} Active Jobs`)
  features.push(`${formatLimit(plan.applicationLimit)} Applications`)
  features.push(`${formatLimit(plan.recruiterSeats)} Recruiters`)
  features.push(`${formatLimit(plan.resumeViews)} Resume Views`)
  if (plan.featuredJobsLimit) {
    features.push(`${formatLimit(plan.featuredJobsLimit)} Featured Jobs`)
  }
  if (plan.prioritySupport) features.push('Priority Support')
  return features
}
