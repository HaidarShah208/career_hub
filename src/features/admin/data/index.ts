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

const PENDING_COMPANY_SEED = [
  ['Skyline Tech', 'Software', 'Lahore'],
  ['GreenLeaf Foods', 'FMCG', 'Karachi'],
  ['Indus Logistics', 'Logistics', 'Islamabad'],
  ['Falcon Security', 'Services', 'Rawalpindi'],
  ['Nova Health', 'Healthcare', 'Faisalabad'],
]

export const PENDING_EMPLOYERS: PendingEmployer[] = PENDING_COMPANY_SEED.map(
  ([company, industry, city], i) => ({
    id: `pe_${i}`,
    company,
    logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company)}&backgroundColor=16a34a`,
    industry,
    city,
    submittedAt: new Date(Date.now() - i * 2 * 86400000).toISOString(),
    documents: 2 + (i % 3),
  }),
)

export interface ModerationJob {
  id: string
  title: string
  company: string
  city: string
  postedAt: string
  flagReason?: string
}

/**
 * Static fallback used only if the live `/admin/jobs` request fails. The
 * Job Moderation screen fetches real jobs from the backend (see its page).
 */
export const MODERATION_JOBS: ModerationJob[] = []
