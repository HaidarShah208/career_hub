import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Building2, Save } from 'lucide-react'

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
import { useEmployerCompany, employerCompanyKeys } from '../hooks/useEmployerCompany'
import { uploadCompanyLogo, deleteCompanyLogo } from '@/shared/services/uploads.api'
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

export default function CompanyProfilePage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { company, hasCompany, isLoading, saveCompany } = useEmployerCompany()
  const refreshCompany = () =>
    queryClient.invalidateQueries({ queryKey: employerCompanyKeys.company })

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
    if (company) {
      reset({
        name: company.name,
        industry: company.industry || 'Software',
        city: company.city || 'Lahore',
        size: company.size && company.size !== '—' ? company.size : '11-50',
        website: company.website || '',
        founded: company.founded || new Date().getFullYear(),
        description: company.description || '',
      })
    }
  }, [company, reset])

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
    } catch (err) {
      toast({
        title: 'Could not save company',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  const logoUrl =
    company?.logoUrl ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(watch('name') || 'Company')}&backgroundColor=16a34a&textColor=ffffff`

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title="Company Profile"
        description={
          hasCompany
            ? 'This information is shown to candidates on your job listings.'
            : 'Create your company profile to start posting jobs.'
        }
        actions={
          <Button type="submit" loading={isSubmitting || isLoading}>
            <Save className="h-4 w-4" /> {hasCompany ? 'Save' : 'Create company'}
          </Button>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
            <img
              src={logoUrl}
              alt=""
              className="h-20 w-20 shrink-0 rounded-xl border border-border object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold">{watch('name') || 'Your company'}</p>
              <p className="mb-3 text-sm text-muted-foreground">
                Upload a square logo (min 200×200px). Shown on your job listings.
              </p>
              <FileUpload
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                hint="PNG, JPG, SVG, WEBP up to 5MB"
                maxSizeMB={5}
                variant="image"
                currentUrl={company?.logoUrl ?? null}
                fileName="Company logo"
                disabled={!hasCompany}
                disabledHint="Create your company profile first"
                upload={async (file, onProgress) => {
                  const { logoUrl: url } = await uploadCompanyLogo(file, onProgress)
                  void refreshCompany()
                  return url
                }}
                onRemove={async () => {
                  await deleteCompanyLogo()
                  void refreshCompany()
                }}
              />
            </div>
          </CardContent>
        </Card>

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
              <Select value={watch('industry')} onValueChange={v => setValue('industry', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map(i => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Company size</Label>
              <Select value={watch('size')} onValueChange={v => setValue('size', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map(s => (
                    <SelectItem key={s} value={s}>
                      {s} employees
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">City</Label>
              <Select value={watch('city')} onValueChange={v => setValue('city', v)}>
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
            </div>
            <div>
              <Label className="mb-1.5 block">Founded year</Label>
              <Input type="number" {...register('founded')} />
              {errors.founded && <p className="mt-1 text-xs text-destructive">{errors.founded.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block">Website</Label>
              <Input {...register('website')} placeholder="https://company.com.pk" />
              {errors.website && <p className="mt-1 text-xs text-destructive">{errors.website.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block">About the company</Label>
              <Textarea rows={5} {...register('description')} />
              {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
