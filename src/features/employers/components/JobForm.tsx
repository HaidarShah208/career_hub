import { useEffect, useState, type KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
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
import { useToast } from '@/shared/components/ui/toast'
import {
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES,
  JOB_TYPES,
  MAX_JOB_SKILLS,
  PAKISTAN_CITIES,
  WORK_MODES,
} from '@/shared/constants'
import { cn } from '@/shared/lib/utils'
import { Globe, Send } from 'lucide-react'
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
  applyMethod: 'internal',
  applyUrl: '',
  isUrgent: false,
  isFeatured: false,
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

export function JobForm({ defaultValues, submitLabel, onSubmit }: JobFormProps) {
  const { toast } = useToast()
  const mergedDefaults = { ...FALLBACK, ...defaultValues }
  const [skillInput, setSkillInput] = useState('')
  const [skillTags, setSkillTags] = useState<string[]>(() =>
    mergedDefaults.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX_JOB_SKILLS),
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostJobFormValues>({
    resolver: zodResolver(postJobSchema),
    defaultValues: mergedDefaults,
  })

  useEffect(() => {
    setValue('skills', skillTags.join(', '), { shouldValidate: skillTags.length > 0 })
  }, [skillTags, setValue])

  function addSkill(raw: string) {
    const skill = raw.trim()
    if (!skill) {
      setSkillInput('')
      return
    }
    if (skillTags.length >= MAX_JOB_SKILLS) {
      toast({
        title: 'Skill limit reached',
        description: `You can add up to ${MAX_JOB_SKILLS} skills.`,
        variant: 'error',
      })
      return
    }
    if (skillTags.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setSkillInput('')
      return
    }
    setSkillTags((prev) => [...prev, skill])
    setSkillInput('')
  }

  function removeSkill(skill: string) {
    setSkillTags((prev) => prev.filter((s) => s !== skill))
  }

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

  // Prevent the browser's implicit "Enter submits the form" behaviour when the
  // focus is on a single-line <input> (e.g. the skills field). Submitting should
  // only happen via the explicit button. Textareas keep normal Enter handling.
  function handleKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    const target = e.target as HTMLElement
    if (e.key === 'Enter' && target.tagName === 'INPUT' && target.getAttribute('data-skill-input') !== 'true') {
      e.preventDefault()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-6">
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
            <Label className="mb-1.5 block">
              Required skills ({skillTags.length}/{MAX_JOB_SKILLS})
            </Label>
            <Input
              data-skill-input="true"
              value={skillInput}
              disabled={skillTags.length >= MAX_JOB_SKILLS}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault()
                  addSkill(skillInput)
                } else if (e.key === 'Backspace' && !skillInput && skillTags.length > 0) {
                  removeSkill(skillTags[skillTags.length - 1])
                }
              }}
              onBlur={() => {
                if (skillInput.trim()) addSkill(skillInput)
              }}
              placeholder="Type a skill and press Enter"
            />
            <input type="hidden" {...register('skills')} />
            {skillTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {skillTags.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="rounded-full p-0.5 hover:bg-muted"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="mt-1.5 text-xs text-muted-foreground">
              Press Enter to add each skill (max {MAX_JOB_SKILLS}).
            </p>
            <FieldError message={errors.skills?.message} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">How should candidates apply?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                {
                  value: 'internal',
                  icon: Send,
                  title: 'Apply on PCH',
                  desc: 'Candidates apply here. You review them on the Applicants page.',
                },
                {
                  value: 'external',
                  icon: Globe,
                  title: 'External link',
                  desc: 'Send candidates to your own careers page or form.',
                },
              ] as const
            ).map(opt => {
              const Icon = opt.icon
              const active = watch('applyMethod') === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue('applyMethod', opt.value, { shouldValidate: true })}
                  className={cn(
                    'flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all',
                    active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/40',
                  )}
                >
                  <Icon className={cn('h-5 w-5', active ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="text-sm font-medium">{opt.title}</span>
                  <span className="text-xs text-muted-foreground">{opt.desc}</span>
                </button>
              )
            })}
          </div>

          {watch('applyMethod') === 'external' && (
            <div>
              <Label className="mb-1.5 block">Application URL</Label>
              <Input placeholder="https://company.com.pk/careers/apply" {...register('applyUrl')} />
              <FieldError message={errors.applyUrl?.message} />
              <p className="mt-1 text-xs text-muted-foreground">
                Candidates clicking “Apply” will open this link in a new tab.
              </p>
            </div>
          )}
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
