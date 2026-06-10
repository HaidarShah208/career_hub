import { Briefcase } from 'lucide-react'

import { APP_NAME } from '@/shared/constants'
import { cn } from '@/shared/lib/utils'

interface AppSplashProps {
  className?: string
  message?: string
}

/** Full-screen bootstrap loader shown while the app validates the session. */
export function AppSplash({ className, message = 'Loading your workspace…' }: AppSplashProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background',
        className,
      )}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_theme(colors.primary.500/0.14),_transparent_55%)]" />

      <div className="relative flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <span className="absolute inset-2 animate-pulse rounded-full bg-primary/10" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground shadow-lg shadow-primary/25">
          <Briefcase className="h-7 w-7" />
        </span>
      </div>

      <p className="mt-8 text-lg font-semibold tracking-tight">{APP_NAME}</p>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>

      <div className="mt-8 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
