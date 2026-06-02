import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = React.useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).slice(2)
      const duration = t.duration ?? 4000
      setToasts(prev => [...prev, { ...t, id }])
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss],
  )

  const value = React.useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const variantStyles: Record<ToastVariant, { bg: string; icon: React.ReactNode }> = {
  default: { bg: 'bg-card text-foreground border-border', icon: <Info className="h-5 w-5 text-info" /> },
  success: { bg: 'bg-card text-foreground border-success/30', icon: <CheckCircle2 className="h-5 w-5 text-success" /> },
  error: { bg: 'bg-card text-foreground border-destructive/30', icon: <XCircle className="h-5 w-5 text-destructive" /> },
  warning: { bg: 'bg-card text-foreground border-warning/30', icon: <AlertTriangle className="h-5 w-5 text-warning" /> },
  info: { bg: 'bg-card text-foreground border-info/30', icon: <Info className="h-5 w-5 text-info" /> },
}

function ToastViewport({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-[100] flex w-full max-w-sm flex-col gap-2 p-4 sm:bottom-4 sm:right-4">
      <AnimatePresence>
        {toasts.map(t => {
          const styles = variantStyles[t.variant ?? 'default']
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 32, transition: { duration: 0.2 } }}
              className={cn(
                'pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur',
                styles.bg,
              )}
              role="status"
            >
              <div className="mt-0.5 shrink-0">{styles.icon}</div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold leading-none">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                )}
              </div>
              <button
                aria-label="Dismiss"
                onClick={() => dismiss(t.id)}
                className="rounded text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
