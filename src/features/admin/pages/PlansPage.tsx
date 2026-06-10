import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { formatPKR } from '@/shared/lib/utils'
import { useAdminPlans } from '../hooks/useAdminBilling'

export default function PlansPage() {
  const { plans, isLoading } = useAdminPlans()

  if (isLoading) return <PageLoader />

  return (
    <div>
      <PageHeader title="Subscription plans" description="Manage employer subscription tiers and limits." />
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{plan.name}</CardTitle>
              <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-xl font-bold">{formatPKR(plan.price)}<span className="text-muted-foreground">/mo</span></p>
              <p className="text-muted-foreground">{plan.description}</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>Jobs: {plan.jobLimit ?? '∞'}</li>
                <li>Applications: {plan.applicationLimit ?? '∞'}</li>
                <li>Recruiters: {plan.recruiterSeats ?? '∞'}</li>
                <li>Resume views: {plan.resumeViews ?? '∞'}</li>
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
