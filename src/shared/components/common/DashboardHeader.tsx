import { useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, Plus } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import { useAuthStore } from '@/app/store/auth.store'
import { ROUTES } from '@/shared/constants'

interface DashboardHeaderProps {
  onToggleSidebar: () => void
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const navigate = useNavigate()
  const role = useAuthStore(s => s.user?.role)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleSidebar} aria-label="Open sidebar">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="hidden flex-1 max-w-md md:block">
        <Input placeholder="Search jobs, candidates, companies…" leftIcon={<Search />} className="bg-muted/50" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        {role === 'employer' && (
          <Button onClick={() => navigate(ROUTES.employerPostJob)} className="hidden sm:flex">
            <Plus /> Post a Job
          </Button>
        )}
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <UserMenu />
      </div>
    </header>
  )
}
