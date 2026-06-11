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

function applicationsLabel(limit: number | null | undefined): string {
  if (limit === null || limit === undefined) return 'Unlimited Applications'
  return `${formatLimit(limit)} Applications`
}

function featuredJobsLabel(limit: number | null | undefined): string {
  if (limit === null || limit === undefined) return 'Unlimited Featured Jobs'
  if (limit === 0) return 'No Featured Jobs'
  return `${formatLimit(limit)} Featured Jobs`
}

/** Always returns exactly 5 feature lines for consistent plan cards. */
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

  return [
    `${formatLimit(plan.jobLimit)} Active Jobs`,
    recruiterLabel(plan.recruiterSeats),
    `${formatLimit(plan.resumeViews)} Resume Views`,
    applicationsLabel(plan.applicationLimit),
    plan.prioritySupport ? 'Priority Support' : featuredJobsLabel(plan.featuredJobsLimit),
  ]
}

export function isFreePlan(plan: Plan): boolean {
  return plan.price <= 0 || plan.slug === 'free'
}
