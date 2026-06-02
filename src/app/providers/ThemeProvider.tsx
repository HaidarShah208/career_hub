import { useEffect } from 'react'

import { useThemeStore } from '@/app/store/theme.store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore(s => s.theme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(system)
      return
    }
    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(media.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [theme])

  return <>{children}</>
}
