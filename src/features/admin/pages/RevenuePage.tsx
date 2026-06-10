import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CreditCard, DollarSign, Receipt, TrendingUp } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { StatCard } from '@/shared/components/common/StatCard'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { formatPKR } from '@/shared/lib/utils'
import { useAdminRevenue } from '../hooks/useAdminData'

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
}

function formatCompactRevenue(amount: number): string {
  if (amount >= 1_000_000) return `Rs ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `Rs ${(amount / 1_000).toFixed(0)}k`
  return formatPKR(amount)
}

export default function RevenuePage() {
  const { revenue, isLoading } = useAdminRevenue()

  if (isLoading) return <PageLoader />

  const chartData = revenue?.revenueByMonth ?? []
  const transactions = revenue?.recentTransactions ?? []
  const hasChartData = chartData.some((d) => d.revenue > 0)

  return (
    <div>
      <PageHeader
        title="Revenue"
        description="Premium job listing revenue (featured & urgent postings)."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue (YTD)"
          value={formatCompactRevenue(revenue?.totalRevenueYtd ?? 0)}
          icon={DollarSign}
          accent="primary"
        />
        <StatCard
          label="This Month"
          value={formatCompactRevenue(revenue?.revenueThisMonth ?? 0)}
          icon={TrendingUp}
          accent="success"
        />
        <StatCard
          label="Active Premium Listings"
          value={revenue?.activePremiumListings ?? 0}
          icon={CreditCard}
          accent="info"
        />
        <StatCard
          label="Pending (draft)"
          value={formatCompactRevenue(revenue?.pendingRevenue ?? 0)}
          icon={Receipt}
          accent="warning"
          hint="Unpublished premium jobs"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {hasChartData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="month" className="text-xs" tickLine={false} axisLine={false} />
                  <YAxis
                    className="text-xs"
                    tickLine={false}
                    axisLine={false}
                    width={50}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatPKR(v)} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                No premium listings yet. Revenue appears when employers purchase featured or urgent job boosts.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent transactions</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {transactions.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No transactions yet.</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{tx.company}</p>
                    <p className="text-xs text-muted-foreground">{tx.plan}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatPKR(tx.amount)}</p>
                    <Badge variant={tx.status === 'paid' ? 'success' : 'soft-warning'} className="capitalize">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
