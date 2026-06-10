import { BadgeCheck, FileText, MapPin, X } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { useToast } from '@/shared/components/ui/toast'
import { usePendingEmployers } from '../hooks/useAdminData'
import { timeAgo } from '@/shared/lib/utils'

function companyLogo(name: string, logo?: string | null) {
  return (
    logo ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=16a34a`
  )
}

export default function EmployerVerificationPage() {
  const { toast } = useToast()
  const { pending, isLoading, resolve, isResolving } = usePendingEmployers()

  async function handleResolve(id: string, approved: boolean, companyName: string) {
    try {
      await resolve(id, approved)
      toast({
        title: approved ? `${companyName} approved` : `${companyName} rejected`,
        variant: approved ? 'success' : 'info',
      })
    } catch (err) {
      toast({
        title: 'Action failed',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <div>
      <PageHeader
        title="Employer Verification"
        description={`${pending.length} companies awaiting verification.`}
      />

      {pending.length === 0 ? (
        <EmptyState icon={BadgeCheck} title="All caught up" description="There are no pending verifications." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pending.map((employer) => (
            <Card key={employer.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <img
                    src={companyLogo(employer.name, employer.logo)}
                    alt=""
                    className="h-12 w-12 rounded-lg border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{employer.name}</p>
                    <p className="text-sm text-muted-foreground">{employer.industry || 'General'}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Owner: {employer.ownerName} · {employer.ownerEmail}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {employer.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {employer.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" /> Company profile
                      </span>
                      <span>Submitted {timeAgo(employer.createdAt)}</span>
                    </div>
                  </div>
                  <Badge variant="soft-warning">Pending</Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={isResolving}
                    onClick={() => handleResolve(employer.id, true, employer.name)}
                  >
                    <BadgeCheck className="h-4 w-4" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={isResolving}
                    onClick={() => handleResolve(employer.id, false, employer.name)}
                  >
                    <X className="h-4 w-4" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
