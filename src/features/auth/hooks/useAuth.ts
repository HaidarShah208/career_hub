import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/app/store/auth.store'
import { useToast } from '@/shared/components/ui/toast'
import { ROUTES } from '@/shared/constants'
import type { UserRole } from '@/shared/types'
import * as authApi from '../api/auth.api'
import type { LoginFormValues, RegisterFormValues } from '../schemas'

function dashboardForRole(role: UserRole): string {
  switch (role) {
    case 'employer':
      return ROUTES.employerDashboard
    case 'admin':
      return ROUTES.adminDashboard
    default:
      return ROUTES.candidateDashboard
  }
}

/** Extracts a human-readable message from either an Error or an ApiError. */
function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: unknown }).message ?? fallback)
  }
  return fallback
}

export function useAuth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const setAuth = useAuthStore(s => s.setAuth)
  const logout = useAuthStore(s => s.logout)
  const [isLoading, setIsLoading] = useState(false)

  async function signIn(values: LoginFormValues) {
    setIsLoading(true)
    try {
      const { user, token } = await authApi.login(values)
      setAuth(user, token)
      toast({ title: `Welcome back, ${user.fullName.split(' ')[0]}!`, variant: 'success' })
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? dashboardForRole(user.role), { replace: true })
    } catch (err) {
      toast({
        title: 'Sign in failed',
        description: getErrorMessage(err, 'Invalid email or password.'),
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function signUp(values: RegisterFormValues) {
    setIsLoading(true)
    try {
      const result = await authApi.register(values)
      toast({
        title: 'Account created',
        description: result.message,
        variant: 'success',
      })
      navigate(ROUTES.verifyEmail, { replace: true, state: { email: result.email } })
    } catch (err) {
      toast({
        title: 'Registration failed',
        description: getErrorMessage(err, 'Please try again.'),
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  function signOut() {
    void authApi.logout()
    logout()
    toast({ title: 'Signed out', variant: 'info' })
    navigate(ROUTES.home)
  }

  async function deleteAccount(): Promise<void> {
    await authApi.deleteAccount()
    logout()
    navigate(ROUTES.home, { replace: true })
  }

  return { signIn, signUp, signOut, deleteAccount, isLoading }
}
