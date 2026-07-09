import { Link } from 'react-router-dom'
import { Bookmark, BriefcaseBusiness, Clock, MapPin, Wallet, Users } from 'lucide-react'
import { motion } from 'framer-motion'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { ROUTES, JOB_TYPES, WORK_MODES } from '@/shared/constants'
import { cn, formatSalaryRange, timeAgo } from '@/shared/lib/utils'
import { useSaveJobAction } from '../hooks/useSavedJobs'
import type { Job } from '../types'

interface JobCardProps {
  job: Job
  matchScore?: number
  compact?: boolean
}

function label(list: readonly { value: string; label: string }[], value: string) {
  return list.find(item => item.value === value)?.label ?? value
}

export function JobCard({ job, matchScore, compact }: JobCardProps) {
  const { isSaved, toggleSave } = useSaveJobAction()
  const saved = isSaved(job.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative h-full overflow-hidden p-5 hover:border-primary/40 hover:shadow-md">
        {job.isFeatured && (
          <span className="absolute right-0 top-0 rounded-bl-lg bg-gradient-to-r from-primary-600 to-emerald-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
        <div className="flex items-start gap-4">
          <Link
            to={ROUTES.companyDetails(job.companyId)}
            className="shrink-0"
            aria-label={job.company.name}
          >
            <img
              src={job.company.logoUrl}
              alt={job.company.name}
              loading="lazy"
              className="h-12 w-12 rounded-lg border border-border object-cover"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link to={ROUTES.jobDetails(job.id)}>
                  <h3 className="truncate text-base font-semibold transition-colors group-hover:text-primary">
                    {job.title}
                  </h3>
                </Link>
                <Link
                  to={ROUTES.companyDetails(job.companyId)}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {job.company.name}
                </Link>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={saved ? 'Remove from saved' : 'Save job'}
                onClick={(e) => {
                  e.preventDefault()
                  toggleSave(job.id)
                }}
                className="h-8 w-8 shrink-0"
              >
                <Bookmark className={cn('h-4 w-4', saved && 'fill-primary text-primary')} />
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {job.city}
              </span>
              <span className="flex items-center gap-1">
                <BriefcaseBusiness className="h-3.5 w-3.5" /> {label(JOB_TYPES, job.jobType)}
              </span>
              <span className="flex items-center gap-1">
                <Wallet className="h-3.5 w-3.5" /> {formatSalaryRange(job.salaryMin, job.salaryMax)}
              </span>
            </div>

            {!compact && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="soft">{label(WORK_MODES, job.workMode)}</Badge>
                {job.isUrgent && <Badge variant="soft-destructive">Urgent Hiring</Badge>}
                {job.isGovernment && <Badge variant="soft-warning">Government</Badge>}
                {job.skills.slice(0, 3).map(skill => (
                  <Badge key={skill} variant="outline" className="font-normal">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {timeAgo(job.postedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {job.applicants} applicants
            </span>
          </span>
          {matchScore !== undefined ? (
            <Badge variant={matchScore >= 80 ? 'success' : matchScore >= 60 ? 'warning' : 'secondary'}>
              {matchScore}% match
            </Badge>
          ) : (
            <Button asChild size="sm" variant="ghost" className="h-7 text-primary">
              <Link to={ROUTES.jobDetails(job.id)}>View →</Link>
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export function JobCardSkeleton() {
  return (
    <Card className="h-full p-5">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 rounded-lg bg-muted shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-muted shimmer" />
          <div className="h-3 w-1/3 rounded bg-muted shimmer" />
          <div className="mt-3 h-3 w-full rounded bg-muted shimmer" />
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-16 rounded-full bg-muted shimmer" />
            <div className="h-5 w-16 rounded-full bg-muted shimmer" />
          </div>
        </div>
      </div>
    </Card>
  )
}
