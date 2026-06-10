import http, { unwrap } from '@/shared/services/http'

export interface PublicStats {
  activeJobs: number
  companies: number
  candidates: number
  hired: number
}

export async function fetchPublicStats(): Promise<PublicStats> {
  const res = await http.get('/public/stats')
  return unwrap<PublicStats>(res)
}
