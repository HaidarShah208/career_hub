import { Check, X } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { useToast } from '@/shared/components/ui/toast'
import { formatPKR } from '@/shared/lib/utils'
import { useAdminPayments } from '../hooks/useAdminBilling'

export default function PaymentsPage() {
  const { toast } = useToast()
  const { payments, isLoading, verify, isVerifying } = useAdminPayments('PENDING')

  if (isLoading) return <PageLoader />

  return (
    <div>
      <PageHeader
        title="Payment verification"
        description="Review and approve manual Easypaisa, JazzCash, and bank transfer payments."
      />

      {payments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No payments pending verification.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <Card key={p.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{p.plan?.name ?? 'Plan'}</CardTitle>
                <Badge>{p.paymentMethod.replace('_', ' ')}</Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Employer:</span>{' '}
                    {p.employer ? `${p.employer.firstName} ${p.employer.lastName}` : p.employerId}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Amount:</span> {formatPKR(p.amount)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Reference:</span> {p.transactionReference ?? '—'}
                  </p>
                  {p.screenshotUrl && (
                    <a
                      href={p.screenshotUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      View screenshot
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={isVerifying}
                    onClick={async () => {
                      try {
                        await verify(p.id, true)
                        toast({ title: 'Payment approved', variant: 'success' })
                      } catch (err) {
                        toast({
                          title: 'Failed',
                          description: (err as { message?: string })?.message,
                          variant: 'error',
                        })
                      }
                    }}
                  >
                    <Check className="mr-1 h-4 w-4" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isVerifying}
                    onClick={async () => {
                      try {
                        await verify(p.id, false)
                        toast({ title: 'Payment rejected', variant: 'warning' })
                      } catch (err) {
                        toast({
                          title: 'Failed',
                          description: (err as { message?: string })?.message,
                          variant: 'error',
                        })
                      }
                    }}
                  >
                    <X className="mr-1 h-4 w-4" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
