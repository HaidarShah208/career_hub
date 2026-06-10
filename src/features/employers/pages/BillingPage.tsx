import { useState } from 'react'
import { Check, CreditCard, Loader2, ShieldAlert } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { FileUpload } from '@/shared/components/common/FileUpload'
import { useToast } from '@/shared/components/ui/toast'
import { formatPKR } from '@/shared/lib/utils'
import { usePlans, useBillingOverview, planFeatures } from '@/features/billing/hooks/useBilling'
import { uploadPaymentProof } from '@/features/billing/api/billing.api'

type ManualMethod = 'EASYPAISA' | 'JAZZCASH' | 'BANK_TRANSFER'

function UsageBar({ label, used, remaining }: { label: string; used: number; remaining: number | null }) {
  const total = remaining === null ? used : used + remaining
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {used} / {remaining === null ? '∞' : total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function BillingPage() {
  const { toast } = useToast()
  const { plans, isLoading: plansLoading } = usePlans()
  const { overview, isLoading, submitManualPayment, startStripeCheckout, isSubmitting } =
    useBillingOverview()

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<ManualMethod>('EASYPAISA')
  const [transactionRef, setTransactionRef] = useState('')
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  if (isLoading || plansLoading) return <PageLoader />

  const company = overview?.company
  const subscription = overview?.subscription
  const usage = overview?.usage
  const instructions = overview?.paymentInstructions
  const isApproved = company?.employerStatus === 'APPROVED'
  const isActive = subscription?.status === 'ACTIVE'
  const currentPlanId =
    subscription?.status === 'ACTIVE' ? (subscription.plan?.id ?? null) : null
  const pendingPlanId =
    subscription?.status === 'PENDING_PAYMENT' ? (subscription.plan?.id ?? null) : null

  function isCurrentPlan(planId: string) {
    return currentPlanId === planId
  }

  function isPendingPlan(planId: string) {
    return pendingPlanId === planId
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
      <PageHeader
        title="Subscription & Billing"
        description="Manage your plan, track usage, and renew your subscription."
      />

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

      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current subscription</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Plan</p>
              <p className="font-semibold">{subscription.plan?.name ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant={isActive ? 'default' : 'secondary'}>{subscription.status}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Renewal date</p>
              <p className="font-medium">
                {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Auto-renew</p>
              <p className="font-medium">{subscription.autoRenew ? 'On' : 'Off'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {usage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Usage</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <UsageBar label="Jobs" used={usage.jobsUsed} remaining={usage.jobsRemaining} />
            <UsageBar label="Applications" used={usage.applicationsUsed} remaining={usage.applicationsRemaining} />
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Available plans</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const owned = isCurrentPlan(plan.id)
            const pending = isPendingPlan(plan.id)
            const highlighted = owned || pending || selectedPlanId === plan.id

            return (
            <Card
              key={plan.id}
              className={`relative ${plan.isPopular ? 'border-primary shadow-md' : ''} ${highlighted ? 'ring-2 ring-primary' : ''}`}
            >
              
              {plan.isPopular && (
                <Badge className="absolute -top-2 right-4">Popular</Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-2xl font-bold">{formatPKR(plan.price)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  {planFeatures(plan).map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2">
                  <Button
                    disabled={!isApproved || isSubmitting || owned || pending}
                    onClick={() => !owned && !pending && setSelectedPlanId(plan.id)}
                    variant={owned || selectedPlanId === plan.id ? 'default' : 'outline'}
                  >
                    {owned
                      ? 'Selected'
                      : pending
                        ? 'Payment pending'
                        : selectedPlanId === plan.id
                          ? 'Selected'
                          : 'Select plan'}
                  </Button>
                  <Button
                    disabled={!isApproved || isSubmitting || owned || pending}
                    variant="secondary"
                    onClick={() => handleStripe(plan.id)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" /> Pay with Stripe
                  </Button>
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>
      </div>

      {selectedPlanId && isApproved && !isCurrentPlan(selectedPlanId) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Manual payment (Easypaisa / JazzCash / Bank)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethod === 'EASYPAISA' && (
              <p className="text-sm text-muted-foreground">Send payment to Easypaisa: <strong>{instructions?.easypaisa}</strong></p>
            )}
            {paymentMethod === 'JAZZCASH' && (
              <p className="text-sm text-muted-foreground">Send payment to JazzCash: <strong>{instructions?.jazzcash}</strong></p>
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

            <Button onClick={handleManualSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit for verification
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
