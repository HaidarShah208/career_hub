import {
  Area,
  AreaChart,
  Cell,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Activity, Eye, FileText, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { StatCard } from '@/shared/components/common/StatCard'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { useAdminAnalytics } from '../hooks/useAdminData'

const COLORS = ['hsl(var(--primary))', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981']

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
}

export default function AdminAnalyticsPage() {
  const { analytics, isLoading } = useAdminAnalytics()

  if (isLoading) return <PageLoader />

  const traffic = analytics?.trafficByDay ?? []
  const roleData = analytics?.usersByRole ?? []
  const categoryData = analytics?.jobsByCategory ?? []
  const hasTraffic = traffic.some((d) => d.signups > 0 || d.applications > 0)

  return (
    <div>
      <PageHeader title="Site Analytics" description="Live platform activity from the database." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={analytics?.totalUsers ?? 0} icon={Users} accent="primary" />
        <StatCard label="Job Page Views" value={analytics?.totalJobViews ?? 0} icon={Eye} accent="info" />
        <StatCard
          label="Sign-ups (7 days)"
          value={analytics?.weeklySignups ?? 0}
          icon={Activity}
          accent="success"
        />
        <StatCard
          label="Applications (7 days)"
          value={analytics?.weeklyApplications ?? 0}
          icon={FileText}
          accent="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sign-ups & applications (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {hasTraffic ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={traffic}>
                  <defs>
                    <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="day" className="text-xs" tickLine={false} axisLine={false} />
                  <YAxis className="text-xs" tickLine={false} axisLine={false} width={40} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="signups"
                    name="Sign-ups"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#signupGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    name="Applications"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                No activity in the last 7 days yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Users by role</CardTitle>
          </CardHeader>
          <CardContent>
            {roleData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                  >
                    {roleData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                No users yet.
              </div>
            )}
          </CardContent>
        </Card>

        {categoryData.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Jobs by category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">{cat.name}</p>
                    <p className="text-xl font-bold tabular-nums">{cat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
