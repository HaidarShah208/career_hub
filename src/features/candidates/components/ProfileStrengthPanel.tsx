import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Progress } from '@/shared/components/ui/progress'
import { ROUTES } from '@/shared/constants'
import type { ProfileStep } from '../lib/profile'

interface ProfileStrengthPanelProps {
  profileScore: number
  profileSteps: ProfileStep[]
  showCompleteLink?: boolean
}

export function ProfileStrengthPanel({
  profileScore,
  profileSteps,
  showCompleteLink = false,
}: ProfileStrengthPanelProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile strength</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{profileScore}%</span>
            <Badge variant={profileScore >= 80 ? 'success' : 'warning'}>
              {profileScore >= 80 ? 'Strong' : 'Needs work'}
            </Badge>
          </div>
          <Progress value={profileScore} />
          <ul className="space-y-2">
            {profileSteps.map(step => (
              <li key={step.label} className="flex items-center gap-2 text-sm">
                <span
                  className={
                    step.done
                      ? 'flex h-4 w-4 items-center justify-center rounded-full bg-success text-[10px] text-success-foreground'
                      : 'h-4 w-4 rounded-full border-2 border-muted-foreground/40'
                  }
                >
                  {step.done ? '✓' : ''}
                </span>
                <span className={step.done ? 'text-muted-foreground line-through' : ''}>{step.label}</span>
              </li>
            ))}
          </ul>
          {showCompleteLink && (
            <Button asChild variant="outline" className="w-full">
              <Link to={ROUTES.candidateProfile}>Complete profile</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/10 to-emerald-500/10">
        <CardContent className="space-y-3 p-6">
          <Sparkles className="h-6 w-6 text-primary" />
          <h3 className="font-semibold">Boost your chances with AI</h3>
          <p className="text-sm text-muted-foreground">
            Get an instant resume score, tailored feedback, and AI-generated cover letters.
          </p>
          <Button asChild className="w-full">
            <Link to={ROUTES.candidateAi}>Open Career AI</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
