import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Building2,
  Globe,
  MapPin,
  Pencil,
  Save,
  Users,
  X,
} from 'lucide-react'

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
import { PageLoader } from '@/shared/components/common/PageLoader'
import { useToast } from '@/shared/components/ui/toast'
import { CompanyLogoPicker } from '../components/CompanyLogoPicker'
import { useEmployerCompany } from '../hooks/useEmployerCompany'
import { PAKISTAN_CITIES } from '@/shared/constants'
import { companyProfileSchema, type CompanyProfileFormValues } from '../schemas'

const INDUSTRIES = ['Software', 'IT Services', 'Banking', 'Telecom', 'E-Commerce', 'FMCG', 'Healthcare', 'Education']
const SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000-5000', '5000+']

const EMPTY: CompanyProfileFormValues = {
  name: '',
  industry: 'Software',
  city: 'Lahore',
  size: '11-50',
  website: '',
  founded: new Date().getFullYear(),
  description: '',
}

function companyToForm(company: NonNullable<ReturnType<typeof useEmployerCompany>['company']>): CompanyProfileFormValues {
  return {
    name: company.name,
    industry: company.industry || 'Software',
    city: company.city || 'Lahore',
    size: company.size && company.size !== '—' ? company.size : '11-50',
    website: company.website || '',
    founded: company.founded || new Date().getFullYear(),
    description: company.description || '',
  }
}

export default function CompanyProfilePage() {
  const { toast } = useToast()
  const { company, hasCompany, isLoading, saveCompany } = useEmployerCompany()
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: EMPTY,
  })

  useEffect(() => {
    if (!isLoading) {
      setIsEditing(!hasCompany)
    }
  }, [hasCompany, isLoading])

  useEffect(() => {
    if (company && isEditing) {
      reset(companyToForm(company))
    }
  }, [company, isEditing, reset])

  function startEditing() {
    if (company) reset(companyToForm(company))
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    if (company) reset(companyToForm(company))
  }

  async function onSubmit(values: CompanyProfileFormValues) {
    try {
      await saveCompany({
        name: values.name,
        industry: values.industry,
        companySize: values.size,
        location: values.city,
        website: values.website || undefined,
        foundedYear: values.founded,
        description: values.description,
      })
      toast({
        title: hasCompany ? 'Company profile saved' : 'Company created',
        variant: 'success',
      })
      setIsEditing(false)
    } catch (err) {
      toast({
        title: 'Could not save company',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  if (isLoading) return <PageLoader />

  if (hasCompany && company && !isEditing) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Company Profile"
          description="Your company information shown to candidates on job listings."
          actions={
            <Button type="button" onClick={startEditing}>
              <Pencil className="h-4 w-4" /> Edit profile
            </Button>
          }
        />

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
              <CompanyLogoPicker logoUrl={company.logoUrl} />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight">{company.name}</h2>
                  <Badge variant={company.isVerified ? 'default' : 'secondary'}>
                    {company.isVerified ? 'Verified' : 'Pending verification'}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> {company.industry}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {company.size} employees
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {company.city || '—'}
                  </span>
                  {company.founded > 0 && <span>Est. {company.founded}</span>}
                </div>
                {company.website && (
                  <a
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" /> {company.website}
                  </a>
                )}
              </div>
            </div>
            {company.description && (
              <div className="border-t border-border bg-muted/20 px-6 py-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{company.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title={hasCompany ? 'Edit company profile' : 'Create company profile'}
        description={
          hasCompany
            ? 'Update your company details.'
            : 'Create your company profile to start posting jobs.'
        }
        actions={
          <div className="flex gap-2">
            {hasCompany && (
              <Button type="button" variant="outline" onClick={cancelEditing}>
                <X className="h-4 w-4" /> Cancel
              </Button>
            )}
            <Button type="submit" loading={isSubmitting}>
              <Save className="h-4 w-4" /> {hasCompany ? 'Save changes' : 'Create company'}
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" /> Company details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block">Company name</Label>
              <Input {...register('name')} />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <Label className="mb-1.5 block">Industry</Label>
              <Select value={watch('industry')} onValueChange={(v) => setValue('industry', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Company size</Label>
              <Select value={watch('size')} onValueChange={(v) => setValue('size', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s} employees
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">City</Label>
              <Select value={watch('city')} onValueChange={(v) => setValue('city', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {PAKISTAN_CITIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Founded year</Label>
              <Input type="number" {...register('founded')} />
              {errors.founded && (
                <p className="mt-1 text-xs text-destructive">{errors.founded.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block">Website</Label>
              <Input {...register('website')} placeholder="https://company.com.pk" />
              {errors.website && (
                <p className="mt-1 text-xs text-destructive">{errors.website.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block">About the company</Label>
              <Textarea rows={5} {...register('description')} />
              {errors.description && (
                <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
