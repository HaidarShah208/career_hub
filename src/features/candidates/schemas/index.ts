import { z } from 'zod'

export const profileSchema = z.object({
  fullName: z.string().min(3, 'Name is too short'),
  headline: z.string().max(120, 'Keep it under 120 characters').optional(),
  email: z.string().email('Invalid email'),
  phoneNumber: z.string().min(10, 'Enter a valid phone number'),
  city: z.string().min(1, 'Select a city'),
  experienceLevel: z.string().min(1, 'Select experience level'),
  category: z.string().min(1, 'Select a field'),
  bio: z.string().max(1000, 'Bio is too long').optional(),
  skills: z.string().optional(),
  linkedin: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Enter a valid URL').optional().or(z.literal('')),
})
export type ProfileFormValues = z.infer<typeof profileSchema>

export const jobAlertSchema = z.object({
  keyword: z.string().min(2, 'Enter a keyword'),
  city: z.string().optional(),
  category: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'instant']),
})
export type JobAlertFormValues = z.infer<typeof jobAlertSchema>
