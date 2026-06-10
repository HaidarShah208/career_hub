import { AppRouter } from '@/app/router'
import { useAuthStore } from '@/app/store/auth.store'
import { AppSplash } from '@/shared/components/common/AppSplash'

export default function App() {
  const isHydrated = useAuthStore((s) => s.isHydrated)

  if (!isHydrated) {
    return <AppSplash />
  }

  return <AppRouter />
}
