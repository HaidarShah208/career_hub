import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Calendar, MapPin } from 'lucide-react'

import { Badge, type BadgeProps } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { useApplications } from '../hooks/useApplications'
import { APPLICATION_STATUSES, ROUTES } from '@/shared/constants'
import { formatDate, formatSalaryRange } from '@/shared/lib/utils'
import type { ApplicationStatus } from '../types'

const STATUS_VARIANT: Record<string, BadgeProps['variant']> = {
  applied: 'soft-info',
  reviewed: 'soft-warning',
  shortlisted: 'success',
  interview: 'soft',
  offered: 'success',
  rejected: 'soft-destructive',
  withdrawn: 'secondary',
}

const TABS: { value: 'all' | ApplicationStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
]

export default function ApplicationsPage() {
  const { applications, withdraw } = useApplications()
  const [tab, setTab] = useState<'all' | ApplicationStatus>('all')

  const filtered = useMemo(
    () => (tab === 'all' ? applications : applications.filter(a => a.status === tab)),
    [applications, tab],
  )

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: applications.length }
    for (const a of applications) map[a.status] = (map[a.status] ?? 0) + 1
    return map
  }, [applications])

  return (
    <div>
      <PageHeader
        title="My Applications"
        description="Track the status of every job you’ve applied to."
      />

      <Tabs value={tab} onValueChange={v => setTab(v as typeof tab)} className="mb-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          {TABS.map(t => (
            <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
              {t.label}
              {counts[t.value] ? (
                <span className="rounded-full bg-muted-foreground/10 px-1.5 text-[10px] font-semibold">
                  {counts[t.value]}
                </span>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications here"
          description="When you apply to jobs, they’ll show up here so you can track them."
          action={
            <Button asChild>
              <Link to={ROUTES.jobs}>Find jobs to apply</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(app => {
            const status = APPLICATION_STATUSES.find(s => s.value === app.status)
            return (
              <Card key={app.id}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <img
                    src={app.job.company.logoUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={ROUTES.jobDetails(app.jobId)} className="font-semibold hover:text-primary">
                        {app.job.title}
                      </Link>
                      <Badge variant={STATUS_VARIANT[app.status] ?? 'secondary'}>{status?.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{app.job.company.name}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {app.job.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" /> {formatSalaryRange(app.job.salaryMin, app.job.salaryMax)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Applied {formatDate(app.appliedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{app.matchScore}%</p>
                      <p className="text-[10px] text-muted-foreground">match</p>
                    </div>
                    {app.status !== 'withdrawn' && app.status !== 'rejected' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => withdraw(app.id)}
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
