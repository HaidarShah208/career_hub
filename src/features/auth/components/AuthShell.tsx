import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Building2,
  LineChart,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react'

import { Logo } from '@/shared/components/common/Logo'
import { APP_NAME, ROUTES } from '@/shared/constants'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-powered matching',
    description: 'Get ranked job recommendations based on your skills, experience, and location.',
  },
  {
    icon: Zap,
    title: 'Apply in one click',
    description: 'Save time with instant applications to verified employers across Pakistan.',
  },
   
] as const

 

interface AuthShellProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      {/* Brand panel — full viewport height, no footer gap */}
      <div className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-800 via-primary-600 to-emerald-600 p-10 xl:p-14 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.12),_transparent_45%)]" />
        </div>

        <Link to={ROUTES.home} className="relative z-10 inline-flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 shadow-lg backdrop-blur">
            <Briefcase className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
        </Link>

        <div className="relative z-10 my-10 space-y-8">
          <div className="space-y-3">
            
            <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
              Build your career with Pakistan&apos;s smartest job platform
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-white/80">
              Discover roles that fit your profile, apply faster, and manage your entire job search
              from one modern workspace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title: featureTitle, description }) => (
              <div
                key={featureTitle}
                className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur transition-colors hover:bg-white/15"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-3 text-sm font-semibold">{featureTitle}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/75">{description}</p>
              </div>
            ))}
          </div>

         
        </div>

        <p className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo size="md" />
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
