import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, MailCheck } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { AuthShell } from '../components/AuthShell'
import { verifyEmail } from '../api/auth.api'
import { useAuthStore } from '@/app/store/auth.store'
import { ROUTES } from '@/shared/constants'

const CODE_LENGTH = 6

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const updateUser = useAuthStore(s => s.updateUser)
  const user = useAuthStore(s => s.user)
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [status, setStatus] = useState<'idle' | 'verifying' | 'done'>('idle')
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const filled = code.every(Boolean)

  useEffect(() => {
    if (!filled || status !== 'idle') return
    setStatus('verifying')
    verifyEmail(code.join('')).then(() => {
      updateUser({ isVerified: true })
      setStatus('done')
    })
  }, [filled, code, status, updateUser])

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    setCode(prev => {
      const next = [...prev]
      next[index] = digit
      return next
    })
    if (digit && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  return (
    <AuthShell
      title="Verify your email"
      subtitle={`We sent a 6-digit code to ${user?.email ?? 'your email'}. Enter it below.`}
      footer={
        status === 'done' ? null : (
          <button className="font-medium text-primary hover:underline">Resend code</button>
        )
      }
    >
      {status === 'done' ? (
        <div className="rounded-lg border border-border bg-muted/40 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="mt-4 font-medium">Email verified successfully!</p>
          <p className="mt-1 text-sm text-muted-foreground">Your account is now fully active.</p>
          <Button asChild className="mt-5 w-full">
            <Link to={ROUTES.candidateDashboard}>Go to dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="h-6 w-6" />
          </div>
          <div className="flex justify-center gap-2">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => {
                  inputs.current[i] = el
                }}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                inputMode="numeric"
                maxLength={1}
                disabled={status === 'verifying'}
                className="h-14 w-12 rounded-lg border border-input bg-background text-center text-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              />
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Tip: enter any 6 digits to continue (demo).
          </p>
        </div>
      )}
    </AuthShell>
  )
}
