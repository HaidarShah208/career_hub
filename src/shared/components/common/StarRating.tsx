import { Star } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md'
  showValue?: boolean
  className?: string
}

export function StarRating({ rating, max = 5, size = 'sm', showValue, className }: StarRatingProps) {
  const dim = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: max }, (_, i) => {
          const filled = i + 1 <= Math.round(rating)
          return (
            <Star
              key={i}
              className={cn(dim, filled ? 'fill-warning text-warning' : 'fill-muted text-muted')}
            />
          )
        })}
      </div>
      {showValue && <span className="text-xs font-medium text-muted-foreground">{rating.toFixed(1)}</span>}
    </div>
  )
}
