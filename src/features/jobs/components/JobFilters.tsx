import { SlidersHorizontal, X } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES,
  JOB_TYPES,
  PAKISTAN_CITIES,
  SALARY_RANGES,
  WORK_MODES,
} from '@/shared/constants'
import type { JobFilters } from '../types'
import { DEFAULT_JOB_FILTERS } from '../types'

interface JobFiltersPanelProps {
  filters: JobFilters
  onChange: (patch: Partial<JobFilters>) => void
  onReset: () => void
}

const ALL = '__all__'

interface FilterSelectProps {
  label: string
  value: string
  placeholder: string
  options: readonly { value: string; label: string }[]
  onChange: (value: string) => void
}

function FilterSelect({ label, value, placeholder, options, onChange }: FilterSelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value || ALL} onValueChange={v => onChange(v === ALL ? '' : v)}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{placeholder}</SelectItem>
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function JobFiltersPanel({ filters, onChange, onReset }: JobFiltersPanelProps) {
  const activeCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'sort' && key !== 'query' && value !== '' && value !== DEFAULT_JOB_FILTERS[key as keyof JobFilters],
  ).length

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between pb-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onReset}>
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
        )}
      </div>
      <div className="space-y-4">
        <FilterSelect
          label="City"
          value={filters.city}
          placeholder="All Cities"
          options={PAKISTAN_CITIES.map(c => ({ value: c, label: c }))}
          onChange={city => onChange({ city })}
        />
        <FilterSelect
          label="Category"
          value={filters.category}
          placeholder="All Categories"
          options={JOB_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
          onChange={category => onChange({ category })}
        />
        <FilterSelect
          label="Job Type"
          value={filters.jobType}
          placeholder="Any Type"
          options={JOB_TYPES}
          onChange={jobType => onChange({ jobType })}
        />
        <FilterSelect
          label="Experience Level"
          value={filters.experienceLevel}
          placeholder="Any Experience"
          options={EXPERIENCE_LEVELS}
          onChange={experienceLevel => onChange({ experienceLevel })}
        />
        <FilterSelect
          label="Work Mode"
          value={filters.workMode}
          placeholder="Any Mode"
          options={WORK_MODES}
          onChange={workMode => onChange({ workMode })}
        />
        <FilterSelect
          label="Salary Range"
          value={filters.salaryRange}
          placeholder="Any Salary"
          options={SALARY_RANGES.map(r => ({ value: r.value, label: r.label }))}
          onChange={salaryRange => onChange({ salaryRange })}
        />
      </div>
    </Card>
  )
}
