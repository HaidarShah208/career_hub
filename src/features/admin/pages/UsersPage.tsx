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
import { useToast } from '@/shared/components/ui/toast'
import { ADMIN_USERS, type AdminUser } from '../data'
import { formatDate } from '@/shared/lib/utils'

const ROLE_VARIANT: Record<AdminUser['role'], BadgeProps['variant']> = {
  candidate: 'soft-info',
  employer: 'soft',
  admin: 'default',
}

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState(ADMIN_USERS)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('all')

  const filtered = useMemo(
    () =>
      users
        .filter(u => (role === 'all' ? true : u.role === role))
        .filter(u => (query ? `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()) : true)),
    [users, role, query],
  )

  function toggleStatus(id: string) {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u)),
    )
    toast({ title: 'User status updated', variant: 'success' })
  }

  return (
    <div>
      <PageHeader title="User Management" description={`${users.length} registered users.`} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
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
              {filtered.map(user => (
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
                    <Badge variant={user.status === 'active' ? 'success' : 'soft-destructive'} className="capitalize">
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
                        <DropdownMenuItem onClick={() => toast({ title: 'Viewing profile (demo)' })}>
                          View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(user.id)}>
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
    </div>
  )
}
