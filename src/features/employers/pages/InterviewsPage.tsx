import { useState } from 'react'
import { CalendarClock, Clock, Plus, Video } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { useToast } from '@/shared/components/ui/toast'
import { formatDate } from '@/shared/lib/utils'

interface Interview {
  id: string
  candidate: string
  role: string
  date: string
  time: string
  type: 'Video Call' | 'On-site' | 'Phone'
}

const INITIAL: Interview[] = [
  { id: 'i1', candidate: 'Sara Malik', role: 'Frontend Engineer', date: new Date(Date.now() + 86400000).toISOString(), time: '11:00 AM', type: 'Video Call' },
  { id: 'i2', candidate: 'Usman Tariq', role: 'Backend Engineer', date: new Date(Date.now() + 2 * 86400000).toISOString(), time: '03:30 PM', type: 'On-site' },
  { id: 'i3', candidate: 'Hira Shah', role: 'Product Designer', date: new Date(Date.now() + 3 * 86400000).toISOString(), time: '01:00 PM', type: 'Video Call' },
]

export default function InterviewsPage() {
  const { toast } = useToast()
  const [interviews, setInterviews] = useState<Interview[]>(INITIAL)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ candidate: '', role: '', date: '', time: '' })

  function schedule() {
    if (!form.candidate || !form.date) {
      toast({ title: 'Please fill candidate and date', variant: 'warning' })
      return
    }
    setInterviews(prev => [
      {
        id: `i${Date.now()}`,
        candidate: form.candidate,
        role: form.role || 'Candidate',
        date: new Date(form.date).toISOString(),
        time: form.time || '10:00 AM',
        type: 'Video Call',
      },
      ...prev,
    ])
    setOpen(false)
    setForm({ candidate: '', role: '', date: '', time: '' })
    toast({ title: 'Interview scheduled', variant: 'success' })
  }

  return (
    <div>
      <PageHeader
        title="Interviews"
        description="Schedule and manage upcoming candidate interviews."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Schedule interview
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {interviews.map(interview => (
          <Card key={interview.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">{interview.candidate}</CardTitle>
              <Badge variant={interview.type === 'Video Call' ? 'soft-info' : 'soft'}>{interview.type}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{interview.role}</p>
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-primary" /> {formatDate(interview.date, 'long')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> {interview.time}
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Video className="h-4 w-4" /> Join / View details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule an interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Candidate name</Label>
              <Input value={form.candidate} onChange={e => setForm(f => ({ ...f, candidate: e.target.value }))} />
            </div>
            <div>
              <Label className="mb-1.5 block">Role</Label>
              <Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Date</Label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <Label className="mb-1.5 block">Time</Label>
                <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={schedule}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
