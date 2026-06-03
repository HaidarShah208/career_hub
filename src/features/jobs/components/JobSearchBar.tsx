import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { PAKISTAN_CITIES, ROUTES } from '@/shared/constants'
import { cn } from '@/shared/lib/utils'

interface JobSearchBarProps {
  className?: string
  initialQuery?: string
  initialCity?: string
  onSearch?: (query: string, city: string) => void
}

export function JobSearchBar({ className, initialQuery = '', initialCity = '', onSearch }: JobSearchBarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(initialQuery)
  const [city, setCity] = useState(initialCity)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (onSearch) {
      onSearch(query, city)
      return
    }
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (city) params.set('city', city)
    navigate(`${ROUTES.jobs}?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex flex-col gap-2 rounded-xl border border-border bg-card p-2 shadow-lg sm:flex-row sm:items-center',
        className,
      )}
    >
      <div className="flex-1">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Job title, skill or company"
          leftIcon={<Search />}
          className="h-12 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="hidden h-8 w-px bg-border sm:block" />
      <div className="sm:w-56">
        <Select value={city || 'all'} onValueChange={v => setCity(v === 'all' ? '' : v)}>
          <SelectTrigger className="h-12 border-0 bg-transparent shadow-none focus:ring-0">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="All Cities" />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {PAKISTAN_CITIES.map(c => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" size="lg" className="h-12 shrink-0 px-8">
        <Search className="h-4 w-4" /> Search Jobs
      </Button>
    </form>
  )
}
