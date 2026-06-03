import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Globe,
  MapPin,
  Users,
} from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { StarRating } from '@/shared/components/common/StarRating'
import { JobCard } from '@/features/jobs/components/JobCard'
import { useCompany } from '../hooks/useCompanies'
import { ROUTES } from '@/shared/constants'

export default function CompanyDetailsPage() {
  const { id } = useParams()
  const { company, jobs, isLoading } = useCompany(id)

  if (isLoading) return <PageLoader />
  if (!company) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Company not found</h1>
        <Button asChild className="mt-6">
          <Link to={ROUTES.companies}>Browse companies</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-muted/20">
      <div className="container py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground">
          <Link to={ROUTES.companies}>
            <ArrowLeft className="h-4 w-4" /> All companies
          </Link>
        </Button>

        <Card className="overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-primary-600 to-emerald-600" />
          <CardContent className="p-6">
            <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-24 w-24 rounded-2xl border-4 border-card bg-card object-cover shadow-md"
                />
                <div className="pb-1">
                  <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                    {company.name}
                    {company.isVerified && <BadgeCheck className="h-5 w-5 text-info" />}
                  </h1>
                  <p className="text-sm text-muted-foreground">{company.industry}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <a href={company.website} target="_blank" rel="noreferrer">
                    <Globe className="h-4 w-4" /> Website
                  </a>
                </Button>
                <Button asChild>
                  <a href="#open-roles">View {company.openJobs} jobs</a>
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {company.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {company.size} employees
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> Founded {company.founded}
              </span>
              <StarRating rating={company.rating} showValue />
              <span>({company.reviewCount} reviews)</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">{company.description}</p>
              </CardContent>
            </Card>

            <div id="open-roles">
              <h2 className="mb-4 text-xl font-bold tracking-tight">
                Open positions ({jobs.length})
              </h2>
              {jobs.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    No open positions right now. Check back soon!
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {jobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" /> Benefits & Perks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {company.benefits.map(benefit => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success" /> {benefit}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Company overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Info label="Industry" value={company.industry} />
                <Info label="Company size" value={`${company.size} employees`} />
                <Info label="Headquarters" value={company.city} />
                <Info label="Founded" value={String(company.founded)} />
                <Info label="Open jobs" value={String(company.openJobs)} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
