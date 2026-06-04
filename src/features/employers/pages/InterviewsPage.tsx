import { Link } from 'react-router-dom'
import { CalendarClock, Users } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useApplicants } from '../hooks/useApplicants'
import { ROUTES } from '@/shared/constants'
import { formatDate } from '@/shared/lib/utils'

export default function InterviewsPage() {
  const { applicants, isLoading } = useApplicants()
  const interviews = applicants.filter((a) => a.status === 'interview')

  return (
    <div>
      <PageHeader
        title="Interviews"
        description="Candidates you've moved to the interview stage."
        actions={
          <Button asChild variant="outline">
            <Link to={ROUTES.employerApplicants}>
              <Users className="h-4 w-4" /> Manage applicants
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No interviews scheduled"
          description="Move an applicant to the “Interview” stage on the Applicants page and they'll show up here."
          action={
            <Button asChild>
              <Link to={ROUTES.employerApplicants}>Go to applicants</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {interviews.map((interview) => (
            <Card key={interview.id}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <img
                    src={interview.avatarUrl}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-full border border-border"
                  />
                  <CardTitle className="text-base">{interview.name}</CardTitle>
                </div>
                <Badge variant="soft-info">Interview</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{interview.jobTitle}</p>
                {interview.city && <p>{interview.city}</p>}
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" /> Applied {formatDate(interview.appliedAt, 'long')}
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to={ROUTES.employerApplicants}>View applicant</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
