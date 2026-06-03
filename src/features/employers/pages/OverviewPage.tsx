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
import { StatCard } from '@/shared/components/common/StatCard'
import { useEmployerJobs } from '../hooks/useEmployerJobs'
import { useApplicants } from '../hooks/useApplicants'
import { ROUTES } from '@/shared/constants'
import { timeAgo } from '@/shared/lib/utils'

const CHART_DATA = [
  { month: 'Jan', applications: 120, views: 1400 },
  { month: 'Feb', applications: 180, views: 1900 },
  { month: 'Mar', applications: 150, views: 1700 },
  { month: 'Apr', applications: 240, views: 2400 },
  { month: 'May', applications: 310, views: 3100 },
  { month: 'Jun', applications: 280, views: 2900 },
]

export default function EmployerOverviewPage() {
  const { jobs } = useEmployerJobs()
  const { applicants } = useApplicants()

  const activeJobs = jobs.filter(j => j.status === 'active').length
  const shortlisted = applicants.filter(a => a.status === 'shortlisted' || a.status === 'interview').length

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
        <StatCard label="Active Jobs" value={activeJobs} icon={Briefcase} accent="primary" trend={5} />
        <StatCard label="Total Applicants" value={applicants.length} icon={Users} accent="info" trend={18} />
        <StatCard label="Shortlisted" value={shortlisted} icon={UserCheck} accent="success" trend={9} />
        <StatCard label="Job Views" value="12.4k" icon={Eye} accent="warning" trend={-2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Applications & views</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={CHART_DATA}>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent applicants</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to={ROUTES.employerApplicants}>View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {applicants.slice(0, 6).map(applicant => (
              <div key={applicant.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <img src={applicant.avatarUrl} alt="" className="h-9 w-9 rounded-full border border-border" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{applicant.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {applicant.jobTitle} · {timeAgo(applicant.appliedAt)}
                  </p>
                </div>
                <Badge variant={applicant.matchScore >= 80 ? 'success' : 'soft'}>{applicant.matchScore}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
