import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { API_BASE_URL, STORAGE_KEYS } from '@/shared/constants'
import type { ApiError } from '@/shared/types'

const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(STORAGE_KEYS.authToken)
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Callback the auth layer registers so the HTTP client can clear the Zustand
 * session (and redirect) when a token can no longer be refreshed. Avoids a
 * hard import cycle between the store and the client.
 */
let onAuthFailure: (() => void) | null = null
export function setAuthFailureHandler(handler: () => void) {
  onAuthFailure = handler
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.authToken)
  localStorage.removeItem(STORAGE_KEYS.authUser)
  localStorage.removeItem(STORAGE_KEYS.refreshToken)
  onAuthFailure?.()
}

// De-duplicate concurrent refreshes: all 401s wait on a single refresh promise.
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken)
  if (!refreshToken) return null
  try {
    // Bare axios call (no interceptors) to avoid recursive refresh loops.
    const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
    const payload = res.data?.data as { accessToken: string; refreshToken: string } | undefined
    if (!payload?.accessToken) return null
    localStorage.setItem(STORAGE_KEYS.authToken, payload.accessToken)
    if (payload.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.refreshToken, payload.refreshToken)
    }
    return payload.accessToken
  } catch {
    return null
  }
}

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const status = error.response?.status

    // Attempt a single transparent token refresh on the first 401.
    const isRefreshCall = original?.url?.includes('/auth/refresh')
    if (status === 401 && original && !original._retry && !isRefreshCall) {
      original._retry = true
      refreshPromise = refreshPromise ?? refreshAccessToken()
      const newToken = await refreshPromise
      refreshPromise = null

      if (newToken) {
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${newToken}`
        return http(original)
      }
      clearSession()
    }

    const apiError: ApiError = {
      status: status ?? 500,
      message:
        error.response?.data?.message ??
        error.message ??
        'Something went wrong. Please try again.',
      errors: error.response?.data?.errors,
    }
    return Promise.reject(apiError)
  },
)

export default http

export function unwrap<T>(response: { data: { data: T } }): T {
  return response.data.data
}

/** Pulls the pagination `meta` envelope (if any) from a list response. */
export function unwrapMeta(response: { data: { meta?: unknown } }): {
  page: number
  limit: number
  total: number
  totalPages: number
} | null {
  const meta = response.data.meta as
    | { page: number; limit: number; total: number; totalPages: number }
    | undefined
  return meta ?? null
}
