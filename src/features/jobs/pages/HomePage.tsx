import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calculator,
  Code2,
  GraduationCap,
  Globe,
  Headphones,
  Landmark,
  Palette,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { JobSearchBar } from '../components/JobSearchBar'
import { JobCard, JobCardSkeleton } from '../components/JobCard'
import { CompanyCard } from '@/features/companies/components/CompanyCard'
import { useJobCollection } from '../hooks/useJobs'
import { useHomeStats, formatStatCount } from '../hooks/useHomeStats'
import { useTopCompanies } from '@/features/companies/hooks/useCompanies'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { APP_NAME, JOB_CATEGORIES, ROUTES } from '@/shared/constants'

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Code2,
  Wrench,
  TrendingUp,
  Calculator,
  Users,
  Palette,
  Stethoscope,
  GraduationCap,
  Headphones,
  Truck,
  Landmark,
  Building2,
}

function SectionHeading({
  eyebrow,
  title,
  description,
  to,
  linkLabel,
}: {
  eyebrow?: string
  title: string
  description?: string
  to?: string
  linkLabel?: string
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-2">
        {eyebrow && (
          <Badge variant="soft" className="uppercase tracking-wide">
            {eyebrow}
          </Badge>
        )}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {to && linkLabel && (
        <Button asChild variant="ghost" className="shrink-0 text-primary">
          <Link to={to}>
            {linkLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}

export default function HomePage() {
  const { jobs: featured, isLoading: featuredLoading } = useJobCollection('featured', 6)
  const { jobs: latest, isLoading: latestLoading } = useJobCollection('latest', 6)
  const { companies } = useTopCompanies(12)
  const { stats, isLoading: statsLoading } = useHomeStats()

  const heroStats = useMemo(
    () => [
      { label: 'Active Jobs', value: stats ? formatStatCount(stats.activeJobs) : '—', icon: Briefcase },
      { label: 'Companies Hiring', value: stats ? formatStatCount(stats.companies) : '—', icon: Building2 },
      { label: 'Professionals', value: stats ? formatStatCount(stats.candidates) : '—', icon: Users },
      { label: 'Jobs Filled', value: stats ? formatStatCount(stats.hired) : '—', icon: TrendingUp },
    ],
    [stats],
  )

  const popularSearches = useMemo(() => {
    const fromJobs = latest
      .map((j) => j.title)
      .filter((title, i, arr) => arr.indexOf(title) === i)
      .slice(0, 6)
    return fromJobs.length > 0 ? fromJobs : ['Software Engineer', 'Accountant', 'Remote']
  }, [latest])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_theme(colors.primary.500/0.12),_transparent_55%)]" />
        <div className="container py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="soft" className="mb-4 gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered job matching is here
            </Badge>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Find Your Dream Career in{' '}
              <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
                Pakistan
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              {APP_NAME} connects you with thousands of verified opportunities across the
              country and remote roles worldwide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-8 max-w-3xl"
          >
            <JobSearchBar />
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Popular:</span>
              {popularSearches.map(term => (
                <Link
                  key={term}
                  to={`${ROUTES.jobs}?q=${encodeURIComponent(term)}`}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {term}
                </Link>
              ))}
            </div>
          </motion.div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {heroStats.map(stat => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center rounded-xl border border-border bg-card/60 p-4 text-center backdrop-blur"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  {statsLoading ? (
                    <Skeleton className="mt-2 h-7 w-16" />
                  ) : (
                    <span className="mt-2 text-xl font-bold">{stat.value}</span>
                  )}
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <SectionHeading
          eyebrow="Browse by category"
          title="Explore jobs across industries"
          description="Discover roles tailored to your field of expertise."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {JOB_CATEGORIES.slice(0, 10).map(category => {
            const Icon = CATEGORY_ICONS[category.icon] ?? Briefcase
            return (
              <Link
                key={category.value}
                to={`${ROUTES.jobs}?category=${category.value}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">{category.label}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured jobs */}
      <section className="border-y border-border bg-muted/30 py-16">
        <div className="container">
          <SectionHeading
            eyebrow="Hand-picked"
            title="Featured opportunities"
            description="Premium roles from top employers actively hiring right now."
            to={ROUTES.jobs}
            linkLabel="View all jobs"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredLoading
              ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
              : featured.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      </section>

      {/* Quick links band */}
      <section className="container py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Remote Jobs',
              desc: 'Work from anywhere in Pakistan',
              icon: Globe,
              to: ROUTES.remoteJobs,
              accent: 'from-blue-500/10 to-cyan-500/10 text-blue-600',
            },
            {
              title: 'Government Jobs',
              desc: 'Latest govt & public sector roles',
              icon: Landmark,
              to: ROUTES.governmentJobs,
              accent: 'from-amber-500/10 to-orange-500/10 text-amber-600',
            },
            {
              title: 'Top Companies',
              desc: 'Explore Pakistan’s best employers',
              icon: Building2,
              to: ROUTES.companies,
              accent: 'from-primary/10 to-emerald-500/10 text-primary',
            },
          ].map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                to={item.to}
                className={`group flex items-center gap-4 rounded-xl border border-border bg-gradient-to-br p-6 transition-all hover:-translate-y-0.5 hover:shadow-md ${item.accent}`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/80">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-foreground/60 transition-transform group-hover:translate-x-1" />
              </Link>
            )
          })}
        </div>
      </section>

      {/* Latest jobs */}
      <section className="border-y border-border bg-muted/30 py-16">
        <div className="container">
          <SectionHeading
            eyebrow="Fresh listings"
            title="Latest jobs"
            description="Newly posted roles updated in real-time."
            to={ROUTES.jobs}
            linkLabel="Browse all"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latestLoading
              ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
              : latest.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      </section>

      {/* Top companies */}
      <section className="container py-16">
        <SectionHeading
          eyebrow="Trusted employers"
          title="Top companies hiring"
          description="Join the organisations shaping Pakistan’s future."
          to={ROUTES.companies}
          linkLabel="All companies"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {companies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>

    </div>
  )
}
