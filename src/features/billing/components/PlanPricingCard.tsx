import { Check } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { cn, formatPKR } from '@/shared/lib/utils'
import type { Plan } from '../api/billing.api'
import { planFeatures } from '../hooks/useBilling'

interface PlanPricingCardProps {
  plan: Plan
  isCurrent: boolean
  isPending: boolean
  isSelected: boolean
  isPopular: boolean
  disabled: boolean
  isFree: boolean
  loading?: boolean
  onSelect: () => void
  onActivateFree: () => void
  onStripe: () => void
}

export function PlanPricingCard({
  plan,
  isCurrent,
  isPending,
  isSelected,
  isPopular,
  disabled,
  isFree,
  loading,
  onSelect,
  onActivateFree,
  onStripe,
}: PlanPricingCardProps) {
  const dark = isCurrent
  const selectedHighlight = isSelected && !isCurrent
  const elevated = isCurrent || isPopular || selectedHighlight

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 transition-all',
        dark
          ? 'z-10 -mt-2 border-primary bg-primary text-primary-foreground shadow-xl dark:bg-primary/75 dark:text-white lg:min-h-[420px]'
          : selectedHighlight
            ? 'z-[1] border-primary/40 bg-primary/8 text-foreground shadow-md dark:border-primary/50 dark:bg-primary/25 dark:text-white lg:min-h-[400px]'
            : cn(
                'border-border bg-card text-card-foreground shadow-sm lg:min-h-[380px]',
                isPopular && 'border-primary/40 shadow-md',
              ),
        elevated && !dark && !selectedHighlight && '-mt-1',
        selectedHighlight && '-mt-1',
      )}
    >
      {isCurrent && (
        <Badge className="absolute -top-3 border border-border right-4 bg-primary-foreground text-primary">
          Current plan
        </Badge>
      )}
      {!isCurrent && isPopular && (
        <Badge className="absolute -top-3 right-4 border-0 bg-primary text-primary-foreground">
          Most popular
        </Badge>
      )}
      {isPending && (
        <Badge
          variant="secondary"
          className={cn('absolute -top-3 left-4', dark && 'bg-primary-foreground/20 text-primary-foreground')}
        >
          Payment pending
        </Badge>
      )}

      <div className="mb-1">
        <p
          className={cn(
            'text-3xl font-bold tracking-tight',
            dark && 'text-primary-foreground dark:text-white',
            selectedHighlight && 'dark:text-white',
            !dark && !selectedHighlight && 'text-foreground',
          )}
        >
          {formatPKR(plan.price)}
          <span
            className={cn(
              'ml-1 text-sm font-normal',
              dark ? 'text-primary-foreground/80 dark:text-white/80' : 'text-muted-foreground',
              selectedHighlight && 'dark:text-white/75',
            )}
          >
            /mo
          </span>
        </p>
      </div>

      <h3
        className={cn(
          'py-3 text-base font-bold md:text-lg lg:text-2xl',
          (dark || selectedHighlight) && 'dark:text-white',
        )}
      >
        {plan.name}
      </h3>
      {plan.description && (
        <p
          className={cn(
            'mt-1 text-sm leading-relaxed',
            dark ? 'text-primary-foreground/85 dark:text-white/85' : 'text-muted-foreground',
            selectedHighlight && 'dark:text-white/80',
          )}
        >
          {plan.description}
        </p>
      )}

      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {planFeatures(plan).map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check
              className={cn(
                'mt-0.5 h-4 w-4 shrink-0',
                dark ? 'text-primary-foreground dark:text-white' : 'text-primary',
                selectedHighlight && 'dark:text-white',
              )}
            />
            <span
              className={cn(
                dark && 'text-primary-foreground/95 dark:text-white/95',
                selectedHighlight && 'dark:text-white/95',
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2">
        {isFree ? (
          <Button
            className={cn(
              'w-full',
              dark && 'bg-primary-foreground text-primary hover:bg-primary-foreground/90',
            )}
            variant={dark ? 'secondary' : 'default'}
            disabled={disabled || loading || isCurrent || isPending}
            loading={loading}
            onClick={onActivateFree}
          >
            {isCurrent ? 'Current plan' : 'Activate free plan'}
          </Button>
        ) : (
          <>
            <Button
              className={cn(
                'w-full',
                dark && 'bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/25 dark:text-white',
                selectedHighlight &&
                  'border-primary/30 bg-primary/15 text-primary hover:bg-primary/25 dark:border-white/20 dark:bg-white/15 dark:text-white dark:hover:bg-white/25',
                isPopular && !dark && isSelected && 'bg-primary text-primary-foreground',
              )}
              variant={isCurrent || isSelected ? 'default' : 'outline'}
              disabled={disabled || loading || isCurrent || isPending}
              onClick={onSelect}
            >
              {isCurrent ? 'Current plan' : isPending ? 'Payment pending' : isSelected ? 'Selected' : 'Choose plan'}
            </Button>
            {!isCurrent && !isPending && (
              <Button
                className={cn(
                  'w-full border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20',
                  dark && 'border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25',
                )}
                variant="ghost"
                size="sm"
                disabled={disabled || loading}
                onClick={onStripe}
              >
                Pay with Stripe
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
