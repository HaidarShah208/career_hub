import { useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent } from '@/shared/components/ui/card'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { JobCard } from '@/features/jobs/components/JobCard'
import { getRecommendations, DEMO_PROFILE } from '@/features/ai/services/matching'

export default function RecommendedJobsPage() {
  const [profile] = useState(DEMO_PROFILE)
  const matches = useMemo(() => getRecommendations(profile, 18), [profile])

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
              Based on {profile.skills.length} skills · {profile.preferredCity} · {profile.experienceLevel} level
            </p>
          </div>
          <Badge variant="success" className="text-sm">
            {avg}% avg match
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {matches.map(({ job, score }) => (
          <JobCard key={job.id} job={job} matchScore={score} />
        ))}
      </div>
    </div>
  )
}
