import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Check, MapPin, Search, Star, X } from 'lucide-react'

import { Badge, type BadgeProps } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { useToast } from '@/shared/components/ui/toast'
import { useApplicants, type ApplicantStatus } from '../hooks/useApplicants'
import { ROUTES } from '@/shared/constants'
import { timeAgo } from '@/shared/lib/utils'

const STATUS_VARIANT: Record<ApplicantStatus, BadgeProps['variant']> = {
  new: 'soft-info',
  shortlisted: 'success',
  interview: 'soft',
  rejected: 'soft-destructive',
  hired: 'default',
}

const TABS: { value: 'all' | ApplicantStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
]

export default function ApplicantsPage() {
  const { toast } = useToast()
  const { applicants, isLoading, setStatus } = useApplicants()
  const [tab, setTab] = useState<'all' | ApplicantStatus>('all')
  const [query, setQuery] = useState('')

  async function changeStatus(id: string, status: ApplicantStatus, name: string) {
    try {
      await setStatus(id, status)
      toast({ title: `${name} marked ${status}`, variant: 'success' })
    } catch (err) {
      toast({
        title: 'Could not update status',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  const filtered = useMemo(
    () =>
      applicants
        .filter(a => (tab === 'all' ? true : a.status === tab))
        .filter(a =>
          query ? `${a.name} ${a.headline} ${a.jobTitle}`.toLowerCase().includes(query.toLowerCase()) : true,
        ),
    [applicants, tab, query],
  )

  return (
    <div>
      <PageHeader title="Applicants" description="Review, shortlist, and manage candidates." />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={v => setTab(v as typeof tab)}>
          <TabsList className="flex h-auto flex-wrap justify-start gap-1">
            {TABS.map(t => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="sm:w-64">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search applicants"
            leftIcon={<Search />}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading applicants…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No applicants yet. They’ll appear here once candidates apply to your jobs.
        </div>
      ) : (
      <div className="space-y-3">
        {filtered.map(applicant => (
          <Card key={applicant.id}>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <img src={applicant.avatarUrl} alt="" className="h-12 w-12 shrink-0 rounded-full border border-border" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={ROUTES.employerApplicantDetail(applicant.id)}
                    className="font-semibold hover:text-primary hover:underline"
                  >
                    {applicant.name}
                  </Link>
                  <Badge variant={STATUS_VARIANT[applicant.status]} className="capitalize">
                    {applicant.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{applicant.headline}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {applicant.city}
                  </span>
                  <span>{applicant.experienceYears} yrs experience</span>
                  <span>Applied {timeAgo(applicant.appliedAt)} for {applicant.jobTitle}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {applicant.skills.map(skill => (
                    <Badge key={skill} variant="outline" className="font-normal">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="flex items-center gap-1 text-lg font-bold text-primary">
                    <Star className="h-4 w-4 fill-primary" /> {applicant.matchScore}%
                  </p>
                  <p className="text-[10px] text-muted-foreground">match</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="default" size="sm">
                    <Link to={ROUTES.employerApplicantDetail(applicant.id)}>View profile</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changeStatus(applicant.id, 'shortlisted', applicant.name)}
                  >
                    <Check className="h-3.5 w-3.5" /> Shortlist
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changeStatus(applicant.id, 'interview', applicant.name)}
                  >
                    Interview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changeStatus(applicant.id, 'hired', applicant.name)}
                  >
                    Hire
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => changeStatus(applicant.id, 'rejected', applicant.name)}
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  )
}
