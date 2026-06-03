import { Link } from 'react-router-dom'
import { Bookmark, Briefcase, Eye, Sparkles, TrendingUp } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Progress } from '@/shared/components/ui/progress'
import { StatCard } from '@/shared/components/common/StatCard'
import { JobCard } from '@/features/jobs/components/JobCard'
import { useApplications } from '@/features/applications/hooks/useApplications'
import { useSavedJobs } from '@/features/jobs/hooks/useSavedJobs'
import { getRecommendations, DEMO_PROFILE } from '@/features/ai/services/matching'
import { useAuthStore } from '@/app/store/auth.store'
import { APPLICATION_STATUSES, ROUTES } from '@/shared/constants'
import { timeAgo } from '@/shared/lib/utils'

const PROFILE_STEPS = [
  { label: 'Basic info', done: true },
  { label: 'Work experience', done: true },
  { label: 'Education', done: true },
  { label: 'Skills', done: true },
  { label: 'Resume uploaded', done: false },
  { label: 'Portfolio link', done: false },
]

export default function CandidateOverviewPage() {
  const user = useAuthStore(s => s.user)
  const { applications } = useApplications()
  const { ids } = useSavedJobs()
  const recommendations = getRecommendations(DEMO_PROFILE, 4)

  const myApplications = applications.filter(a => a.status !== 'withdrawn')
  const interviews = myApplications.filter(a => a.status === 'interview').length
  const profileScore = Math.round((PROFILE_STEPS.filter(s => s.done).length / PROFILE_STEPS.length) * 100)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.fullName.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-sm text-muted-foreground">Here’s what’s happening with your job search.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Applications" value={myApplications.length} icon={Briefcase} accent="primary" trend={12} />
        <StatCard label="Interviews" value={interviews} icon={TrendingUp} accent="success" trend={8} />
        <StatCard label="Saved Jobs" value={ids.length} icon={Bookmark} accent="info" hint="Across all searches" />
        <StatCard label="Profile Views" value={148} icon={Eye} accent="warning" trend={-3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Recommended */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" /> Recommended for you
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-primary">
                <Link to={ROUTES.candidateRecommended}>View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {recommendations.map(({ job, score }) => (
                <JobCard key={job.id} job={job} matchScore={score} compact />
              ))}
            </CardContent>
          </Card>

          {/* Recent applications */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Recent applications</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-primary">
                <Link to={ROUTES.candidateApplications}>View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {myApplications.slice(0, 5).map(app => {
                const status = APPLICATION_STATUSES.find(s => s.value === app.status)
                return (
                  <div key={app.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <img
                      src={app.job.company.logoUrl}
                      alt=""
                      className="h-10 w-10 rounded-lg border border-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <Link to={ROUTES.jobDetails(app.jobId)} className="truncate font-medium hover:text-primary">
                        {app.job.title}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {app.job.company.name} · applied {timeAgo(app.appliedAt)}
                      </p>
                    </div>
                    <Badge variant="soft" className="shrink-0">
                      {status?.label ?? app.status}
                    </Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Profile strength */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile strength</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">{profileScore}%</span>
                <Badge variant={profileScore >= 80 ? 'success' : 'warning'}>
                  {profileScore >= 80 ? 'Strong' : 'Needs work'}
                </Badge>
              </div>
              <Progress value={profileScore} />
              <ul className="space-y-2">
                {PROFILE_STEPS.map(step => (
                  <li
                    key={step.label}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className={
                        step.done
                          ? 'flex h-4 w-4 items-center justify-center rounded-full bg-success text-[10px] text-success-foreground'
                          : 'h-4 w-4 rounded-full border-2 border-muted-foreground/40'
                      }
                    >
                      {step.done ? '✓' : ''}
                    </span>
                    <span className={step.done ? 'text-muted-foreground line-through' : ''}>{step.label}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link to={ROUTES.candidateProfile}>Complete profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-emerald-500/10">
            <CardContent className="space-y-3 p-6">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Boost your chances with AI</h3>
              <p className="text-sm text-muted-foreground">
                Get an instant resume score, tailored feedback, and AI-generated cover letters.
              </p>
              <Button asChild className="w-full">
                <Link to={ROUTES.candidateAi}>Open Career AI</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
