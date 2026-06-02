import type { User } from '@/shared/types'

export interface MockCompany {
  id: string
  name: string
  slug: string
  logoUrl: string
  industry: string
  size: string
  founded: number
  city: string
  website: string
  description: string
  isVerified: boolean
  rating: number
  reviewCount: number
  openJobs: number
  benefits: string[]
}

export interface MockJob {
  id: string
  title: string
  slug: string
  companyId: string
  company: MockCompany
  category: string
  city: string
  workMode: 'onsite' | 'remote' | 'hybrid'
  jobType: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance' | 'temporary'
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive'
  salaryMin: number
  salaryMax: number
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  skills: string[]
  postedAt: string
  expiresAt: string
  applicants: number
  views: number
  isFeatured: boolean
  isUrgent: boolean
  isGovernment: boolean
}

export interface MockApplication {
  id: string
  jobId: string
  job: MockJob
  candidateId: string
  status: 'applied' | 'reviewed' | 'shortlisted' | 'interview' | 'offered' | 'rejected' | 'withdrawn'
  appliedAt: string
  coverLetter?: string
  resumeUrl?: string
  matchScore: number
}

export interface MockNotification {
  id: string
  userId: string
  type: 'job' | 'application' | 'message' | 'system'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
}

const COMPANY_NAMES = [
  ['Systems Limited', 'IT Services', 'Lahore'],
  ['NETSOL Technologies', 'Software', 'Lahore'],
  ['10Pearls Pakistan', 'Software', 'Karachi'],
  ['Afiniti', 'Artificial Intelligence', 'Karachi'],
  ['VentureDive', 'Software', 'Karachi'],
  ['Bazaar Technologies', 'E-Commerce', 'Karachi'],
  ['Airlift', 'Logistics', 'Lahore'],
  ['Tajir', 'E-Commerce', 'Lahore'],
  ['Engro Corporation', 'Conglomerate', 'Karachi'],
  ['Habib Bank Limited', 'Banking', 'Karachi'],
  ['MCB Bank Limited', 'Banking', 'Lahore'],
  ['Telenor Pakistan', 'Telecom', 'Islamabad'],
  ['Jazz', 'Telecom', 'Islamabad'],
  ['Daraz Pakistan', 'E-Commerce', 'Karachi'],
  ['Foodpanda', 'Food Delivery', 'Lahore'],
  ['Careem', 'Ride-hailing', 'Karachi'],
  ['TPL Trakker', 'Technology', 'Karachi'],
  ['Arbisoft', 'Software', 'Lahore'],
  ['DPL', 'Software', 'Islamabad'],
  ['Confiz', 'Software', 'Lahore'],
  ['i2c Inc.', 'FinTech', 'Lahore'],
  ['Khaadi', 'Fashion Retail', 'Karachi'],
  ['Bonanza Satrangi', 'Fashion Retail', 'Karachi'],
  ['Unilever Pakistan', 'FMCG', 'Karachi'],
  ['Nestle Pakistan', 'FMCG', 'Lahore'],
  ['Pakistan State Oil', 'Oil & Gas', 'Karachi'],
  ['OGDCL', 'Oil & Gas', 'Islamabad'],
  ['NADRA', 'Government', 'Islamabad'],
  ['FBR', 'Government', 'Islamabad'],
  ['State Bank of Pakistan', 'Banking', 'Karachi'],
]

const JOB_TITLES = [
  'Senior Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'React Developer',
  'Node.js Developer',
  'Python Developer',
  '.NET Developer',
  'Mobile App Developer (Flutter)',
  'iOS Developer',
  'Android Developer',
  'DevOps Engineer',
  'Cloud Engineer (AWS)',
  'Data Scientist',
  'Machine Learning Engineer',
  'AI Engineer',
  'Product Manager',
  'Project Manager',
  'Business Analyst',
  'UI/UX Designer',
  'Graphic Designer',
  'Digital Marketing Manager',
  'SEO Specialist',
  'Social Media Executive',
  'Content Writer',
  'Sales Executive',
  'Sales Manager',
  'Customer Support Agent',
  'HR Manager',
  'HR Executive',
  'Talent Acquisition Specialist',
  'Accounts Officer',
  'Finance Manager',
  'Audit Officer',
  'Branch Manager',
  'Operations Manager',
  'Supply Chain Officer',
  'Quality Assurance Engineer',
  'Mechanical Engineer',
  'Civil Engineer',
  'Electrical Engineer',
  'Network Administrator',
  'Database Administrator',
  'Cyber Security Analyst',
  'Teacher (Mathematics)',
  'Lecturer (Computer Science)',
  'Medical Officer',
  'Staff Nurse',
  'Pharmacist',
  'Lab Technician',
  'Assistant Director (BPS-17)',
  'Sub-Inspector (Police)',
  'Tax Inspector (FBR)',
  'Accounts Officer (Govt)',
]

const SKILLS_POOL = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Vue.js',
  'Angular',
  'Node.js',
  'Express',
  'NestJS',
  'Python',
  'Django',
  'FastAPI',
  'Java',
  'Spring Boot',
  'C#',
  '.NET',
  'PHP',
  'Laravel',
  'Ruby on Rails',
  'Go',
  'Rust',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'Git',
  'CI/CD',
  'GraphQL',
  'REST APIs',
  'Tailwind CSS',
  'Figma',
  'Adobe XD',
  'Photoshop',
  'Illustrator',
  'SEO',
  'Google Analytics',
  'Excel',
  'Power BI',
  'Tableau',
  'SAP',
  'Oracle',
  'Microsoft Office',
  'Communication',
  'Leadership',
  'Teamwork',
  'Problem Solving',
]

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickMany<T>(arr: readonly T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, n)
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export const MOCK_COMPANIES: MockCompany[] = COMPANY_NAMES.map(([name, industry, city], i) => ({
  id: `co_${i + 1}`,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=16a34a,15803d,166534,059669&textColor=ffffff`,
  industry,
  size: pick(['11-50', '51-200', '201-500', '501-1000', '1000-5000', '5000+']),
  founded: randomBetween(1985, 2020),
  city,
  website: `https://${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com.pk`,
  description: `${name} is a leading ${industry} company in Pakistan with a strong presence and commitment to excellence. We empower people through innovation and impact.`,
  isVerified: Math.random() > 0.2,
  rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
  reviewCount: randomBetween(20, 1500),
  openJobs: randomBetween(1, 25),
  benefits: pickMany(
    [
      'Health Insurance',
      'Provident Fund',
      'Annual Bonus',
      'Paid Leaves',
      'Hybrid Work',
      'Learning Budget',
      'Gym Membership',
      'Free Lunch',
      'Performance Bonuses',
      'Conveyance',
      'Mobile Allowance',
      'Eid Bonuses',
    ],
    randomBetween(4, 7),
  ),
}))

export const MOCK_JOBS: MockJob[] = JOB_TITLES.flatMap((title, ti) =>
  Array.from({ length: 3 }, (_, k) => {
    const company = pick(MOCK_COMPANIES)
    const isGov = title.toLowerCase().includes('govt') || title.toLowerCase().includes('police') || title.toLowerCase().includes('fbr') || title.toLowerCase().includes('bps')
    const minSalary = randomBetween(40, 350) * 1000
    const maxSalary = minSalary + randomBetween(20, 200) * 1000
    const cityOptions = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Remote']
    const city = pick(cityOptions)
    const workMode: MockJob['workMode'] = city === 'Remote' ? 'remote' : pick(['onsite', 'hybrid', 'onsite', 'onsite'])
    const isRemote = workMode === 'remote'
    const id = `job_${ti}_${k}`

    return {
      id,
      title: k === 0 ? title : `${title} ${k === 1 ? '(Mid Level)' : '(Senior)'}`,
      slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id}`,
      companyId: company.id,
      company,
      category: pick([
        'software',
        'engineering',
        'sales',
        'finance',
        'hr',
        'design',
        'healthcare',
        'education',
        'banking',
        'government',
      ]),
      city: isRemote ? 'Remote' : city,
      workMode,
      jobType: pick(['full_time', 'full_time', 'full_time', 'contract', 'part_time', 'internship']),
      experienceLevel: pick(['entry', 'junior', 'mid', 'senior', 'lead']),
      salaryMin: minSalary,
      salaryMax: maxSalary,
      description: `We are looking for a passionate ${title} to join our growing team at ${company.name}. You will work on cutting-edge projects, collaborate with talented engineers, and deliver high-quality solutions to our customers across Pakistan and beyond.`,
      requirements: [
        `${randomBetween(2, 6)}+ years of relevant professional experience`,
        'Strong problem-solving and analytical skills',
        'Excellent written and verbal communication',
        'Ability to work in a fast-paced, collaborative environment',
        'Bachelor\'s degree in a related field (or equivalent experience)',
      ],
      responsibilities: [
        'Design, develop, and maintain high-quality solutions',
        'Collaborate with cross-functional teams to ship features',
        'Mentor junior team members and conduct code reviews',
        'Participate in architecture and design discussions',
        'Contribute to a culture of engineering excellence',
      ],
      benefits: company.benefits,
      skills: pickMany(SKILLS_POOL, randomBetween(5, 9)),
      postedAt: daysAgo(randomBetween(0, 25)),
      expiresAt: daysFromNow(randomBetween(10, 45)),
      applicants: randomBetween(5, 350),
      views: randomBetween(50, 5000),
      isFeatured: Math.random() > 0.7,
      isUrgent: Math.random() > 0.85,
      isGovernment: isGov || Math.random() > 0.92,
    }
  }),
)

export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    email: 'candidate@demo.pk',
    fullName: 'Ali Ahmed',
    role: 'candidate',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali',
    phoneNumber: '+92 300 1234567',
    city: 'Lahore',
    isVerified: true,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(2),
  },
  {
    id: 'user_2',
    email: 'employer@demo.pk',
    fullName: 'Fatima Khan',
    role: 'employer',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
    phoneNumber: '+92 321 9876543',
    city: 'Karachi',
    isVerified: true,
    createdAt: daysAgo(200),
    updatedAt: daysAgo(1),
  },
  {
    id: 'user_3',
    email: 'admin@demo.pk',
    fullName: 'Bilal Hussain',
    role: 'admin',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bilal',
    phoneNumber: '+92 333 5555555',
    city: 'Islamabad',
    isVerified: true,
    createdAt: daysAgo(365),
    updatedAt: daysAgo(0),
  },
]

export const MOCK_APPLICATIONS: MockApplication[] = MOCK_JOBS.slice(0, 18).map((job, i) => ({
  id: `app_${i}`,
  jobId: job.id,
  job,
  candidateId: 'user_1',
  status: pick(['applied', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected']),
  appliedAt: daysAgo(randomBetween(0, 30)),
  coverLetter: 'Looking forward to contributing to the team.',
  resumeUrl: '/resume.pdf',
  matchScore: randomBetween(55, 98),
}))

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: 'n1',
    userId: 'user_1',
    type: 'application',
    title: 'Application Shortlisted',
    message: 'Your application for Senior Software Engineer has been shortlisted by 10Pearls Pakistan.',
    isRead: false,
    createdAt: daysAgo(0),
    link: '/candidate/applications',
  },
  {
    id: 'n2',
    userId: 'user_1',
    type: 'job',
    title: 'New Jobs Match Your Profile',
    message: '12 new jobs matching your saved search "React Developer in Lahore" are available.',
    isRead: false,
    createdAt: daysAgo(1),
    link: '/jobs?role=react',
  },
  {
    id: 'n3',
    userId: 'user_1',
    type: 'message',
    title: 'Interview Invitation',
    message: 'You have been invited for an interview at Bazaar Technologies on Friday at 3:00 PM.',
    isRead: true,
    createdAt: daysAgo(3),
    link: '/candidate/applications',
  },
  {
    id: 'n4',
    userId: 'user_1',
    type: 'system',
    title: 'Profile Strength: 85%',
    message: 'Add your portfolio link to reach a 100% profile score.',
    isRead: true,
    createdAt: daysAgo(7),
    link: '/candidate/profile',
  },
]

export function getJobById(id: string): MockJob | undefined {
  return MOCK_JOBS.find(job => job.id === id)
}

export function getCompanyById(id: string): MockCompany | undefined {
  return MOCK_COMPANIES.find(company => company.id === id)
}
