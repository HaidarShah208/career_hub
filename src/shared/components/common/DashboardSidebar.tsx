import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

import { Logo } from './Logo'
import { cn } from '@/shared/lib/utils'

export interface SidebarItem {
  label: string
  to: string
  icon: LucideIcon
  badge?: string | number
  end?: boolean
}

export interface SidebarSection {
  title?: string
  items: SidebarItem[]
}

interface DashboardSidebarProps {
  sections: SidebarSection[]
  open: boolean
}

export function DashboardSidebar({ sections, open }: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 ease-out lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo size="sm" />
      </div>
      <nav className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {section.title}
              </p>
            )}
            {section.items.map(item => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
