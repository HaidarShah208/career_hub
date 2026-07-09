import { useState } from 'react'
import { FolderTree, Pencil, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Label } from '@/shared/components/ui/label'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { useToast } from '@/shared/components/ui/toast'
import { slugify } from '@/shared/lib/utils'
import type { AdminCategory } from '../api/admin.api'
import { useAdminCategories } from '../hooks/useAdminData'

export default function CategoriesPage() {
  const { toast } = useToast()
  const { categories, isLoading, isError, refetch, createCategory, updateCategory, removeCategory, isMutating } =
    useAdminCategories()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const [name, setName] = useState('')

  function openNew() {
    setEditing(null)
    setName('')
    setOpen(true)
  }

  function openEdit(category: AdminCategory) {
    setEditing(category)
    setName(category.name)
    setOpen(true)
  }

  async function save() {
    if (!name.trim()) return
    try {
      if (editing) {
        await updateCategory(editing.id, name.trim())
        toast({ title: 'Category updated', variant: 'success' })
      } else {
        await createCategory(name.trim())
        toast({ title: 'Category created', variant: 'success' })
      }
      setOpen(false)
    } catch (err) {
      toast({
        title: editing ? 'Could not update category' : 'Could not create category',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  async function remove(id: string) {
    try {
      await removeCategory(id)
      toast({ title: 'Category deleted', variant: 'success' })
    } catch (err) {
      toast({
        title: 'Could not delete category',
        description: (err as { message?: string })?.message ?? 'Remove jobs in this category first.',
        variant: 'error',
      })
    }
  }

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
  const previewSlug = name ? slugify(name).replace(/-/g, '_') : ''

  return (
    <div>
      <PageHeader
        title="Category Management"
        description={`${categories.length} categories · ${totalJobs.toLocaleString()} jobs in the database.`}
        actions={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> Add category
          </Button>
        }
      />

      {categories.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No categories yet. Add your first category to get started.
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(category)}
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => void remove(category.id)}
                  disabled={isMutating || category.jobs > 0}
                  aria-label="Delete"
                  title={category.jobs > 0 ? 'Cannot delete while jobs exist in this category' : 'Delete category'}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit category' : 'New category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Category name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Data & Analytics"
              disabled={isMutating}
            />
            {name && !editing && (
              <p className="text-xs text-muted-foreground">Slug: {previewSlug}</p>
            )}
            {editing && (
              <p className="text-xs text-muted-foreground">Slug stays {editing.slug} so existing jobs keep working.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isMutating}>
              Cancel
            </Button>
            <Button onClick={() => void save()} loading={isMutating}>
              {editing ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
