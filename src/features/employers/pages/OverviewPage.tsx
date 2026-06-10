import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Briefcase, Eye, Plus, Users, UserCheck } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { StatCard } from '@/shared/components/common/StatCard'
import { useEmployerJobs } from '../hooks/useEmployerJobs'
import { useApplicants } from '../hooks/useApplicants'
import { useEmployerAnalytics } from '../hooks/useEmployerCompany'
import { ROUTES } from '@/shared/constants'
import { timeAgo } from '@/shared/lib/utils'

function formatViews(count: number): string | number {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return count
}

function hasApplicationData(data: Array<{ applications: number }>): boolean {
  return data.some((d) => d.applications > 0)
}

export default function EmployerOverviewPage() {
  const { jobs } = useEmployerJobs()
  const { applicants } = useApplicants()
  const { analytics, isLoading } = useEmployerAnalytics()

  const activeJobs = jobs.filter((j) => j.status === 'active').length
  const shortlisted = applicants.filter(
    (a) => a.status === 'shortlisted' || a.status === 'interview',
  ).length
  const chartData = analytics?.applicationsByMonth ?? []
  const totalViews = analytics?.totalJobViews ?? 0
  const recentApplicants = applicants.slice(0, 6)

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employer Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your hiring performance at a glance.</p>
        </div>
        <Button asChild>
          <Link to={ROUTES.employerPostJob}>
            <Plus className="h-4 w-4" /> Post a new job
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Jobs" value={activeJobs} icon={Briefcase} accent="primary" />
        <StatCard label="Total Applicants" value={applicants.length} icon={Users} accent="info" />
        <StatCard label="Shortlisted" value={shortlisted} icon={UserCheck} accent="success" />
        <StatCard
          label="Job Views"
          value={formatViews(totalViews)}
          icon={Eye}
          accent="warning"
          hint={totalViews === 0 ? 'No visits yet' : undefined}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Applications over time</CardTitle>
          </CardHeader>
          <CardContent>
            {hasApplicationData(chartData) ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="month" className="text-xs" tickLine={false} axisLine={false} />
                  <YAxis className="text-xs" tickLine={false} axisLine={false} width={32} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#appGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[280px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <Eye className="mb-2 h-8 w-8 opacity-40" />
                <p>No applications yet</p>
                <p className="mt-1 text-xs">Data appears when candidates apply to your jobs.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent applicants</CardTitle>
            {applicants.length > 0 && (
              <Button asChild variant="ghost" size="sm" className="text-primary">
                <Link to={ROUTES.employerApplicants}>View all</Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {recentApplicants.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <Users className="mb-2 h-8 w-8 opacity-40" />
                <p>No applicants yet</p>
                <p className="mt-1 text-xs">New applications will show up here.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentApplicants.map((applicant) => (
                  <div key={applicant.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <img
                      src={applicant.avatarUrl}
                      alt=""
                      className="h-9 w-9 rounded-full border border-border"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{applicant.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {applicant.jobTitle} · {timeAgo(applicant.appliedAt)}
                      </p>
                    </div>
                    {applicant.matchScore > 0 && (
                      <Badge variant={applicant.matchScore >= 80 ? 'success' : 'soft'}>
                        {applicant.matchScore}%
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
