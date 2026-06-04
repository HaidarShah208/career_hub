import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/shared/constants'

interface SavedJobsState {
  ids: string[]
  toggle: (id: string) => void
  isSaved: (id: string) => boolean
  /** Replaces the saved set (used to prune ids whose jobs no longer exist). */
  setIds: (ids: string[]) => void
  clear: () => void
}

export const useSavedJobs = create<SavedJobsState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: id =>
        set(state => ({
          ids: state.ids.includes(id)
            ? state.ids.filter(x => x !== id)
            : [...state.ids, id],
        })),
      isSaved: id => get().ids.includes(id),
      setIds: ids => set({ ids }),
      clear: () => set({ ids: [] }),
    }),
    {
      name: STORAGE_KEYS.savedJobs,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
