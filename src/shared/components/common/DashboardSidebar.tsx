import { NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
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
  collapsed: boolean
  onToggleCollapse: () => void
}

export function DashboardSidebar({ sections, open, collapsed, onToggleCollapse }: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col overflow-hidden border-r border-border bg-card transition-[transform,width] duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
        collapsed ? 'w-[4.5rem]' : 'w-64',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div
        className={cn(
          'relative flex h-16 shrink-0 items-center border-b border-border',
          collapsed ? 'justify-center px-2' : 'justify-between gap-2 px-3',
        )}
      >
        <Logo size="sm" showText={!collapsed} className={cn(collapsed && 'justify-center')} />
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'hidden shrink-0 lg:inline-flex',
            collapsed && 'absolute right-0 top-12 h-7 w-7',
          )}
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>
      <nav className={cn('scrollbar-thin flex-1 space-y-6 overflow-y-auto py-5', collapsed ? 'px-2' : 'px-3')}>
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && !collapsed && (
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
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center rounded-md text-sm font-medium transition-colors',
                      collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
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
