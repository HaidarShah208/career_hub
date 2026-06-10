import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Briefcase, CheckCircle2, TrendingUp, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { StatCard } from '@/shared/components/common/StatCard'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { useEmployerAnalytics, useEmployerDashboard } from '../hooks/useEmployerCompany'

const COLORS = ['hsl(var(--primary))', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981']

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
}

function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[220px] items-center justify-center text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}

export default function EmployerAnalyticsPage() {
  const { dashboard } = useEmployerDashboard()
  const { analytics, isLoading } = useEmployerAnalytics()

  const weekData = analytics?.applicationsByWeek ?? []
  const statusData = analytics?.applicantsByStatus ?? []
  const jobData = analytics?.jobPerformance ?? []

  const hasWeekData = weekData.some((d) => d.applications > 0)
  const hasStatusData = statusData.length > 0
  const hasJobData = jobData.length > 0

  if (isLoading) return <PageLoader />

  return (
    <div>
      <PageHeader title="Analytics" description="Insights into your job postings and hiring funnel." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Jobs" value={dashboard?.totalJobs ?? 0} icon={Briefcase} accent="info" />
        <StatCard label="Active Jobs" value={dashboard?.activeJobs ?? 0} icon={TrendingUp} accent="primary" />
        <StatCard label="Total Applicants" value={dashboard?.totalApplicants ?? 0} icon={Users} accent="success" />
        <StatCard label="Hired" value={dashboard?.hiredCandidates ?? 0} icon={CheckCircle2} accent="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Applications trend</CardTitle>
          </CardHeader>
          <CardContent>
            {hasWeekData ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={weekData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="week" className="text-xs" tickLine={false} axisLine={false} />
                  <YAxis className="text-xs" tickLine={false} axisLine={false} width={32} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmpty message="No applications in the last 6 weeks" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Applicant pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {hasStatusData ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmpty message="No applicants yet" />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Job performance</CardTitle>
          </CardHeader>
          <CardContent>
            {hasJobData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="job" className="text-xs" tickLine={false} axisLine={false} />
                  <YAxis className="text-xs" tickLine={false} axisLine={false} width={40} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number, name: string) => {
                      if (name === 'views' && value === 0) return ['Not visited', 'Views']
                      return [value, name === 'views' ? 'Views' : 'Applies']
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="views" name="Views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="applies" name="Applies" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmpty message="Post a job to see performance data" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
