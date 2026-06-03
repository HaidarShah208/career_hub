import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Briefcase, Building2, DollarSign, ShieldCheck, Users } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { StatCard } from '@/shared/components/common/StatCard'
import { PENDING_EMPLOYERS, MODERATION_JOBS } from '../data'
import { timeAgo } from '@/shared/lib/utils'

const GROWTH = [
  { month: 'Jan', users: 4200 },
  { month: 'Feb', users: 5100 },
  { month: 'Mar', users: 6300 },
  { month: 'Apr', users: 7900 },
  { month: 'May', users: 9600 },
  { month: 'Jun', users: 11800 },
]

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
}

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">Platform-wide metrics and pending actions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value="11,842" icon={Users} accent="primary" trend={23} />
        <StatCard label="Active Jobs" value="3,210" icon={Briefcase} accent="info" trend={11} />
        <StatCard label="Companies" value="842" icon={Building2} accent="success" trend={7} />
        <StatCard label="Monthly Revenue" value="Rs 4.2M" icon={DollarSign} accent="warning" trend={18} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={GROWTH}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="month" className="text-xs" tickLine={false} axisLine={false} />
                <YAxis className="text-xs" tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#userGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-warning" /> Pending actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Employer verifications</span>
                <Badge variant="soft-warning">{PENDING_EMPLOYERS.length}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Companies awaiting document review.</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Jobs to moderate</span>
                <Badge variant="soft-warning">{MODERATION_JOBS.filter(j => j.flagReason).length}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Flagged listings needing review.</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent submissions</p>
              {PENDING_EMPLOYERS.slice(0, 3).map(e => (
                <div key={e.id} className="flex items-center gap-2 text-sm">
                  <img src={e.logoUrl} alt="" className="h-7 w-7 rounded border border-border" />
                  <span className="flex-1 truncate">{e.company}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(e.submittedAt)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
