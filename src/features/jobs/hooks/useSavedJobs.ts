import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/shared/constants'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Real backend jobs use UUIDs; drop any leftover mock/numeric ids. */
function keepValidIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return []
  return ids.filter((id): id is string => typeof id === 'string' && UUID_RE.test(id))
}

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
      version: 1,
      // Clears legacy mock ids (e.g. "1") that were persisted before the app
      // was wired to the real backend, so the sidebar badge can't go stale.
      migrate: (persisted) => ({ ids: keepValidIds((persisted as { ids?: unknown })?.ids) }),
      merge: (persisted, current) => ({
        ...current,
        ids: keepValidIds((persisted as { ids?: unknown })?.ids),
      }),
    },
  ),
)
