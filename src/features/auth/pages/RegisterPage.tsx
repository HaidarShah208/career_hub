import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Briefcase, Eye, EyeOff, Lock, Mail, Phone, User, UserSearch } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { AuthShell } from '../components/AuthShell'
import { useAuth } from '../hooks/useAuth'
import { registerSchema, type RegisterFormValues } from '../schemas'
import { ROUTES } from '@/shared/constants'
import { cn } from '@/shared/lib/utils'

const ROLE_OPTIONS = [
  { value: 'candidate', label: 'I’m looking for a job', icon: UserSearch },
  { value: 'employer', label: 'I’m hiring talent', icon: Briefcase },
] as const

export default function RegisterPage() {
  const { signUp, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'candidate', agree: undefined },
  })

  const role = watch('role')

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join 2 million+ professionals on Pakistan Career Hub."
      footer={
        <>
          Already have an account?{' '}
          <Link to={ROUTES.login} className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(signUp)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {ROLE_OPTIONS.map(opt => {
            const Icon = opt.icon
            const active = role === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('role', opt.value)}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all',
                  active
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/40',
                )}
              >
                <Icon className={cn('h-5 w-5', active ? 'text-primary' : 'text-muted-foreground')} />
                <span className="font-medium">{opt.label}</span>
              </button>
            )
          })}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" placeholder="Ali Ahmed" leftIcon={<User />} {...register('fullName')} />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" leftIcon={<Mail />} {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phoneNumber">Phone number</Label>
          <Input id="phoneNumber" placeholder="+92 300 1234567" leftIcon={<Phone />} {...register('phoneNumber')} />
          {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <Checkbox className="mt-0.5" onCheckedChange={v => setValue('agree', v === true ? true : (undefined as never))} />
          <span>
            I agree to the{' '}
            <Link to={ROUTES.terms} className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to={ROUTES.privacy} className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.agree && <p className="text-xs text-destructive">{errors.agree.message}</p>}

        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}
