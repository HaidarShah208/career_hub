import { useMemo, useState } from 'react'
import { Building2, Search } from 'lucide-react'

import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { EmptyState } from '@/shared/components/common/EmptyState'
import { CompanyCard } from '../components/CompanyCard'
import { useCompanies } from '../hooks/useCompanies'
import { PAKISTAN_CITIES } from '@/shared/constants'
import { DEFAULT_COMPANY_FILTERS, type CompanyFilters } from '../types'

const ALL = '__all__'

export default function CompaniesListPage() {
  const [filters, setFilters] = useState<CompanyFilters>(DEFAULT_COMPANY_FILTERS)
  const { companies, isLoading } = useCompanies(filters)
  const industries = useMemo(
    () => Array.from(new Set(companies.map(c => c.industry))).sort(),
    [companies],
  )

  function patch(p: Partial<CompanyFilters>) {
    setFilters(prev => ({ ...prev, ...p }))
  }

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="container py-14 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Top Companies in Pakistan</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Discover {companies.length}+ employers actively hiring, read about their culture, and explore open roles.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Input
            value={filters.query}
            onChange={e => patch({ query: e.target.value })}
            placeholder="Search companies"
            leftIcon={<Search />}
            className="h-11"
          />
          <div className="grid grid-cols-2 gap-3 sm:flex sm:w-auto">
            <Select
              value={filters.industry || ALL}
              onValueChange={v => patch({ industry: v === ALL ? '' : v })}
            >
              <SelectTrigger className="h-11 sm:w-44">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Industries</SelectItem>
                {industries.map(ind => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.city || ALL} onValueChange={v => patch({ city: v === ALL ? '' : v })}>
              <SelectTrigger className="h-11 sm:w-40">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Cities</SelectItem>
                {PAKISTAN_CITIES.map(c => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-52 rounded-xl border border-border bg-card shimmer" />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <EmptyState icon={Building2} title="No companies found" description="Try a different search or filter." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {companies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
