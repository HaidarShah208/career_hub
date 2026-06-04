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
import { useEmployerDashboard } from '../hooks/useEmployerCompany'

const APPLICATIONS_TREND = [
  { week: 'W1', applications: 32 },
  { week: 'W2', applications: 48 },
  { week: 'W3', applications: 41 },
  { week: 'W4', applications: 67 },
  { week: 'W5', applications: 73 },
  { week: 'W6', applications: 89 },
]

const SOURCE_DATA = [
  { name: 'Search', value: 42 },
  { name: 'Recommended', value: 28 },
  { name: 'Direct', value: 18 },
  { name: 'Referral', value: 12 },
]

const JOB_PERFORMANCE = [
  { job: 'React Dev', views: 1200, applies: 86 },
  { job: 'Backend', views: 980, applies: 64 },
  { job: 'Designer', views: 750, applies: 41 },
  { job: 'PM', views: 640, applies: 33 },
  { job: 'QA', views: 510, applies: 22 },
]

const COLORS = ['hsl(var(--primary))', '#3b82f6', '#f59e0b', '#8b5cf6']

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
}

export default function EmployerAnalyticsPage() {
  const { dashboard } = useEmployerDashboard()

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
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={APPLICATIONS_TREND}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="week" className="text-xs" tickLine={false} axisLine={false} />
                <YAxis className="text-xs" tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="applications" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Applicant sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={SOURCE_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                  {SOURCE_DATA.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Job performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={JOB_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="job" className="text-xs" tickLine={false} axisLine={false} />
                <YAxis className="text-xs" tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="applies" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
