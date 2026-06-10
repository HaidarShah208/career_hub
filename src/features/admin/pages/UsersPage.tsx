import { useMemo, useState } from 'react'
import { MoreVertical, Search } from 'lucide-react'

import { Badge, type BadgeProps } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { PageLoader } from '@/shared/components/common/PageLoader'
import { useToast } from '@/shared/components/ui/toast'
import type { AdminUser } from '../api/admin.api'
import { useAdminUsers } from '../hooks/useAdminData'
import { formatDate } from '@/shared/lib/utils'

const ROLE_VARIANT: Record<AdminUser['role'], BadgeProps['variant']> = {
  candidate: 'soft-info',
  employer: 'soft',
  admin: 'default',
}

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('all')
  const { users, total, isLoading, toggleStatus } = useAdminUsers(query, role)

  const filtered = useMemo(() => users, [users])

  async function handleToggleStatus(user: AdminUser) {
    try {
      const nextActive = user.status !== 'active'
      await toggleStatus(user.id, nextActive)
      toast({
        title: nextActive ? 'User activated' : 'User suspended',
        variant: 'success',
      })
    } catch (err) {
      toast({
        title: 'Could not update user',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <div>
      <PageHeader title="User Management" description={`${total} registered users.`} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          leftIcon={<Search />}
          className="h-10"
        />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="candidate">Candidates</SelectItem>
            <SelectItem value="employer">Employers</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">No users found.</div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={user.avatarUrl} alt="" className="h-9 w-9 rounded-full border border-border" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ROLE_VARIANT[user.role]} className="capitalize">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={user.status === 'active' ? 'success' : 'soft-destructive'}
                        className="capitalize"
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(user.joinedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Actions">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                            {user.status === 'active' ? 'Suspend user' : 'Activate user'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
