import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/shared/constants'

export default function NotFoundPage() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <p className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-8xl font-extrabold text-transparent">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you’re looking for doesn’t exist or may have been moved. Let’s get you back on track.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link to={ROUTES.home}>
            <Home className="h-4 w-4" /> Back to home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to={ROUTES.jobs}>
            <Search className="h-4 w-4" /> Browse jobs
          </Link>
        </Button>
      </div>
    </div>
  )
}
