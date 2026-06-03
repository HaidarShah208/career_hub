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
import { useToast } from '@/shared/components/ui/toast'
import { ADMIN_CATEGORIES, type AdminCategory } from '../data'
import { slugify } from '@/shared/lib/utils'

export default function CategoriesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<AdminCategory[]>(ADMIN_CATEGORIES)
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
  function save() {
    if (!name.trim()) return
    if (editing) {
      setCategories(prev => prev.map(c => (c.id === editing.id ? { ...c, name, slug: slugify(name) } : c)))
      toast({ title: 'Category updated', variant: 'success' })
    } else {
      setCategories(prev => [{ id: `c${Date.now()}`, name, slug: slugify(name), jobs: 0 }, ...prev])
      toast({ title: 'Category created', variant: 'success' })
    }
    setOpen(false)
  }
  function remove(id: string) {
    setCategories(prev => prev.filter(c => c.id !== id))
    toast({ title: 'Category deleted', variant: 'info' })
  }

  return (
    <div>
      <PageHeader
        title="Category Management"
        description="Organise jobs into searchable categories."
        actions={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> Add category
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(category => (
          <Card key={category.id}>
            <CardContent className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FolderTree className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.jobs.toLocaleString()} jobs</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(category)} aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => remove(category.id)}
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit category' : 'New category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Category name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Data & Analytics" />
            {name && <p className="text-xs text-muted-foreground">Slug: {slugify(name)}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? 'Save' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
