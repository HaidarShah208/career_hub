import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Linkedin, Link2, Loader2, Pencil, Save, X } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { useToast } from '@/shared/components/ui/toast'
import { useAuthStore } from '@/app/store/auth.store'
import { EXPERIENCE_LEVELS, JOB_CATEGORIES, MAX_PROFILE_SKILLS, PAKISTAN_CITIES } from '@/shared/constants'
import { initials } from '@/shared/lib/utils'
import { uploadAvatar, deleteAvatar } from '@/shared/services/uploads.api'
import { useCandidateProfile } from '../hooks/useCandidateProfile'
import { ProfileStrengthPanel } from '../components/ProfileStrengthPanel'
import { computeProfileSteps, levelToYears, profileScore as scoreFromSteps, yearsToLevel } from '../lib/profile'
import { getCandidateExtras, saveCandidateExtras } from '../lib/extras'
import { profileSchema, type ProfileFormValues } from '../schemas'

export default function CandidateProfilePage() {
  const { toast } = useToast()
  const user = useAuthStore(s => s.user)
  const updateUser = useAuthStore(s => s.updateUser)
  const { profile, refetch, updateProfile, isSaving } = useCandidateProfile()
  const avatarUrl = profile?.avatarUrl ?? user?.avatarUrl ?? null
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [skillTags, setSkillTags] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      city: user?.city ?? '',
      headline: '',
      experienceLevel: 'entry',
      category: '',
      bio: '',
      linkedin: '',
      portfolio: '',
    },
  })

  // Hydrate the form from the real profile (backend) + local extras once loaded.
  useEffect(() => {
    if (!profile) return
    const extras = getCandidateExtras(user?.id)
    reset({
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      city: profile.city ?? user?.city ?? '',
      headline: profile.headline ?? '',
      experienceLevel: yearsToLevel(profile.experienceYears ?? 0),
      category: extras.category ?? '',
      bio: profile.bio ?? '',
      linkedin: extras.linkedin ?? '',
      portfolio: extras.portfolio ?? '',
    })
    setSkillTags((profile.skills ?? []).slice(0, MAX_PROFILE_SKILLS))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  function addSkill(raw: string) {
    const skill = raw.trim()
    if (!skill) return
    if (skillTags.length >= MAX_PROFILE_SKILLS) {
      toast({
        title: 'Skill limit reached',
        description: `You can add up to ${MAX_PROFILE_SKILLS} skills.`,
        variant: 'warning',
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

  async function handleAvatarPick(file: File) {
    const allowed = ['image/png', 'image/jpeg', 'image/webp']
    if (!allowed.includes(file.type)) {
      toast({ title: 'Invalid file', description: 'Use PNG, JPG, or WEBP.', variant: 'error' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum size is 5MB.', variant: 'error' })
      return
    }
    setIsUploadingAvatar(true)
    try {
      const { avatarUrl: url } = await uploadAvatar(file)
      updateUser({ avatarUrl: url })
      void refetch()
      toast({ title: 'Profile photo updated', variant: 'success' })
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    } finally {
      setIsUploadingAvatar(false)
      if (avatarInputRef.current) avatarInputRef.current.value = ''
    }
  }

  function handleFormKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    const target = e.target as HTMLElement
    if (e.key === 'Enter' && target.tagName === 'INPUT' && target.getAttribute('data-skill-input') !== 'true') {
      e.preventDefault()
    }
  }

  const city = watch('city')
  const experienceLevel = watch('experienceLevel')
  const category = watch('category')
  const profileSteps = computeProfileSteps(profile, user ?? null)
  const profileScore = scoreFromSteps(profileSteps)

  async function onSubmit(values: ProfileFormValues) {
    try {
      await updateProfile({
        headline: values.headline || undefined,
        bio: values.bio || undefined,
        skills: skillTags,
        experienceYears: levelToYears(values.experienceLevel as never),
        city: values.city || undefined,
      })
      updateUser({ fullName: values.fullName, phoneNumber: values.phoneNumber, city: values.city })
      saveCandidateExtras(user?.id, {
        category: values.category,
        linkedin: values.linkedin,
        portfolio: values.portfolio,
      })
      void refetch()
      toast({ title: 'Profile updated', description: 'Your changes have been saved.', variant: 'success' })
    } catch (err) {
      toast({
        title: 'Could not save profile',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown}>
      <PageHeader
        title="My Profile"
        description="Keep your profile up to date to get better job matches."
        actions={
          <Button type="submit" loading={isSaving}>
            <Save className="h-4 w-4" /> Save changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-6">
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  initials(user?.fullName ?? 'U')
                )}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 disabled:opacity-60"
                aria-label="Change profile photo"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                disabled={isUploadingAvatar}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleAvatarPick(file)
                }}
              />
            </div>
            <h3 className="mt-4 font-semibold">{user?.fullName}</h3>
            <p className="text-sm text-muted-foreground">{watch('headline')}</p>
            <p className="mt-2 text-xs text-muted-foreground">{user?.email}</p>
            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-3 text-xs text-muted-foreground"
                disabled={isUploadingAvatar}
                onClick={async () => {
                  try {
                    await deleteAvatar()
                    updateUser({ avatarUrl: undefined })
                    void refetch()
                    toast({ title: 'Profile photo removed', variant: 'success' })
                  } catch (err) {
                    toast({
                      title: 'Could not remove photo',
                      description: (err as { message?: string })?.message ?? 'Please try again.',
                      variant: 'error',
                    })
                  }
                }}
              >
                Remove photo
              </Button>
            )}
          </CardContent>
        </Card>

        <ProfileStrengthPanel profileScore={profileScore} profileSteps={profileSteps} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName?.message}>
                <Input {...register('fullName')} />
              </Field>
              <Field label="Professional headline" error={errors.headline?.message}>
                <Input {...register('headline')} placeholder="e.g. Senior Software Engineer" />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <Input type="email" {...register('email')} />
              </Field>
              <Field label="Phone number" error={errors.phoneNumber?.message}>
                <Input {...register('phoneNumber')} />
              </Field>
              <Field label="City" error={errors.city?.message}>
                <Select value={city} onValueChange={v => setValue('city', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAKISTAN_CITIES.map(c => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Experience level" error={errors.experienceLevel?.message}>
                <Select value={experienceLevel} onValueChange={v => setValue('experienceLevel', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map(l => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Primary field" error={errors.category?.message} className="sm:col-span-2">
                <Select value={category} onValueChange={v => setValue('category', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">About & skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Bio" error={errors.bio?.message}>
                <Textarea rows={4} {...register('bio')} placeholder="Tell employers about yourself…" />
              </Field>
              <Field label={`Skills (${skillTags.length}/${MAX_PROFILE_SKILLS})`}>
                <Input
                  data-skill-input="true"
                  value={skillInput}
                  disabled={skillTags.length >= MAX_PROFILE_SKILLS}
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
                  Press Enter to add each skill (max {MAX_PROFILE_SKILLS}). Saved when you click Save changes.
                </p>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Links</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="LinkedIn" error={errors.linkedin?.message}>
                <Input leftIcon={<Linkedin />} {...register('linkedin')} placeholder="https://linkedin.com/in/…" />
              </Field>
              <Field label="Portfolio / Website" error={errors.portfolio?.message}>
                <Input leftIcon={<Link2 />} {...register('portfolio')} placeholder="https://…" />
              </Field>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
