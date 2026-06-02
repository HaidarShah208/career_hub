import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { useAuthStore } from '@/app/store/auth.store'
import { ROUTES } from '@/shared/constants'
import { cn } from '@/shared/lib/utils'

const NAV_LINKS = [
  { to: ROUTES.jobs, label: 'Find Jobs' },
  { to: ROUTES.companies, label: 'Companies' },
  { to: ROUTES.remoteJobs, label: 'Remote Jobs' },
  { to: ROUTES.governmentJobs, label: 'Govt Jobs', highlight: true },
  { to: ROUTES.about, label: 'About' },
]

export function PublicNavbar() {
  const [open, setOpen] = useState(false)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo size="md" />
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                  )
                }
              >
                <span className="flex items-center gap-1.5">
                  {link.label}
                  {link.highlight && (
                    <Badge variant="soft-warning" className="px-1.5 py-0 text-[10px]">
                      New
                    </Badge>
                  )}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              <UserMenu />
            </>
          ) : (
            <div className="hidden gap-2 sm:flex">
              <Button asChild variant="ghost">
                <Link to={ROUTES.login}>Sign in</Link>
              </Button>
              <Button asChild variant="default">
                <Link to={ROUTES.register}>Sign up Free</Link>
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/60 lg:hidden"
          >
            <div className="container space-y-1 py-3">
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                    )
                  }
                >
                  {link.label}
                  {link.highlight && (
                    <Badge variant="soft-warning" className="px-1.5 py-0 text-[10px]">
                      New
                    </Badge>
                  )}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button asChild variant="outline">
                    <Link to={ROUTES.login}>Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link to={ROUTES.register}>Sign up Free</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
