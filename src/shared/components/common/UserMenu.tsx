import { useNavigate } from 'react-router-dom'
import { LogOut, User as UserIcon, Settings, LayoutDashboard, Bookmark, FileText, Bell } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { useAuthStore } from '@/app/store/auth.store'
import { ROUTES } from '@/shared/constants'
import { initials } from '@/shared/lib/utils'

export function UserMenu() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  if (!user) return null

  const dashboardRoute =
    user.role === 'admin'
      ? ROUTES.adminDashboard
      : user.role === 'employer'
        ? ROUTES.employerDashboard
        : ROUTES.candidateDashboard

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-border bg-background px-1 py-1 pr-3 transition-colors hover:bg-accent">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:inline-block">{user.fullName.split(' ')[0]}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="flex items-center gap-3 p-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">{user.fullName}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          {user.role === 'candidate' ? 'Job Seeker' : user.role === 'employer' ? 'Employer' : 'Administrator'}
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate(dashboardRoute)}>
          <LayoutDashboard /> Dashboard
        </DropdownMenuItem>
        {user.role === 'candidate' && (
          <>
            <DropdownMenuItem onClick={() => navigate(ROUTES.candidateProfile)}>
              <UserIcon /> My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(ROUTES.candidateResume)}>
              <FileText /> My Resume
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(ROUTES.candidateSavedJobs)}>
              <Bookmark /> Saved Jobs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(ROUTES.candidateAlerts)}>
              <Bell /> Job Alerts
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(`${dashboardRoute}/settings`)}>
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            logout()
            navigate(ROUTES.home)
          }}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
