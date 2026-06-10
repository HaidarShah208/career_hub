import { useQuery } from '@tanstack/react-query'

import { fetchPublicStats } from '@/shared/services/public.api'

export const homeStatsKeys = {
  stats: ['public', 'stats'] as const,
}

export function useHomeStats() {
  const query = useQuery({
    queryKey: homeStatsKeys.stats,
    queryFn: fetchPublicStats,
    staleTime: 5 * 60 * 1000,
  })

  return {
    stats: query.data,
    isLoading: query.isLoading,
  }
}

/** Formats a count for hero stat tiles (e.g. 1200 → "1.2k+"). */
export function formatStatCount(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M+`
  }
  if (n >= 10_000) return `${Math.floor(n / 1_000)}k+`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k+`
  return String(n)
}
