import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Linkedin, Link2, Save } from 'lucide-react'

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
import { FileUpload } from '@/shared/components/common/FileUpload'
import { useToast } from '@/shared/components/ui/toast'
import { useAuthStore } from '@/app/store/auth.store'
import { EXPERIENCE_LEVELS, JOB_CATEGORIES, PAKISTAN_CITIES } from '@/shared/constants'
import { initials } from '@/shared/lib/utils'
import { uploadAvatar, deleteAvatar } from '@/shared/services/uploads.api'
import { useCandidateProfile } from '../hooks/useCandidateProfile'
import { levelToYears, yearsToLevel } from '../lib/profile'
import { getCandidateExtras, saveCandidateExtras } from '../lib/extras'
import { profileSchema, type ProfileFormValues } from '../schemas'

export default function CandidateProfilePage() {
  const { toast } = useToast()
  const user = useAuthStore(s => s.user)
  const updateUser = useAuthStore(s => s.updateUser)
  const { profile, refetch, updateProfile, isSaving } = useCandidateProfile()
  const avatarUrl = profile?.avatarUrl ?? user?.avatarUrl ?? null

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
      skills: '',
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
      skills: (profile.skills ?? []).join(', '),
      linkedin: extras.linkedin ?? '',
      portfolio: extras.portfolio ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const city = watch('city')
  const experienceLevel = watch('experienceLevel')
  const category = watch('category')

  async function onSubmit(values: ProfileFormValues) {
    try {
      await updateProfile({
        headline: values.headline || undefined,
        bio: values.bio || undefined,
        skills: (values.skills ?? '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
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
    <form onSubmit={handleSubmit(onSubmit)}>
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
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                initials(user?.fullName ?? 'U')
              )}
            </div>
            <h3 className="mt-4 font-semibold">{user?.fullName}</h3>
            <p className="text-sm text-muted-foreground">{watch('headline')}</p>
            <p className="mt-2 text-xs text-muted-foreground">{user?.email}</p>

            <FileUpload
              className="mt-5 w-full text-left"
              accept="image/png,image/jpeg,image/webp"
              hint="PNG, JPG, JPEG, WEBP up to 5MB"
              maxSizeMB={5}
              variant="image"
              currentUrl={avatarUrl}
              fileName="Profile photo"
              upload={async (file, onProgress) => {
                const { avatarUrl: url } = await uploadAvatar(file, onProgress)
                updateUser({ avatarUrl: url })
                void refetch()
                return url
              }}
              onRemove={async () => {
                await deleteAvatar()
                updateUser({ avatarUrl: undefined })
                void refetch()
              }}
            />
          </CardContent>
        </Card>

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
              <Field label="Skills (comma separated)" error={errors.skills?.message}>
                <Input {...register('skills')} placeholder="React, TypeScript, Node.js" />
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
