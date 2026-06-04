import { STORAGE_KEYS } from '@/shared/constants'

/**
 * Profile fields the backend does not (yet) persist. They are kept per-user in
 * localStorage so they survive reloads instead of resetting to hardcoded values.
 */
export interface CandidateExtras {
  category?: string
  linkedin?: string
  portfolio?: string
}

function key(userId: string): string {
  return `${STORAGE_KEYS.candidateExtras}.${userId}`
}

export function getCandidateExtras(userId: string | undefined): CandidateExtras {
  if (!userId) return {}
  try {
    const raw = localStorage.getItem(key(userId))
    return raw ? (JSON.parse(raw) as CandidateExtras) : {}
  } catch {
    return {}
  }
}

export function saveCandidateExtras(userId: string | undefined, extras: CandidateExtras): void {
  if (!userId) return
  localStorage.setItem(key(userId), JSON.stringify(extras))
}
