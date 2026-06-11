import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  activateFreePlan,
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

  const freePlan = useMutation({
    mutationFn: activateFreePlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: billingKeys.overview }),
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
    activateFreePlan: freePlan.mutateAsync,
    submitManualPayment: manualPayment.mutateAsync,
    startStripeCheckout: stripeCheckout.mutateAsync,
    scheduleDowngrade: downgrade.mutateAsync,
    isSubmitting: freePlan.isPending || manualPayment.isPending || stripeCheckout.isPending,
  }
}

export function formatLimit(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'Unlimited'
  return String(value)
}

function recruiterLabel(count: number | null | undefined): string {
  const n = formatLimit(count)
  return n === '1' ? '1 Recruiter' : `${n} Recruiters`
}

export function planFeatures(plan: Plan): string[] {
  if (plan.slug === 'free') {
    return [
      `${formatLimit(plan.jobLimit)} Active Jobs`,
      recruiterLabel(plan.recruiterSeats),
      `${formatLimit(plan.resumeViews)} Resume Views`,
      'Basic Company Profile',
      'No Featured Jobs',
    ]
  }

  const features: string[] = []
  features.push(`${formatLimit(plan.jobLimit)} Active Jobs`)
  features.push(recruiterLabel(plan.recruiterSeats))
  features.push(`${formatLimit(plan.resumeViews)} Resume Views`)
  if (plan.applicationLimit) {
    features.push(`${formatLimit(plan.applicationLimit)} Applications`)
  }
  if (plan.featuredJobsLimit) {
    features.push(`${formatLimit(plan.featuredJobsLimit)} Featured Jobs`)
  } else if (plan.featuredJobsLimit === 0) {
    features.push('No Featured Jobs')
  }
  if (plan.prioritySupport) features.push('Priority Support')
  return features
}

export function isFreePlan(plan: Plan): boolean {
  return plan.price <= 0 || plan.slug === 'free'
}
