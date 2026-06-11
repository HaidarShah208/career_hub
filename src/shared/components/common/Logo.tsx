import { Link } from 'react-router-dom'
import { Briefcase } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

interface LogoProps {
  className?: string
  iconClassName?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, iconClassName, showText = true, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 'h-7 w-7', text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 'h-9 w-9', text: 'text-lg', sub: 'text-[11px]' },
    lg: { icon: 'h-11 w-11', text: 'text-xl', sub: 'text-xs' },
  }
  const s = sizes[size]

  return (
    <Link to="/" className={cn('flex items-center gap-2.5 group', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-emerald-700 text-white shadow-md transition-transform group-hover:scale-105',
          s.icon,
          iconClassName,
        )}
      >
        <Briefcase className="h-1/2 w-1/2" strokeWidth={2.5} />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-bold tracking-tight text-foreground', s.text)}>
            Pakistan <span className="text-primary">Career</span> Hub
          </span>
          
        </div>
      )}
    </Link>
  )
}
