import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/shared/constants'
import type { JobAlertFormValues } from '../schemas'

export interface JobAlert extends JobAlertFormValues {
  id: string
  active: boolean
  createdAt: string
}

interface JobAlertsState {
  alerts: JobAlert[]
  add: (values: JobAlertFormValues) => void
  toggle: (id: string) => void
  remove: (id: string) => void
}

/** User-created job alerts, persisted locally (no backend endpoint yet). */
export const useJobAlerts = create<JobAlertsState>()(
  persist(
    (set) => ({
      alerts: [],
      add: (values) =>
        set((state) => ({
          alerts: [
            { ...values, id: `a${Date.now()}`, active: true, createdAt: new Date().toISOString() },
            ...state.alerts,
          ],
        })),
      toggle: (id) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
        })),
      remove: (id) =>
        set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
    }),
    {
      name: STORAGE_KEYS.jobAlerts,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
