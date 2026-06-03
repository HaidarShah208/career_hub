import { MOCK_COMPANIES, MOCK_JOBS } from '@/shared/services/mock-data'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'candidate' | 'employer' | 'admin'
  status: 'active' | 'suspended'
  joinedAt: string
  avatarUrl: string
}

const FIRST = ['Ali', 'Sara', 'Usman', 'Hira', 'Bilal', 'Ayesha', 'Hamza', 'Zainab', 'Faisal', 'Mariam', 'Tahir', 'Nida', 'Omar', 'Sana', 'Imran']
const LAST = ['Khan', 'Malik', 'Ahmed', 'Shah', 'Aslam', 'Noor', 'Sheikh', 'Ali', 'Iqbal', 'Hassan']

export const ADMIN_USERS: AdminUser[] = Array.from({ length: 24 }, (_, i) => {
  const name = `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`
  const role: AdminUser['role'] = i % 5 === 0 ? 'employer' : i === 0 ? 'admin' : 'candidate'
  return {
    id: `u_${i}`,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.pk`,
    role,
    status: i % 9 === 0 ? 'suspended' : 'active',
    joinedAt: new Date(Date.now() - i * 5 * 86400000).toISOString(),
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name + i)}`,
  }
})

export interface PendingEmployer {
  id: string
  company: string
  logoUrl: string
  industry: string
  city: string
  submittedAt: string
  documents: number
}

export const PENDING_EMPLOYERS: PendingEmployer[] = MOCK_COMPANIES.filter(c => !c.isVerified)
  .slice(0, 8)
  .map((c, i) => ({
    id: `pe_${i}`,
    company: c.name,
    logoUrl: c.logoUrl,
    industry: c.industry,
    city: c.city,
    submittedAt: new Date(Date.now() - i * 2 * 86400000).toISOString(),
    documents: 2 + (i % 3),
  }))

export interface ModerationJob {
  id: string
  title: string
  company: string
  city: string
  postedAt: string
  flagReason?: string
}

export const MODERATION_JOBS: ModerationJob[] = MOCK_JOBS.slice(0, 12).map((j, i) => ({
  id: j.id,
  title: j.title,
  company: j.company.name,
  city: j.city,
  postedAt: j.postedAt,
  flagReason: i % 4 === 0 ? 'Possible duplicate' : i % 5 === 0 ? 'Salary not disclosed' : undefined,
}))

export interface AdminCategory {
  id: string
  name: string
  slug: string
  jobs: number
}

export const ADMIN_CATEGORIES: AdminCategory[] = [
  { id: 'c1', name: 'Software & IT', slug: 'software', jobs: 1240 },
  { id: 'c2', name: 'Engineering', slug: 'engineering', jobs: 860 },
  { id: 'c3', name: 'Sales & Marketing', slug: 'sales', jobs: 720 },
  { id: 'c4', name: 'Finance & Accounting', slug: 'finance', jobs: 540 },
  { id: 'c5', name: 'Human Resources', slug: 'hr', jobs: 310 },
  { id: 'c6', name: 'Design & Creative', slug: 'design', jobs: 280 },
  { id: 'c7', name: 'Healthcare', slug: 'healthcare', jobs: 410 },
  { id: 'c8', name: 'Government', slug: 'government', jobs: 190 },
]
