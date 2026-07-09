import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  AlertTriangle,
  Bell,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  LogOut,
  Moon,
  Shield,
  Trash2,
} from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Switch } from '@/shared/components/ui/switch'
import { Separator } from '@/shared/components/ui/separator'
import { changePassword } from '@/shared/api/users.api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { useToast } from '@/shared/components/ui/toast'
import { useThemeStore } from '@/app/store/theme.store'
import { useAuthStore } from '@/app/store/auth.store'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { cn } from '@/shared/lib/utils'

interface AccountSettingsProps {
  extraNotifications?: { id: string; label: string; description: string; default?: boolean }[]
}

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine(d => d.newPassword === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

const readOnlyFieldClass =
  'disabled:cursor-disabled disabled:opacity-80 bg-muted/50 text-foreground'

const BASE_NOTIFICATIONS = [
  { id: 'jobs', label: 'New job matches', description: 'Get notified when jobs match your profile.', default: true },
  { id: 'applications', label: 'Application updates', description: 'Status changes on your applications.', default: true },
  { id: 'messages', label: 'Messages', description: 'Direct messages from employers.', default: true },
  { id: 'marketing', label: 'Product updates & tips', description: 'Occasional news and career advice.', default: false },
]

export function AccountSettings({ extraNotifications = [] }: AccountSettingsProps) {
  const { toast } = useToast()
  const { signOut, deleteAccount } = useAuth()
  const user = useAuthStore(s => s.user)
  const { theme, setTheme } = useThemeStore()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) })
  const [notifications, setNotifications] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      [...BASE_NOTIFICATIONS, ...extraNotifications].map(n => [n.id, n.default ?? false]),
    ),
  )

  const allNotifications = [...BASE_NOTIFICATIONS, ...extraNotifications]

  async function onChangePassword(values: ChangePasswordFormValues) {
    try {
      const result = await changePassword(values.currentPassword, values.newPassword)
      resetPasswordForm()
      toast({
        title: 'Password updated',
        description: result.message,
        variant: 'success',
      })
    } catch (err) {
      toast({
        title: 'Could not update password',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  const isAdmin = user?.role === 'admin'

  async function handleDeleteAccount() {
    setIsDeleting(true)
    try {
      await deleteAccount()
      setDeleteOpen(false)
      toast({ title: 'Account deleted', description: 'Your account and data have been permanently removed.', variant: 'success' })
    } catch (err) {
      toast({
        title: 'Could not delete account',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account, notifications, and preferences." />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" /> Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Email</Label>
              <Input value={user?.email ?? ''} disabled readOnly className={readOnlyFieldClass} />
            </div>
            <div>
              <Label className="mb-1.5 block">Full name</Label>
              <Input value={user?.fullName ?? ''} disabled readOnly className={readOnlyFieldClass} />
            </div>
            <div>
              <Label className="mb-1.5 block">Account type</Label>
              <Input
                value={user?.role ?? ''}
                disabled
                readOnly
                className={cn(readOnlyFieldClass, 'capitalize')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="h-4 w-4" /> Password & security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
              <div>
                <Label className="mb-1.5 block" htmlFor="currentPassword">
                  Current password
                </Label>
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  leftIcon={<Lock />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(p => !p)}
                      className="pointer-events-auto"
                      aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                    >
                      {showCurrentPassword ? <EyeOff /> : <Eye />}
                    </button>
                  }
                  {...registerPassword('currentPassword')}
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-xs text-destructive">{passwordErrors.currentPassword.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-1.5 block" htmlFor="newPassword">
                  New password
                </Label>
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  leftIcon={<Lock />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(p => !p)}
                      className="pointer-events-auto"
                      aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    >
                      {showNewPassword ? <EyeOff /> : <Eye />}
                    </button>
                  }
                  {...registerPassword('newPassword')}
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-xs text-destructive">{passwordErrors.newPassword.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-1.5 block" htmlFor="confirmPassword">
                  Confirm new password
                </Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  leftIcon={<Lock />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(p => !p)}
                      className="pointer-events-auto"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  }
                  {...registerPassword('confirmPassword')}
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-destructive">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" loading={isPasswordSubmitting}>
                Update password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {allNotifications.map(n => (
              <div key={n.id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.description}</p>
                </div>
                <Switch
                  checked={notifications[n.id]}
                  onCheckedChange={v => setNotifications(prev => ({ ...prev, [n.id]: v }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" /> Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Dark mode</p>
                  <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
                </div>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={v => setTheme(v ? 'dark' : 'light')} />
            </div>
            <Separator />
            <Button variant="outline" className="w-full justify-start" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
       
              {!isAdmin && (

              
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" /> Delete account
              </Button>
             )} 
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!isDeleting) setDeleteOpen(open)
        }}
      >
        <DialogContent
          className={cn(isDeleting && '[&>button]:pointer-events-none [&>button]:opacity-40')}
          onPointerDownOutside={(e) => isDeleting && e.preventDefault()}
          onEscapeKeyDown={(e) => isDeleting && e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center md:text-2xl gap-1 text-destructive">
              <AlertTriangle className="h-5 md:w-7 md:h-6 w-5" /> Delete account permanently?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete your account, profile, applications
              {user?.role === 'employer' ? ', company, and job postings' : ''}, and uploaded files.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={isDeleting} onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isDeleting} onClick={() => void handleDeleteAccount()}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Deleting…
                </>
              ) : (
                'Yes, delete my account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
