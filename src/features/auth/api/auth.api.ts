import { MOCK_USERS } from '@/shared/services/mock-data'
import { sleep } from '@/shared/lib/utils'
import type { User, UserRole } from '@/shared/types'
import type { LoginFormValues, RegisterFormValues } from '../schemas'

export interface AuthResult {
  user: User
  token: string
}

function fakeToken(userId: string): string {
  return `mock.jwt.${userId}.${Date.now()}`
}

/**
 * Mock auth API. Any password is accepted for the seeded demo accounts.
 * Replace with real `http.post('/auth/login', ...)` calls when wiring a backend.
 */
export async function login(values: LoginFormValues): Promise<AuthResult> {
  await sleep(700)
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === values.email.toLowerCase())
  if (!user) {
    throw new Error('No account found with that email. Try candidate@demo.pk')
  }
  return { user, token: fakeToken(user.id) }
}

export async function register(values: RegisterFormValues): Promise<AuthResult> {
  await sleep(900)
  const existing = MOCK_USERS.find(u => u.email.toLowerCase() === values.email.toLowerCase())
  if (existing) {
    throw new Error('An account with this email already exists.')
  }
  const user: User = {
    id: `user_${Date.now()}`,
    email: values.email,
    fullName: values.fullName,
    role: values.role as UserRole,
    phoneNumber: values.phoneNumber,
    isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return { user, token: fakeToken(user.id) }
}

export async function requestPasswordReset(email: string): Promise<void> {
  await sleep(700)
  if (!email) throw new Error('Email is required')
}

export async function resetPassword(_password: string): Promise<void> {
  await sleep(700)
}

export async function verifyEmail(_code: string): Promise<void> {
  await sleep(1200)
}
