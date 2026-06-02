export type UserRole = 'candidate' | 'employer' | 'admin'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  avatarUrl?: string
  phoneNumber?: string
  city?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

export type Theme = 'light' | 'dark' | 'system'

export interface SelectOption<T = string> {
  value: T
  label: string
  icon?: string
  disabled?: boolean
}
