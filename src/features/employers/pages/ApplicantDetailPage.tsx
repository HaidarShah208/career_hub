import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Briefcase,
  Check,
  Download,
  Mail,
  MapPin,
  X,
} from 'lucide-react'

import { Badge, type BadgeProps } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { useToast } from '@/shared/components/ui/toast'
import { ROUTES } from '@/shared/constants'
import { formatDate, timeAgo } from '@/shared/lib/utils'
import { useApplicant, useApplicants, type ApplicantStatus } from '../hooks/useApplicants'

const STATUS_VARIANT: Record<ApplicantStatus, BadgeProps['variant']> = {
  new: 'soft-info',
  shortlisted: 'success',
  interview: 'soft',
  rejected: 'soft-destructive',
  hired: 'default',
}

const DOMAIN_TO_APPLICANT: Record<string, ApplicantStatus> = {
  applied: 'new',
  reviewed: 'new',
  shortlisted: 'shortlisted',
  interview: 'interview',
  offered: 'hired',
  rejected: 'rejected',
  withdrawn: 'rejected',
}

export default function ApplicantDetailPage() {
  const { id } = useParams()
  const { toast } = useToast()
  const { setStatus } = useApplicants()
  const {
    application,
    name,
    avatarUrl,
    headline,
    bio,
    city,
    skills,
    experienceYears,
    resumeUrl,
    isLoading,
    isError,
  } = useApplicant(id)

  if (isLoading) return <PageLoader />

  if (isError || !application) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-xl font-semibold">Applicant not found</h1>
        <Button asChild className="mt-4" variant="outline">
          <Link to={ROUTES.employerApplicants}>
            <ArrowLeft className="h-4 w-4" /> Back to applicants
          </Link>
        </Button>
      </div>
    )
  }

  const status = DOMAIN_TO_APPLICANT[application.status] ?? 'new'

  async function changeStatus(next: ApplicantStatus) {
    try {
      await setStatus(application!.id, next)
      toast({ title: `${name} marked ${next}`, variant: 'success' })
    } catch (err) {
      toast({
        title: 'Could not update status',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
        <Link to={ROUTES.employerApplicants}>
          <ArrowLeft className="h-4 w-4" /> Back to applicants
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
              <img
                src={avatarUrl}
                alt=""
                className="h-20 w-20 shrink-0 rounded-full border border-border object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
                  <Badge variant={STATUS_VARIANT[status]} className="capitalize">
                    {status}
                  </Badge>
                </div>
                {headline && <p className="mt-1 text-muted-foreground">{headline}</p>}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {application.candidateEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" /> {application.candidateEmail}
                    </span>
                  )}
                  {city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {city}
                    </span>
                  )}
                  <span>{experienceYears} yrs experience</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {bio && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{bio}</p>
              </CardContent>
            </Card>
          )}

          {skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {application.timeline && application.timeline.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Application timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {application.timeline.map((entry, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium capitalize">{entry.status}</p>
                      {entry.note && <p className="text-muted-foreground">{entry.note}</p>}
                      <p className="text-xs text-muted-foreground">{formatDate(entry.date)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{application.job.title}</p>
                  <p className="text-muted-foreground">{application.job.company.name}</p>
                </div>
              </div>
              <p className="text-muted-foreground">Applied {timeAgo(application.appliedAt)}</p>
              {resumeUrl && (
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" /> Download resume
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={() => changeStatus('shortlisted')}>
                <Check className="h-4 w-4" /> Shortlist
              </Button>
              <Button variant="outline" size="sm" onClick={() => changeStatus('interview')}>
                Interview
              </Button>
              <Button variant="outline" size="sm" onClick={() => changeStatus('hired')}>
                Hire
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => changeStatus('rejected')}
              >
                <X className="h-4 w-4" /> Reject
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
