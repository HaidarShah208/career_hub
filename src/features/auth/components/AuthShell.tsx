import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, CheckCircle2, Quote } from 'lucide-react'

import { Logo } from '@/shared/components/common/Logo'
import { APP_NAME, ROUTES } from '@/shared/constants'

const HIGHLIGHTS = [
  'AI-powered job matching tailored to your skills',
  '1-click apply to thousands of verified jobs',
  'Free resume builder & AI feedback',
  'Real-time application tracking',
]

interface AuthShellProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-emerald-600 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_50%)]" />
        <Link to={ROUTES.home} className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
            <Briefcase className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
        </Link>
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            Your next career move starts here.
          </h2>
          <ul className="space-y-3">
            {HIGHLIGHTS.map(item => (
              <li key={item} className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="h-5 w-5 shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-white/10 p-5 backdrop-blur">
            <Quote className="h-6 w-6 text-white/70" />
            <p className="mt-2 text-sm text-white/90">
              “I found my dream job at a top tech company within two weeks. The AI matching is genuinely impressive.”
            </p>
            <p className="mt-3 text-sm font-semibold">— Ayesha M., Software Engineer</p>
          </div>
        </div>
        <p className="relative z-10 text-sm text-white/70">
          © {new Date().getFullYear()} {APP_NAME}
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo size="md" />
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
