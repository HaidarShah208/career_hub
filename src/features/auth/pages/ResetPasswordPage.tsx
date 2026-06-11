import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { AuthShell } from '../components/AuthShell'
import { resetPassword } from '../api/auth.api'
import { useToast } from '@/shared/components/ui/toast'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas'
import { ROUTES } from '@/shared/constants'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim() ?? ''
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) })

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      toast({
        title: 'Invalid reset link',
        description: 'Request a new password reset link and try again.',
        variant: 'error',
      })
      return
    }

    try {
      const result = await resetPassword(token, values.password)
      toast({
        title: 'Password reset!',
        description: result.message ?? 'You can now sign in with your new password.',
        variant: 'success',
      })
      navigate(ROUTES.login)
    } catch (err) {
      toast({
        title: 'Could not reset password',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  if (!token) {
    return (
      <AuthShell
        title="Invalid reset link"
        subtitle="This link is missing or incomplete. Request a new one from the sign-in page."
        footer={
          <Link to={ROUTES.forgotPassword} className="font-medium text-primary hover:underline">
            Request new link
          </Link>
        }
      >
        <Button asChild className="w-full">
          <Link to={ROUTES.login}>Back to sign in</Link>
        </Button>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you haven’t used before."
      footer={
        <Link to={ROUTES.login} className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 8 characters"
            leftIcon={<Lock />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="pointer-events-auto"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            }
            {...register('password')}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Re-enter password"
            leftIcon={<Lock />}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          Reset password
        </Button>
      </form>
    </AuthShell>
  )
}
