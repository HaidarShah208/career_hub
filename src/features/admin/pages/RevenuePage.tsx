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
import { formatPKR } from '@/shared/lib/utils'

const REVENUE = [
  { month: 'Jan', revenue: 2800000 },
  { month: 'Feb', revenue: 3100000 },
  { month: 'Mar', revenue: 2950000 },
  { month: 'Apr', revenue: 3600000 },
  { month: 'May', revenue: 3900000 },
  { month: 'Jun', revenue: 4200000 },
]

const TRANSACTIONS = [
  { id: 't1', company: 'Systems Limited', plan: 'Enterprise', amount: 150000, status: 'paid' },
  { id: 't2', company: '10Pearls Pakistan', plan: 'Premium', amount: 75000, status: 'paid' },
  { id: 't3', company: 'Bazaar Technologies', plan: 'Premium', amount: 75000, status: 'pending' },
  { id: 't4', company: 'Daraz Pakistan', plan: 'Enterprise', amount: 150000, status: 'paid' },
  { id: 't5', company: 'Careem', plan: 'Standard', amount: 35000, status: 'paid' },
]

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
}

export default function RevenuePage() {
  return (
    <div>
      <PageHeader title="Revenue" description="Track subscription revenue and transactions." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue (YTD)" value="Rs 20.5M" icon={DollarSign} accent="primary" trend={18} />
        <StatCard label="This Month" value="Rs 4.2M" icon={TrendingUp} accent="success" trend={8} />
        <StatCard label="Active Subscriptions" value={328} icon={CreditCard} accent="info" trend={5} />
        <StatCard label="Pending Invoices" value="Rs 320k" icon={Receipt} accent="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={REVENUE}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="month" className="text-xs" tickLine={false} axisLine={false} />
                <YAxis
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  width={50}
                  tickFormatter={v => `${v / 1000000}M`}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatPKR(v)} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent transactions</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {TRANSACTIONS.map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{tx.company}</p>
                  <p className="text-xs text-muted-foreground">{tx.plan} plan</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatPKR(tx.amount)}</p>
                  <Badge variant={tx.status === 'paid' ? 'success' : 'soft-warning'} className="capitalize">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
