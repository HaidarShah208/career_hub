import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Mail, MailCheck } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { AuthShell } from '../components/AuthShell'
import { requestPasswordReset } from '../api/auth.api'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas'
import { ROUTES } from '@/shared/constants'
import { useToast } from '@/shared/components/ui/toast'

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      await requestPasswordReset(values.email)
      setEmail(values.email)
      setSent(true)
    } catch (err) {
      toast({
        title: 'Could not send reset link',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  return (
    <AuthShell
      title={sent ? 'Check your inbox' : 'Forgot your password?'}
      subtitle={sent ? undefined : 'Enter your email and we’ll send you a reset link.'}
      footer={
        <Link to={ROUTES.login} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-lg border border-border bg-muted/40 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <MailCheck className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{email}</span>, we’ve sent a
            password reset link. The link expires in 30 minutes.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 w-full"
            loading={isSubmitting}
            onClick={() => void onSubmit({ email })}
          >
            Resend link
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" leftIcon={<Mail />} {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
