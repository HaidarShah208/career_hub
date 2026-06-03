import { useState } from 'react'
import { Bell, Globe, Lock, LogOut, Moon, Shield, Trash2 } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Switch } from '@/shared/components/ui/switch'
import { Separator } from '@/shared/components/ui/separator'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { useToast } from '@/shared/components/ui/toast'
import { useThemeStore } from '@/app/store/theme.store'
import { useAuthStore } from '@/app/store/auth.store'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface AccountSettingsProps {
  extraNotifications?: { id: string; label: string; description: string; default?: boolean }[]
}

const BASE_NOTIFICATIONS = [
  { id: 'jobs', label: 'New job matches', description: 'Get notified when jobs match your profile.', default: true },
  { id: 'applications', label: 'Application updates', description: 'Status changes on your applications.', default: true },
  { id: 'messages', label: 'Messages', description: 'Direct messages from employers.', default: true },
  { id: 'marketing', label: 'Product updates & tips', description: 'Occasional news and career advice.', default: false },
]

export function AccountSettings({ extraNotifications = [] }: AccountSettingsProps) {
  const { toast } = useToast()
  const { signOut } = useAuth()
  const user = useAuthStore(s => s.user)
  const { theme, setTheme } = useThemeStore()
  const [notifications, setNotifications] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      [...BASE_NOTIFICATIONS, ...extraNotifications].map(n => [n.id, n.default ?? false]),
    ),
  )

  const allNotifications = [...BASE_NOTIFICATIONS, ...extraNotifications]

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
              <Input defaultValue={user?.email} readOnly />
            </div>
            <div>
              <Label className="mb-1.5 block">Account type</Label>
              <Input defaultValue={user?.role} readOnly className="capitalize" />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast({ title: 'Verification email sent', variant: 'success' })}
            >
              Resend verification email
            </Button>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="h-4 w-4" /> Password & security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Current password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div>
              <Label className="mb-1.5 block">New password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button
              className="w-full"
              onClick={() => toast({ title: 'Password updated', variant: 'success' })}
            >
              Update password
            </Button>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security.</p>
              </div>
              <Switch />
            </div>
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
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() =>
                toast({ title: 'Account deletion', description: 'This is disabled in the demo.', variant: 'warning' })
              }
            >
              <Trash2 className="h-4 w-4" /> Delete account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
