import http, { unwrap } from './http'

export type UploadProgressFn = (percent: number) => void

async function uploadFile<T>(
  url: string,
  file: File,
  onProgress?: UploadProgressFn,
): Promise<T> {
  const form = new FormData()
  form.append('file', file)

  const res = await http.post(url, form, {
    // Let the browser set `multipart/form-data` with the correct boundary.
    headers: { 'Content-Type': undefined } as unknown as Record<string, string>,
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    },
  })
  return unwrap(res)
}

export function uploadAvatar(file: File, onProgress?: UploadProgressFn) {
  return uploadFile<{ avatarUrl: string }>('/uploads/avatar', file, onProgress)
}

export function uploadResume(file: File, onProgress?: UploadProgressFn) {
  return uploadFile<{ resumeUrl: string }>('/uploads/resume', file, onProgress)
}

export function uploadCompanyLogo(file: File, onProgress?: UploadProgressFn) {
  return uploadFile<{ logoUrl: string }>('/uploads/company-logo', file, onProgress)
}

export async function deleteAvatar() {
  await http.delete('/uploads/avatar')
}

export async function deleteResume() {
  await http.delete('/uploads/resume')
}

export async function deleteCompanyLogo() {
  await http.delete('/uploads/company-logo')
}
