import { useMemo, useState } from 'react'
import { Globe, Laptop, Sparkles } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Pagination } from '@/shared/components/common/Pagination'
import { JobCard } from '../components/JobCard'
import { MOCK_JOBS } from '@/shared/services/mock-data'
import { PAGINATION } from '@/shared/constants'

const PAGE_SIZE = PAGINATION.jobsPerPage

export default function RemoteJobsPage() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const remoteJobs = useMemo(
    () =>
      MOCK_JOBS.filter(j => j.workMode === 'remote').filter(j =>
        query ? `${j.title} ${j.company.name} ${j.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase()) : true,
      ),
    [query],
  )

  const totalPages = Math.max(1, Math.ceil(remoteJobs.length / PAGE_SIZE))
  const pageJobs = remoteJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-blue-500/5 to-background">
        <div className="container py-14 text-center">
          <Badge variant="soft-info" className="mb-3 gap-1.5">
            <Globe className="h-3.5 w-3.5" /> Work from anywhere
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Remote Jobs in Pakistan</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {remoteJobs.length}+ fully remote roles from companies that let you work from home, anywhere in Pakistan.
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <Input
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search remote jobs"
              leftIcon={<Laptop />}
              className="h-12"
            />
          </div>
        </div>
      </section>

      <section className="container py-10">
        {pageJobs.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
            No remote jobs match your search.
            <div className="mt-4">
              <Button variant="outline" onClick={() => setQuery('')}>
                Reset search
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pageJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-8" />
          </>
        )}
      </section>
    </div>
  )
}
