import http, { unwrap } from '@/shared/services/http'

export interface AdminPlan {
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

export interface AdminPayment {
  id: string
  employerId: string
  amount: number
  currency: string
  paymentMethod: string
  transactionReference?: string | null
  screenshotUrl?: string | null
  status: string
  paidAt?: string | null
  createdAt: string
  plan?: { id: string; name: string } | null
  employer?: { id: string; firstName: string; lastName: string; email: string } | null
}

export async function fetchAdminPlans(): Promise<AdminPlan[]> {
  const res = await http.get('/admin/billing/plans')
  return unwrap<AdminPlan[]>(res)
}

export async function fetchAdminPayments(status?: string): Promise<AdminPayment[]> {
  const res = await http.get('/admin/billing/payments', { params: status ? { status } : {} })
  return unwrap<AdminPayment[]>(res)
}

export async function verifyAdminPayment(id: string, approved: boolean): Promise<void> {
  await http.patch(`/admin/billing/payments/${id}/verify`, { approved })
}
