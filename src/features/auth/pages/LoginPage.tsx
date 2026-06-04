import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { AuthShell } from '../components/AuthShell'
import { useAuth } from '../hooks/useAuth'
import { loginSchema, type LoginFormValues } from '../schemas'
import { ROUTES } from '@/shared/constants'

const DEMO_ACCOUNTS = [
  { role: 'Candidate', email: 'candidate@demo.pk' },
  { role: 'Employer', email: 'employer@demo.pk' },
  { role: 'Admin', email: 'admin@demo.pk' },
]

export default function LoginPage() {
  const { signIn, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  })

  function fillDemo(email: string) {
    setValue('email', email)
    setValue('password', 'Demo1234')
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your job search."
      footer={
        <>
          Don’t have an account?{' '}
          <Link to={ROUTES.register} className="font-medium text-primary hover:underline">
            Sign up free
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(signIn)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail />}
            error={errors.email?.message}
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to={ROUTES.forgotPassword} className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={<Lock />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="pointer-events-auto"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox defaultChecked onCheckedChange={v => setValue('remember', Boolean(v))} />
          Remember me for 30 days
        </label>

        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          Sign in
        </Button>
      </form>

 
    </AuthShell>
  )
}
