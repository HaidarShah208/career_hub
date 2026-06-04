import { useMemo } from 'react'
import { Sparkles } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent } from '@/shared/components/ui/card'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { JobCard, JobCardSkeleton } from '@/features/jobs/components/JobCard'
import { useJobCollection } from '@/features/jobs/hooks/useJobs'
import { getRecommendations } from '@/features/ai/services/matching'
import { useMatchProfile } from '../hooks/useMatchProfile'

export default function RecommendedJobsPage() {
  const profile = useMatchProfile()
  const { jobs, isLoading } = useJobCollection('latest', 30)
  const matches = useMemo(() => getRecommendations(profile, jobs, 18), [profile, jobs])

  const avg = Math.round(matches.reduce((sum, m) => sum + m.score, 0) / (matches.length || 1))

  return (
    <div>
      <PageHeader
        title="Recommended for you"
        description="AI-matched jobs based on your skills, experience, and preferences."
      />

      <Card className="mb-6 bg-gradient-to-br from-primary/10 to-emerald-500/10">
        <CardContent className="flex flex-wrap items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold">Your matches are looking great</p>
            <p className="text-sm text-muted-foreground">
              Based on {profile.skills.length} skill{profile.skills.length === 1 ? '' : 's'} ·{' '}
              {profile.preferredCity || 'any city'} · {profile.experienceLevel} level
            </p>
          </div>
          <Badge variant="success" className="text-sm">
            {avg}% avg match
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
          : matches.map(({ job, score }) => (
              <JobCard key={job.id} job={job} matchScore={score} />
            ))}
      </div>
    </div>
  )
}
