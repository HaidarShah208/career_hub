import http, { unwrap } from '@/shared/services/http'

export interface Plan {
  id: string
  name: string
  slug: string
  description?: string | null
  price: number
  currency: string
  billingCycle: string
  jobLimit?: number | null
  applicationLimit?: number | null
  featuredJobsLimit?: number | null
  recruiterSeats?: number | null
  resumeViews?: number | null
  prioritySupport: boolean
  isPopular: boolean
  isActive: boolean
}

export interface BillingUsage {
  jobsUsed: number
  jobsRemaining: number | null
  applicationsUsed: number
  applicationsRemaining: number | null
  featuredJobsUsed: number
  featuredJobsRemaining: number | null
  resumeViewsUsed: number
  resumeViewsRemaining: number | null
}

export interface BillingOverview {
  company: {
    id: string
    name: string
    employerStatus: string
    isVerified: boolean
    verificationDocuments: string[]
  }
  subscription: {
    id: string
    status: string
    startDate?: string | null
    endDate?: string | null
    autoRenew: boolean
    pendingPlanId?: string | null
    plan: {
      id: string
      name: string
      slug: string
      price: number
      currency: string
      billingCycle: string
      jobLimit?: number | null
      applicationLimit?: number | null
      featuredJobsLimit?: number | null
      recruiterSeats?: number | null
      resumeViews?: number | null
      prioritySupport?: boolean
    } | null
  } | null
  usage: BillingUsage | null
  paymentInstructions: {
    easypaisa: string
    jazzcash: string
    bank: { accountTitle: string; bankName: string; iban: string; accountNumber: string }
  }
}

export async function fetchPlans(): Promise<Plan[]> {
  const res = await http.get('/plans')
  return unwrap<Plan[]>(res)
}

export async function fetchBillingOverview(): Promise<BillingOverview> {
  const res = await http.get('/employer/billing/overview')
  return unwrap<BillingOverview>(res)
}

export async function activateFreePlan(): Promise<void> {
  await http.post('/employer/billing/activate-free')
}

export async function submitManualPayment(input: {
  planId: string
  paymentMethod: 'EASYPAISA' | 'JAZZCASH' | 'BANK_TRANSFER'
  transactionReference: string
  screenshotUrl?: string
}): Promise<void> {
  await http.post('/employer/billing/payments/manual', input)
}

export async function createStripeCheckout(input: {
  planId: string
  successUrl: string
  cancelUrl: string
}): Promise<{ url: string | null; sessionId: string }> {
  const res = await http.post('/employer/billing/checkout/stripe', input)
  return unwrap(res)
}

export async function scheduleDowngrade(planId: string): Promise<void> {
  await http.post('/employer/billing/downgrade', { planId })
}

export async function uploadPaymentProof(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await http.post('/uploads/payment-proof', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return unwrap<{ screenshotUrl: string }>(res).screenshotUrl
}
