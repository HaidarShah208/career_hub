import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowLeft, Briefcase, Eye, Sparkles, Users } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { StatCard } from '@/shared/components/common/StatCard'
import { formatLimit, useBillingOverview } from '@/features/billing/hooks/useBilling'
import { ROUTES } from '@/shared/constants'
import { cn, formatPKR } from '@/shared/lib/utils'
import type { BillingUsage } from '@/features/billing/api/billing.api'

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
}

function limitTotal(used: number, remaining: number | null): number | null {
  if (remaining === null) return null
  return used + remaining
}

function usagePercent(used: number, remaining: number | null): number {
  const total = limitTotal(used, remaining)
  if (!total || total <= 0) return used > 0 ? 100 : 0
  return Math.min(100, Math.round((used / total) * 100))
}

function usageStatValue(used: number, limit: number | null | undefined): string {
  if (limit === null || limit === undefined) return `${used} / ∞`
  return `${used} / ${limit}`
}

function buildCompareData(usage: BillingUsage) {
  const metrics = [
    { key: 'Jobs', used: usage.jobsUsed, remaining: usage.jobsRemaining },
    { key: 'Applications', used: usage.applicationsUsed, remaining: usage.applicationsRemaining },
    { key: 'Featured', used: usage.featuredJobsUsed, remaining: usage.featuredJobsRemaining },
    { key: 'Resume views', used: usage.resumeViewsUsed, remaining: usage.resumeViewsRemaining },
  ]

  return metrics
    .filter((m) => m.remaining !== null)
    .map((m) => ({
      name: m.key,
      used: m.used,
      remaining: m.remaining ?? 0,
    }))
}

function UsageDonut({
  title,
  used,
  remaining,
  icon: Icon,
}: {
  title: string
  used: number
  remaining: number | null
  icon: typeof Briefcase
}) {
  const total = limitTotal(used, remaining)
  const pct = usagePercent(used, remaining)
  const unlimited = remaining === null

  const pieData = unlimited
    ? [{ name: 'Used', value: Math.max(used, 1) }]
    : [
        { name: 'Used', value: used },
        { name: 'Remaining', value: Math.max(remaining, 0) },
      ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div className="relative h-[180px] w-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={unlimited ? 0 : 2}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="hsl(var(--primary))" />
                  {!unlimited && <Cell fill="hsl(var(--muted))" />}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{unlimited ? used : `${pct}%`}</span>
              <span className="text-xs text-muted-foreground">{unlimited ? 'used' : 'used'}</span>
            </div>
          </div>
          <div className="flex-1 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Used</span>
              <span className="font-medium">{used}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Limit</span>
              <span className="font-medium">{unlimited ? 'Unlimited' : total}</span>
            </div>
            {!unlimited && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium">{remaining}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function BillingUsagePage() {
  const { overview, isLoading } = useBillingOverview()

  if (isLoading) return <PageLoader />

  const subscription = overview?.subscription
  const usage = overview?.usage
  const plan = subscription?.plan
  const isActive = subscription?.status === 'ACTIVE'
  const compareData = usage ? buildCompareData(usage) : []

  return (
    <div className="space-y-8">
      <PageHeader
        title="Plan usage"
        description="Track how much of your current plan you have used this billing period."
        actions={
          <Button asChild variant="outline">
            <Link to={ROUTES.employerBilling}>
              <ArrowLeft className="h-4 w-4" /> Plans & pricing
            </Link>
          </Button>
        }
      />

      {plan ? (
        <div className="rounded-2xl border border-primary bg-primary p-6 text-primary-foreground shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary-foreground/80">Current plan</p>
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-primary-foreground/85">
                {formatPKR(plan.price)}
                <span className="text-sm">/mo</span>
                {subscription?.endDate && isActive && (
                  <span className="ml-3 text-sm">
                    · Renews {new Date(subscription.endDate).toLocaleDateString()}
                  </span>
                )}
                {!subscription?.endDate && isActive && (
                  <span className="ml-3 text-sm">· No expiry</span>
                )}
              </p>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <span>{formatLimit(plan.jobLimit)} active jobs</span>
                <span>{formatLimit(plan.resumeViews)} resume views</span>
                <span>{formatLimit(plan.applicationLimit)} applications</span>
                <span>{formatLimit(plan.featuredJobsLimit)} featured jobs</span>
                <span>{formatLimit(plan.recruiterSeats)} recruiters</span>
              </div>
            </div>
            <Badge
              className={cn(
                'w-fit border-0',
                isActive ? 'bg-primary-foreground text-primary' : 'bg-primary-foreground/20 text-primary-foreground',
              )}
            >
              {subscription?.status ?? '—'}
            </Badge>
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-muted-foreground">No active plan yet.</p>
            <Button asChild>
              <Link to={ROUTES.employerBilling}>Choose a plan</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {usage ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Active jobs"
              value={usageStatValue(usage.jobsUsed, plan?.jobLimit)}
              hint={usage.jobsRemaining !== null ? `${usage.jobsRemaining} remaining` : 'Unlimited plan'}
              icon={Briefcase}
              accent="primary"
            />
            <StatCard
              label="Applications"
              value={usageStatValue(usage.applicationsUsed, plan?.applicationLimit)}
              hint={
                usage.applicationsRemaining !== null
                  ? `${usage.applicationsRemaining} remaining`
                  : 'Unlimited plan'
              }
              icon={Users}
              accent="info"
            />
            <StatCard
              label="Featured jobs"
              value={usageStatValue(usage.featuredJobsUsed, plan?.featuredJobsLimit)}
              hint={
                usage.featuredJobsRemaining !== null
                  ? `${usage.featuredJobsRemaining} remaining`
                  : 'Unlimited plan'
              }
              icon={Sparkles}
              accent="warning"
            />
            <StatCard
              label="Resume views"
              value={usageStatValue(usage.resumeViewsUsed, plan?.resumeViews)}
              hint={
                usage.resumeViewsRemaining !== null
                  ? `${usage.resumeViewsRemaining} remaining`
                  : 'Unlimited plan'
              }
              icon={Eye}
              accent="success"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <UsageDonut title="Active jobs" used={usage.jobsUsed} remaining={usage.jobsRemaining} icon={Briefcase} />
            <UsageDonut
              title="Applications received"
              used={usage.applicationsUsed}
              remaining={usage.applicationsRemaining}
              icon={Users}
            />
            <UsageDonut
              title="Featured jobs"
              used={usage.featuredJobsUsed}
              remaining={usage.featuredJobsRemaining}
              icon={Sparkles}
            />
            <UsageDonut
              title="Resume views"
              used={usage.resumeViewsUsed}
              remaining={usage.resumeViewsRemaining}
              icon={Eye}
            />
          </div>

          {compareData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Usage comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={compareData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                    <XAxis dataKey="name" className="text-xs" tickLine={false} axisLine={false} />
                    <YAxis className="text-xs" tickLine={false} axisLine={false} width={32} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="used" name="Used" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="remaining" name="Remaining" fill="hsl(var(--muted))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Activate a plan to see usage charts and limits.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
