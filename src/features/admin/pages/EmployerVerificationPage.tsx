import { useState } from 'react'
import { BadgeCheck, FileText, MapPin, X } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { useToast } from '@/shared/components/ui/toast'
import { PENDING_EMPLOYERS } from '../data'
import { timeAgo } from '@/shared/lib/utils'

export default function EmployerVerificationPage() {
  const { toast } = useToast()
  const [pending, setPending] = useState(PENDING_EMPLOYERS)

  function resolve(id: string, approved: boolean) {
    setPending(prev => prev.filter(e => e.id !== id))
    toast({
      title: approved ? 'Employer approved' : 'Employer rejected',
      variant: approved ? 'success' : 'info',
    })
  }

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
          {pending.map(employer => (
            <Card key={employer.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <img src={employer.logoUrl} alt="" className="h-12 w-12 rounded-lg border border-border" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{employer.company}</p>
                    <p className="text-sm text-muted-foreground">{employer.industry}</p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {employer.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" /> {employer.documents} documents
                      </span>
                      <span>Submitted {timeAgo(employer.submittedAt)}</span>
                    </div>
                  </div>
                  <Badge variant="soft-warning">Pending</Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => resolve(employer.id, true)}>
                    <BadgeCheck className="h-4 w-4" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => resolve(employer.id, false)}
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
