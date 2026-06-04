import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bell, BellRing, Plus, Trash2 } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Switch } from '@/shared/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { useToast } from '@/shared/components/ui/toast'
import { JOB_CATEGORIES, PAKISTAN_CITIES } from '@/shared/constants'
import { useJobAlerts } from '../hooks/useJobAlerts'
import { jobAlertSchema, type JobAlertFormValues } from '../schemas'

const FREQ_LABEL: Record<JobAlertFormValues['frequency'], string> = {
  instant: 'Instant',
  daily: 'Daily',
  weekly: 'Weekly',
}
const ANY = '__any__'

export default function JobAlertsPage() {
  const { toast } = useToast()
  const alerts = useJobAlerts(s => s.alerts)
  const addAlert = useJobAlerts(s => s.add)
  const toggle = useJobAlerts(s => s.toggle)
  const remove = useJobAlerts(s => s.remove)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobAlertFormValues>({
    resolver: zodResolver(jobAlertSchema),
    defaultValues: { frequency: 'daily', city: '', category: '' },
  })

  function onSubmit(values: JobAlertFormValues) {
    addAlert(values)
    reset({ keyword: '', frequency: 'daily', city: '', category: '' })
    toast({ title: 'Alert created', description: `We’ll notify you about “${values.keyword}” jobs.`, variant: 'success' })
  }

  return (
    <div>
      <PageHeader title="Job Alerts" description="Get notified the moment new matching jobs are posted." />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {alerts.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Bell className="mx-auto mb-3 h-8 w-8" />
                No alerts yet. Create one to get started.
              </CardContent>
            </Card>
          )}
          {alerts.map(alert => (
            <Card key={alert.id}>
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BellRing className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{alert.keyword}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                    {alert.city && <Badge variant="outline">{alert.city}</Badge>}
                    {alert.category && (
                      <Badge variant="outline">
                        {JOB_CATEGORIES.find(c => c.value === alert.category)?.label ?? alert.category}
                      </Badge>
                    )}
                    <Badge variant="soft">{FREQ_LABEL[alert.frequency]}</Badge>
                  </div>
                </div>
                <Switch checked={alert.active} onCheckedChange={() => toggle(alert.id)} />
                <Button variant="ghost" size="icon" onClick={() => remove(alert.id)} aria-label="Delete alert">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="h-4 w-4" /> Create new alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label className="mb-1.5 block">Keyword / role</Label>
                <Input placeholder="e.g. Backend Developer" {...register('keyword')} />
                {errors.keyword && <p className="mt-1 text-xs text-destructive">{errors.keyword.message}</p>}
              </div>
              <div>
                <Label className="mb-1.5 block">City</Label>
                <Select value={watch('city') || ANY} onValueChange={v => setValue('city', v === ANY ? '' : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>Any city</SelectItem>
                    {PAKISTAN_CITIES.map(c => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Category</Label>
                <Select value={watch('category') || ANY} onValueChange={v => setValue('category', v === ANY ? '' : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>Any category</SelectItem>
                    {JOB_CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Frequency</Label>
                <Select
                  value={watch('frequency')}
                  onValueChange={v => setValue('frequency', v as JobAlertFormValues['frequency'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily digest</SelectItem>
                    <SelectItem value="weekly">Weekly digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Create alert
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
