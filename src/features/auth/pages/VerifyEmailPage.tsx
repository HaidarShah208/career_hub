import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Loader2, MailCheck, XCircle } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { AuthShell } from '../components/AuthShell'
import { resendVerification, verifyEmailByToken } from '../api/auth.api'
import { useToast } from '@/shared/components/ui/toast'
import { ROUTES } from '@/shared/constants'

type Status = 'pending' | 'verifying' | 'success' | 'error'

function parseTokenFromUrl(raw: string | null): string | null {
  if (!raw) return null
  try {
    return decodeURIComponent(raw).trim()
  } catch {
    return raw.trim()
  }
}

function isVerifiedMessage(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes('verified') && !lower.includes('not verified')
}

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const token = parseTokenFromUrl(searchParams.get('token'))

  const emailFromState = (location.state as { email?: string } | null)?.email ?? ''
  const [email, setEmail] = useState(emailFromState)
  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'pending')
  const [message, setMessage] = useState('')
  const [resending, setResending] = useState(false)
  const verifyStarted = useRef(false)

  useEffect(() => {
    if (!token || verifyStarted.current) return
    verifyStarted.current = true

    verifyEmailByToken(token)
      .then((res) => {
        setStatus('success')
        setMessage(res.message)
      })
      .catch((err) => {
        const errMsg = (err as { message?: string })?.message ?? 'Verification failed.'
        if (isVerifiedMessage(errMsg)) {
          setStatus('success')
          setMessage(errMsg)
          return
        }
        setStatus('error')
        setMessage(errMsg)
      })
  }, [token])

  async function handleResend() {
    if (!email.trim()) {
      toast({ title: 'Enter your email', variant: 'warning' })
      return
    }
    setResending(true)
    try {
      const res = await resendVerification(email.trim())
      if (isVerifiedMessage(res.message)) {
        toast({ title: res.message, variant: 'success' })
        setStatus('success')
        setMessage(res.message)
      } else {
        toast({ title: res.message, variant: 'success' })
      }
    } catch (err) {
      toast({
        title: 'Could not resend',
        description: (err as { message?: string })?.message,
        variant: 'error',
      })
    } finally {
      setResending(false)
    }
  }

  if (status === 'success') {
    return (
      <AuthShell title="Email verified" subtitle="Your account is ready to use.">
        <div className="rounded-lg border border-border bg-muted/40 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="mt-4 font-medium">{message || 'Email verified successfully!'}</p>
          <p className="mt-1 text-sm text-muted-foreground">You can now sign in to your account.</p>
          <Button className="mt-5 w-full" onClick={() => navigate(ROUTES.login, { replace: true })}>
            Go to sign in
          </Button>
        </div>
      </AuthShell>
    )
  }

  if (status === 'error') {
    return (
      <AuthShell title="Verification failed" subtitle="We could not verify your email.">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <XCircle className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
          <p className="text-xs text-muted-foreground">
            If you already clicked the link once, try{' '}
            <Link to={ROUTES.login} className="text-primary hover:underline">
              signing in
            </Link>
            .
          </p>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="w-full" onClick={handleResend} loading={resending}>
              Resend verification email
            </Button>
          </div>
          <Link to={ROUTES.login} className="text-sm text-primary hover:underline">
            Back to sign in
          </Link>
        </div>
      </AuthShell>
    )
  }

  if (status === 'verifying') {
    return (
      <AuthShell title="Verifying email" subtitle="Please wait while we confirm your address.">
        <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Verifying your email…</p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Verify your email"
      subtitle={
        email
          ? `We sent a verification link to ${email}. Open it to activate your account.`
          : 'We sent a verification link to your email. Open it to activate your account.'
      }
      footer={
        <button
          type="button"
          className="font-medium text-primary hover:underline disabled:opacity-50"
          onClick={handleResend}
          disabled={resending}
        >
          Resend verification email
        </button>
      }
    >
      <div className="space-y-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="h-6 w-6" />
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Check your inbox</p>
          <p className="mt-1">
            Click the verification link in the email we sent you. You must verify before you can sign in.
          </p>
        </div>
        {!email && (
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email to resend"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        <p className="text-center text-sm text-muted-foreground">
          Already verified?{' '}
          <Link to={ROUTES.login} className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
