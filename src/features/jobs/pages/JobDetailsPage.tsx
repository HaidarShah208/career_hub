import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  MapPin,
  Share2,
  Users,
  Wallet,
} from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Textarea } from '@/shared/components/ui/textarea'
import { Separator } from '@/shared/components/ui/separator'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { useToast } from '@/shared/components/ui/toast'
import { JobCard } from '../components/JobCard'
import { useJob } from '../hooks/useJobs'
import { useSavedJobs } from '../hooks/useSavedJobs'
import { useApplications } from '@/features/applications/hooks/useApplications'
import { useAuthStore } from '@/app/store/auth.store'
import {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  ROUTES,
  WORK_MODES,
} from '@/shared/constants'
import { cn, formatSalaryRange, timeAgo, formatDate } from '@/shared/lib/utils'

function label(list: readonly { value: string; label: string }[], value: string) {
  return list.find(i => i.value === value)?.label ?? value
}

export default function JobDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { job, related, isLoading, error } = useJob(id)
  const { isSaved, toggle } = useSavedJobs()
  const { hasApplied, apply } = useApplications()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  const [applyOpen, setApplyOpen] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')

  if (isLoading) return <PageLoader />
  if (error || !job) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Job not found</h1>
        <p className="mt-2 text-muted-foreground">This listing may have expired or been removed.</p>
        <Button asChild className="mt-6">
          <Link to={ROUTES.jobs}>Browse all jobs</Link>
        </Button>
      </div>
    )
  }

  const applied = hasApplied(job.id)
  const saved = isSaved(job.id)
  const isExternal = job.applyMethod === 'external' && Boolean(job.applyUrl)

  function handleApply() {
    // External jobs redirect to the employer's own application page.
    if (isExternal) {
      window.open(job!.applyUrl, '_blank', 'noopener,noreferrer')
      toast({
        title: 'Redirecting to company site',
        description: `Complete your application for ${job!.title} on ${job!.company.name}’s page.`,
        variant: 'info',
      })
      return
    }
    if (!isAuthenticated) {
      toast({ title: 'Please sign in', description: 'You need an account to apply.', variant: 'info' })
      navigate(ROUTES.login, { state: { from: `/jobs/${job!.id}` } })
      return
    }
    setApplyOpen(true)
  }

  function confirmApply() {
    apply(job!, coverLetter)
    setApplyOpen(false)
    setCoverLetter('')
    toast({
      title: 'Application submitted!',
      description: `Your application for ${job!.title} has been sent.`,
      variant: 'success',
    })
  }

  function share() {
    navigator.clipboard?.writeText(window.location.href)
    toast({ title: 'Link copied', description: 'Job link copied to clipboard.', variant: 'success' })
  }

  return (
    <div className="bg-muted/20">
      <div className="container py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground">
          <Link to={ROUTES.jobs}>
            <ArrowLeft className="h-4 w-4" /> Back to jobs
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* Header card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <img
                    src={job.company.logoUrl}
                    alt={job.company.name}
                    className="h-16 w-16 rounded-xl border border-border object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
                      {job.isFeatured && <Badge variant="soft">Featured</Badge>}
                      {job.isUrgent && <Badge variant="soft-destructive">Urgent</Badge>}
                    </div>
                    <Link
                      to={ROUTES.companyDetails(job.companyId)}
                      className="mt-1 flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Building2 className="h-4 w-4" /> {job.company.name}
                      {job.company.isVerified && <BadgeCheck className="h-4 w-4 text-info" />}
                    </Link>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" /> {job.city}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Wallet className="h-4 w-4" /> {formatSalaryRange(job.salaryMin, job.salaryMax)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BriefcaseBusiness className="h-4 w-4" /> {label(JOB_TYPES, job.jobType)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> {timeAgo(job.postedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DetailSection title="Job Description">
              <p className="leading-relaxed text-muted-foreground">{job.description}</p>
            </DetailSection>

            <DetailSection title="Key Responsibilities">
              <ul className="space-y-2">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection title="Requirements">
              <ul className="space-y-2">
                {job.requirements.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection title="Skills Required">
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <Badge key={skill} variant="soft" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </DetailSection>

            <DetailSection title="Benefits & Perks">
              <div className="grid gap-2 sm:grid-cols-2">
                {job.benefits.map(benefit => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success" /> {benefit}
                  </div>
                ))}
              </div>
            </DetailSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <Card>
              <CardContent className="space-y-4 p-6">
                {isExternal ? (
                  <Button size="lg" className="w-full" onClick={handleApply}>
                    Apply on company site <ExternalLink className="h-4 w-4" />
                  </Button>
                ) : applied ? (
                  <Button size="lg" className="w-full" disabled>
                    <CheckCircle2 className="h-4 w-4" /> Applied
                  </Button>
                ) : (
                  <Button size="lg" className="w-full" onClick={handleApply}>
                    1-Click Apply
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => toggle(job.id)}
                    className={cn(saved && 'border-primary text-primary')}
                  >
                    <Bookmark className={cn('h-4 w-4', saved && 'fill-primary')} />
                    {saved ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="outline" onClick={share}>
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>

                <Separator />

                <dl className="space-y-3 text-sm">
                  <Row icon={Eye} label="Views" value={job.views.toLocaleString()} />
                  <Row icon={Users} label="Applicants" value={String(job.applicants)} />
                  <Row icon={BriefcaseBusiness} label="Experience" value={label(EXPERIENCE_LEVELS, job.experienceLevel)} />
                  <Row icon={MapPin} label="Work Mode" value={label(WORK_MODES, job.workMode)} />
                  <Row icon={CalendarClock} label="Apply before" value={formatDate(job.expiresAt)} />
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">About {job.company.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">{job.company.description}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to={ROUTES.companyDetails(job.companyId)}>View company profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-xl font-bold tracking-tight">Similar jobs</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map(r => (
                <JobCard key={r.id} job={r} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Your profile and resume will be shared with {job.company.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cover letter (optional)</label>
            <Textarea
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you’re a great fit…"
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApply}>Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function Row({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
