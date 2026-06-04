import http, { unwrap } from '@/shared/services/http'
import { mapApplication } from '@/shared/services/mappers'
import type { Application, BackendApplication } from '@/shared/types/domain'

/** POST /applications — candidate applies to a job. */
export async function applyToJob(jobId: string): Promise<Application> {
  const res = await http.post('/applications', { jobId })
  return mapApplication(unwrap<BackendApplication>(res))
}

/** GET /applications/my — the current candidate's applications. */
export async function fetchMyApplications(): Promise<Application[]> {
  const res = await http.get('/applications/my', { params: { page: 1, limit: 100 } })
  return unwrap<BackendApplication[]>(res).map(mapApplication)
}

/** GET /applications/:id — single application incl. status timeline. */
export async function fetchApplicationById(id: string): Promise<Application> {
  const res = await http.get(`/applications/${id}`)
  return mapApplication(unwrap<BackendApplication>(res))
}
