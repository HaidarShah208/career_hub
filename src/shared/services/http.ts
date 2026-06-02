import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
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

http.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.authToken)
      localStorage.removeItem(STORAGE_KEYS.authUser)
    }

    const apiError: ApiError = {
      status: error.response?.status ?? 500,
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
