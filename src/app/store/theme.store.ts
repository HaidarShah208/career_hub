import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { Theme } from '@/shared/types'
import { STORAGE_KEYS } from '@/shared/constants'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: 'system',
      setTheme: theme => set({ theme }),
    }),
    {
      name: STORAGE_KEYS.theme,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
