import { Briefcase, Building2, FileText, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { StatCard } from '@/shared/components/common/StatCard'
import { useAdminDashboard } from '../hooks/useAdminDashboard'

const JOB_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  CLOSED: 'Closed',
}

const APPLICATION_STATUS_LABELS: Record<string, string> = {
  APPLIED: 'Applied',
  UNDER_REVIEW: 'Under review',
  SHORTLISTED: 'Shortlisted',
  REJECTED: 'Rejected',
  HIRED: 'Hired',
}

function StatusBreakdown({
  title,
  data,
  labels,
}: {
  title: string
  data: Record<string, number>
  labels: Record<string, string>
}) {
  const entries = Object.entries(data)
  const max = Math.max(1, ...entries.map(([, value]) => value))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
        {entries.map(([key, value]) => (
          <div key={key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{labels[key] ?? key}</span>
              <span className="font-medium tabular-nums">{value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function AdminOverviewPage() {
  const { data, isLoading, error } = useAdminDashboard()

  const fmt = (value?: number) => (isLoading ? '—' : (value ?? 0).toLocaleString())

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">Live platform metrics from the backend.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={fmt(data?.users.total)} icon={Users} accent="primary" />
        <StatCard label="Total Jobs" value={fmt(data?.jobs.total)} icon={Briefcase} accent="info" />
        <StatCard label="Companies" value={fmt(data?.companies.total)} icon={Building2} accent="success" />
        <StatCard
          label="Applications"
          value={fmt(data?.applications.total)}
          icon={FileText}
          accent="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StatusBreakdown
          title="Jobs by status"
          data={data?.jobs.byStatus ?? {}}
          labels={JOB_STATUS_LABELS}
        />
        <StatusBreakdown
          title="Applications by status"
          data={data?.applications.byStatus ?? {}}
          labels={APPLICATION_STATUS_LABELS}
        />
      </div>
    </div>
  )
}
