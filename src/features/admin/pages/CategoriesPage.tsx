import { FolderTree } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { useAdminCategories } from '../hooks/useAdminData'

export default function CategoriesPage() {
  const { categories, isLoading, isError, refetch } = useAdminCategories()

  if (isLoading) return <PageLoader />

  if (isError) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">Could not load categories from the server.</p>
        <Button variant="outline" className="mt-4" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const totalJobs = categories.reduce((sum, c) => sum + c.jobs, 0)

  return (
    <div>
      <PageHeader
        title="Category Management"
        description={`${categories.length} categories · ${totalJobs.toLocaleString()} jobs in the database.`}
      />

      {categories.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No categories yet. Job categories appear here once employers post jobs.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FolderTree className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.jobs.toLocaleString()} {category.jobs === 1 ? 'job' : 'jobs'}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground/80">slug: {category.slug}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
