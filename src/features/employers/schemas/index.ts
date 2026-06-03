import { z } from 'zod'

export const postJobSchema = z
  .object({
    title: z.string().min(4, 'Job title is too short'),
    category: z.string().min(1, 'Select a category'),
    city: z.string().min(1, 'Select a city'),
    workMode: z.string().min(1, 'Select a work mode'),
    jobType: z.string().min(1, 'Select a job type'),
    experienceLevel: z.string().min(1, 'Select an experience level'),
    salaryMin: z.coerce.number().min(0, 'Enter a valid amount'),
    salaryMax: z.coerce.number().min(0, 'Enter a valid amount'),
    description: z.string().min(30, 'Description should be at least 30 characters'),
    skills: z.string().min(1, 'Add at least one skill'),
    isUrgent: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  })
  .refine(d => d.salaryMax >= d.salaryMin, {
    path: ['salaryMax'],
    message: 'Max salary must be greater than min salary',
  })
export type PostJobFormValues = z.infer<typeof postJobSchema>

export const companyProfileSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  industry: z.string().min(1, 'Select an industry'),
  city: z.string().min(1, 'Select a city'),
  size: z.string().min(1, 'Select company size'),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  founded: z.coerce.number().min(1900).max(new Date().getFullYear()),
  description: z.string().min(20, 'Tell candidates about your company'),
})
export type CompanyProfileFormValues = z.infer<typeof companyProfileSchema>
