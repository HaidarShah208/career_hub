import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, CreditCard, Loader2, ShieldAlert } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { FileUpload } from '@/shared/components/common/FileUpload'
import { useToast } from '@/shared/components/ui/toast'
import { PlanPricingCard } from '@/features/billing/components/PlanPricingCard'
import { usePlans, useBillingOverview, isFreePlan } from '@/features/billing/hooks/useBilling'
import { uploadPaymentProof } from '@/features/billing/api/billing.api'
import { ROUTES } from '@/shared/constants'
import { cn } from '@/shared/lib/utils'

type ManualMethod = 'EASYPAISA' | 'JAZZCASH' | 'BANK_TRANSFER'
type BillingPeriod = 'monthly' | 'yearly'

export default function BillingPage() {
  const { toast } = useToast()
  const { plans, isLoading: plansLoading } = usePlans()
  const { overview, isLoading, activateFreePlan, submitManualPayment, startStripeCheckout, isSubmitting } =
    useBillingOverview()

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<ManualMethod>('EASYPAISA')
  const [transactionRef, setTransactionRef] = useState('')
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const paymentSectionRef = useRef<HTMLDivElement>(null)

  if (isLoading || plansLoading) return <PageLoader />

  const company = overview?.company
  const subscription = overview?.subscription
  const instructions = overview?.paymentInstructions
  const isApproved = company?.employerStatus === 'APPROVED'
  const currentPlanId =
    subscription?.status === 'ACTIVE' ? (subscription.plan?.id ?? null) : null
  const pendingPlanId =
    subscription?.status === 'PENDING_PAYMENT' ? (subscription.plan?.id ?? null) : null

  const selectedPlan = plans.find((p) => p.id === selectedPlanId)

  function isCurrentPlan(planId: string) {
    return currentPlanId === planId
  }

  function isPendingPlan(planId: string) {
    return pendingPlanId === planId
  }

  function handlePlanSelect(planId: string) {
    const plan = plans.find((p) => p.id === planId)
    setSelectedPlanId(planId)

    if (plan && isApproved && !isCurrentPlan(planId) && !isFreePlan(plan)) {
      window.setTimeout(() => {
        paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    }
  }

  async function handleManualSubmit() {
    if (!selectedPlanId || !transactionRef.trim()) {
      toast({ title: 'Missing details', description: 'Select a plan and enter transaction reference.', variant: 'warning' })
      return
    }
    try {
      await submitManualPayment({
        planId: selectedPlanId,
        paymentMethod,
        transactionReference: transactionRef.trim(),
        screenshotUrl: screenshotUrl ?? undefined,
      })
      toast({ title: 'Payment submitted', description: 'Admin will verify your payment shortly.', variant: 'success' })
      setTransactionRef('')
      setScreenshotUrl(null)
    } catch (err) {
      toast({
        title: 'Submission failed',
        description: (err as { message?: string })?.message ?? 'Try again.',
        variant: 'error',
      })
    }
  }

  async function handleActivateFree() {
    try {
      await activateFreePlan()
      toast({ title: 'Free plan activated', description: 'You can now post jobs on your free plan.', variant: 'success' })
      setSelectedPlanId(null)
    } catch (err) {
      toast({
        title: 'Could not activate free plan',
        description: (err as { message?: string })?.message ?? 'Try again.',
        variant: 'error',
      })
    }
  }

  async function handleStripe(planId: string) {
    const origin = window.location.origin
    try {
      const { url } = await startStripeCheckout({
        planId,
        successUrl: `${origin}/employer/billing?success=1`,
        cancelUrl: `${origin}/employer/billing?cancelled=1`,
      })
      if (url) window.location.href = url
      else toast({ title: 'Stripe unavailable', description: 'Use manual payment instead.', variant: 'warning' })
    } catch (err) {
      toast({
        title: 'Checkout failed',
        description: (err as { message?: string })?.message ?? 'Stripe may not be configured.',
        variant: 'error',
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Plans & pricing</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Choose the plan that fits your hiring needs. Upgrade anytime as your team grows.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={ROUTES.employerBillingUsage}>
            <BarChart3 className="h-4 w-4" /> View plan usage
          </Link>
        </Button>
      </div>

      {!isApproved && (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <ShieldAlert className="mt-0.5 h-5 w-5 text-warning" />
            <div>
              <p className="font-medium">Company verification required</p>
              <p className="text-sm text-muted-foreground">
                Your company status is <Badge variant="outline">{company?.employerStatus ?? 'PENDING'}</Badge>.
                Only approved employers can purchase plans.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="pt-10">
        

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 xl:items-end">
          {plans.map((plan) => {
            const owned = isCurrentPlan(plan.id)
            const pending = isPendingPlan(plan.id)
            const free = isFreePlan(plan)
            const showAsPopular = plan.isPopular && !owned

            return (
              <PlanPricingCard
                key={plan.id}
                plan={plan}
                isCurrent={owned}
                isPending={pending}
                isSelected={selectedPlanId === plan.id}
                isPopular={showAsPopular}
                isFree={free}
                disabled={!isApproved}
                loading={isSubmitting}
                onSelect={() => !owned && !pending && handlePlanSelect(plan.id)}
                onActivateFree={() => void handleActivateFree()}
                onStripe={() => void handleStripe(plan.id)}
              />
            )
          })}
        </div>
      </div>

      {selectedPlan && isApproved && !isCurrentPlan(selectedPlan.id) && !isFreePlan(selectedPlan) && (
        <Card ref={paymentSectionRef} id="manual-payment" className="scroll-mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4" /> Manual payment — {selectedPlan.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethod === 'EASYPAISA' && (
              <p className="text-sm text-muted-foreground">
                Send payment to Easypaisa: <strong>{instructions?.easypaisa}</strong>
              </p>
            )}
            {paymentMethod === 'JAZZCASH' && (
              <p className="text-sm text-muted-foreground">
                Send payment to JazzCash: <strong>{instructions?.jazzcash}</strong>
              </p>
            )}
            {paymentMethod === 'BANK_TRANSFER' && instructions?.bank && (
              <div className="rounded-md border p-3 text-sm">
                <p><strong>{instructions.bank.accountTitle}</strong></p>
                <p>{instructions.bank.bankName}</p>
                <p>IBAN: {instructions.bank.iban}</p>
                <p>Account: {instructions.bank.accountNumber}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {(['EASYPAISA', 'JAZZCASH', 'BANK_TRANSFER'] as ManualMethod[]).map((m) => (
                <Button
                  key={m}
                  size="sm"
                  variant={paymentMethod === m ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod(m)}
                >
                  {m.replace('_', ' ')}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="txRef">Transaction reference</Label>
              <Input
                id="txRef"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="Enter transaction ID or reference"
              />
            </div>

            <FileUpload
              kind="paymentProof"
              currentUrl={screenshotUrl}
              disabled={uploading}
              upload={async (file, onProgress) => {
                setUploading(true)
                try {
                  onProgress(40)
                  const url = await uploadPaymentProof(file)
                  onProgress(100)
                  setScreenshotUrl(url)
                  return url
                } finally {
                  setUploading(false)
                }
              }}
            />

            <Button
              onClick={handleManualSubmit}
              disabled={isSubmitting || uploading || !screenshotUrl || !transactionRef.trim()}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit for verification
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
