import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Camera, Save } from 'lucide-react'

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
import { MOCK_COMPANIES } from '@/shared/services/mock-data'
import { PAKISTAN_CITIES } from '@/shared/constants'
import { companyProfileSchema, type CompanyProfileFormValues } from '../schemas'

const company = MOCK_COMPANIES[2]
const INDUSTRIES = ['Software', 'IT Services', 'Banking', 'Telecom', 'E-Commerce', 'FMCG', 'Healthcare', 'Education']
const SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000-5000', '5000+']

export default function CompanyProfilePage() {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      name: company.name,
      industry: 'Software',
      city: company.city,
      size: company.size,
      website: company.website,
      founded: company.founded,
      description: company.description,
    },
  })

  async function onSubmit() {
    await new Promise(r => setTimeout(r, 600))
    toast({ title: 'Company profile saved', variant: 'success' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title="Company Profile"
        description="This information is shown to candidates on your job listings."
        actions={
          <Button type="submit" loading={isSubmitting}>
            <Save className="h-4 w-4" /> Save
          </Button>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-end">
            <div className="relative">
              <img src={company.logoUrl} alt="" className="h-20 w-20 rounded-xl border border-border object-cover" />
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
                aria-label="Change logo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold">{watch('name')}</p>
              <p className="text-sm text-muted-foreground">Upload a square logo (min 200×200px)</p>
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
