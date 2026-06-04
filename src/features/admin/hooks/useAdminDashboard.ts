import { useEffect, useState } from 'react'

import { fetchDashboard, type DashboardStats } from '../api/admin.api'

interface State {
  data: DashboardStats | null
  isLoading: boolean
  error: string | null
}

export function useAdminDashboard() {
  const [state, setState] = useState<State>({ data: null, isLoading: true, error: null })

  useEffect(() => {
    let active = true
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    fetchDashboard()
      .then(data => active && setState({ data, isLoading: false, error: null }))
      .catch(err => {
        if (!active) return
        const message =
          err && typeof err === 'object' && 'message' in err
            ? String((err as { message?: unknown }).message)
            : 'Failed to load dashboard'
        setState({ data: null, isLoading: false, error: message })
      })
    return () => {
      active = false
    }
  }, [])

  return state
}
