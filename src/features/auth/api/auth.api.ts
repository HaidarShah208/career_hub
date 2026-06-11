import http, { unwrap } from '@/shared/services/http'
import { STORAGE_KEYS } from '@/shared/constants'
import type { User, UserRole } from '@/shared/types'
import type { LoginFormValues, RegisterFormValues } from '../schemas'

export interface AuthResult {
  user: User
  token: string
}

/** Shape of the user object returned by the backend. */
interface BackendUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE'
  isActive: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

interface SignInResponse extends BackendUser {}

interface AuthPayload {
  user: BackendUser
  accessToken: string
  refreshToken: string
}

/** Maps the backend user representation to the frontend `User` model. */
export function mapUser(backend: BackendUser): User {
  return {
    id: backend.id,
    email: backend.email,
    fullName: `${backend.firstName} ${backend.lastName}`.trim(),
    role: backend.role.toLowerCase() as UserRole,
    isVerified: backend.emailVerified,
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt,
  }
}

function storeRefreshToken(token: string | undefined) {
  if (token) localStorage.setItem(STORAGE_KEYS.refreshToken, token)
}

/**
 * Real backend sign-in. In Phase 1 only the seeded admin account can sign in
 * (POST /api/v1/auth/signin). The access token is returned to the caller and
 * the refresh token is persisted for later token refresh.
 */
export async function login(values: LoginFormValues): Promise<AuthResult> {
  const res = await http.post('/auth/signin', {
    email: values.email,
    password: values.password,
  })
  const payload = unwrap<AuthPayload>(res)
  storeRefreshToken(payload.refreshToken)
  return { user: mapUser(payload.user), token: payload.accessToken }
}

/** Validates the current session and returns the authenticated user. */
export async function me(): Promise<User> {
  const res = await http.get('/auth/me')
  return mapUser(unwrap<SignInResponse>(res))
}

/** Revokes the current refresh token on the backend (best-effort). */
export async function logout(): Promise<void> {
  try {
    await http.post('/auth/logout')
  } catch {
    // Ignore network/expired-token errors during logout.
  } finally {
    localStorage.removeItem(STORAGE_KEYS.refreshToken)
  }
}

/** Permanently deletes the authenticated account and all related data. */
export async function deleteAccount(): Promise<void> {
  await http.delete('/users/me')
  localStorage.removeItem(STORAGE_KEYS.refreshToken)
}

/** Exchanges the stored refresh token for a fresh access token. */
export async function refresh(): Promise<string | null> {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken)
  if (!refreshToken) return null
  const res = await http.post('/auth/refresh', { refreshToken })
  const payload = unwrap<{ accessToken: string; refreshToken: string }>(res)
  storeRefreshToken(payload.refreshToken)
  localStorage.setItem(STORAGE_KEYS.authToken, payload.accessToken)
  return payload.accessToken
}

/**
 * Self-registration. Candidates register via `/auth/signup`; employers via
 * `/employers/signup`. Both return the same auth payload (user + tokens).
 */
export interface RegisterResult {
  message: string
  email: string
}

export async function register(values: RegisterFormValues): Promise<RegisterResult> {
  const parts = values.fullName.trim().split(/\s+/)
  const firstName = parts[0] ?? values.fullName.trim()
  const lastName = parts.slice(1).join(' ') || firstName
  const body = { firstName, lastName, email: values.email, password: values.password }
  const endpoint = values.role === 'employer' ? '/employers/signup' : '/auth/signup'
  const res = await http.post(endpoint, body)
  const payload = unwrap<{ message: string; email: string }>(res)
  return { message: payload.message, email: payload.email }
}

export async function verifyEmailByToken(token: string): Promise<{ message: string }> {
  const res = await http.post('/auth/verify-email', { token })
  return unwrap(res)
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  const res = await http.post('/auth/resend-verification', { email })
  return unwrap(res)
}

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  const res = await http.post('/auth/forgot-password', { email })
  return unwrap(res)
}

export async function resetPassword(token: string, password: string): Promise<{ message: string }> {
  const res = await http.post('/auth/reset-password', { token, password })
  return unwrap(res)
}
