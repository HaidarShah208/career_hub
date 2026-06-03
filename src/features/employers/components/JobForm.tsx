import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Switch } from '@/shared/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES,
  JOB_TYPES,
  PAKISTAN_CITIES,
  WORK_MODES,
} from '@/shared/constants'
import { postJobSchema, type PostJobFormValues } from '../schemas'

interface JobFormProps {
  defaultValues?: Partial<PostJobFormValues>
  submitLabel: string
  onSubmit: (values: PostJobFormValues) => void | Promise<void>
}

const FALLBACK: PostJobFormValues = {
  title: '',
  category: 'software',
  city: 'Lahore',
  workMode: 'onsite',
  jobType: 'full_time',
  experienceLevel: 'mid',
  salaryMin: 100000,
  salaryMax: 200000,
  description: '',
  skills: '',
  isUrgent: false,
  isFeatured: false,
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

export function JobForm({ defaultValues, submitLabel, onSubmit }: JobFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostJobFormValues>({
    resolver: zodResolver(postJobSchema),
    defaultValues: { ...FALLBACK, ...defaultValues },
  })

  const selects: {
    name: keyof PostJobFormValues
    label: string
    options: readonly { value: string; label: string }[]
  }[] = [
    { name: 'category', label: 'Category', options: JOB_CATEGORIES.map(c => ({ value: c.value, label: c.label })) },
    { name: 'city', label: 'City', options: PAKISTAN_CITIES.map(c => ({ value: c, label: c })) },
    { name: 'workMode', label: 'Work Mode', options: WORK_MODES },
    { name: 'jobType', label: 'Job Type', options: JOB_TYPES },
    { name: 'experienceLevel', label: 'Experience Level', options: EXPERIENCE_LEVELS },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-1.5 block">Job title</Label>
            <Input placeholder="e.g. Senior React Developer" {...register('title')} />
            <FieldError message={errors.title?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {selects.map(field => (
              <div key={field.name}>
                <Label className="mb-1.5 block">{field.label}</Label>
                <Select
                  value={String(watch(field.name) ?? '')}
                  onValueChange={v => setValue(field.name, v as never, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors[field.name]?.message as string | undefined} />
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block">Minimum salary (PKR/month)</Label>
              <Input type="number" {...register('salaryMin')} />
              <FieldError message={errors.salaryMin?.message} />
            </div>
            <div>
              <Label className="mb-1.5 block">Maximum salary (PKR/month)</Label>
              <Input type="number" {...register('salaryMax')} />
              <FieldError message={errors.salaryMax?.message} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description & skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-1.5 block">Job description</Label>
            <Textarea rows={6} placeholder="Describe the role, responsibilities, and requirements…" {...register('description')} />
            <FieldError message={errors.description?.message} />
          </div>
          <div>
            <Label className="mb-1.5 block">Required skills (comma separated)</Label>
            <Input placeholder="React, TypeScript, Node.js" {...register('skills')} />
            <FieldError message={errors.skills?.message} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Mark as urgent</p>
              <p className="text-xs text-muted-foreground">Adds an “Urgent Hiring” badge to attract attention.</p>
            </div>
            <Switch checked={Boolean(watch('isUrgent'))} onCheckedChange={v => setValue('isUrgent', v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Feature this job</p>
              <p className="text-xs text-muted-foreground">Promote to the top of search results (premium).</p>
            </div>
            <Switch checked={Boolean(watch('isFeatured'))} onCheckedChange={v => setValue('isFeatured', v)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="submit" size="lg" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
