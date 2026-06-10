export const APP_NAME = 'Pakistan Career Hub'
export const APP_TAGLINE = 'Find Your Dream Career in Pakistan'
export const APP_DESCRIPTION =
  'Pakistan\'s most modern AI-powered job portal. Find jobs that match your skills.'

export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Larkana',
  'Sheikhupura',
  'Mardan',
  'Mingora',
  'Abbottabad',
  'Sahiwal',
  'Okara',
  'Dera Ghazi Khan',
  'Mirpur',
  'Muzaffarabad',
  'Gilgit',
  'Skardu',
  'Remote',
] as const

export type PakistanCity = (typeof PAKISTAN_CITIES)[number]

export const JOB_CATEGORIES = [
  { value: 'software', label: 'Software & IT', icon: 'Code2' },
  { value: 'engineering', label: 'Engineering', icon: 'Wrench' },
  { value: 'sales', label: 'Sales & Marketing', icon: 'TrendingUp' },
  { value: 'finance', label: 'Finance & Accounting', icon: 'Calculator' },
  { value: 'hr', label: 'Human Resources', icon: 'Users' },
  { value: 'design', label: 'Design & Creative', icon: 'Palette' },
  { value: 'healthcare', label: 'Healthcare & Medical', icon: 'Stethoscope' },
  { value: 'education', label: 'Education & Training', icon: 'GraduationCap' },
  { value: 'customer_service', label: 'Customer Service', icon: 'Headphones' },
  { value: 'logistics', label: 'Logistics & Supply Chain', icon: 'Truck' },
  { value: 'manufacturing', label: 'Manufacturing', icon: 'Factory' },
  { value: 'banking', label: 'Banking & Insurance', icon: 'Landmark' },
  { value: 'government', label: 'Government Jobs', icon: 'Building2' },
  { value: 'media', label: 'Media & Journalism', icon: 'Newspaper' },
  { value: 'legal', label: 'Legal & Compliance', icon: 'Scale' },
] as const

export const JOB_TYPES = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'temporary', label: 'Temporary' },
] as const

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level (0-1 years)' },
  { value: 'junior', label: 'Junior (1-3 years)' },
  { value: 'mid', label: 'Mid-Level (3-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'lead', label: 'Lead (8+ years)' },
  { value: 'executive', label: 'Executive (C-Level)' },
] as const

export const WORK_MODES = [
  { value: 'onsite', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
] as const

export const EDUCATION_LEVELS = [
  { value: 'matric', label: 'Matric / SSC' },
  { value: 'intermediate', label: 'Intermediate / FA / FSC' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'bachelors', label: 'Bachelor\'s Degree' },
  { value: 'masters', label: 'Master\'s Degree' },
  { value: 'mphil', label: 'MPhil' },
  { value: 'phd', label: 'PhD / Doctorate' },
] as const

export const SALARY_RANGES = [
  { value: '0-30000', label: 'Below 30k', min: 0, max: 30000 },
  { value: '30000-60000', label: '30k - 60k', min: 30000, max: 60000 },
  { value: '60000-100000', label: '60k - 1 Lac', min: 60000, max: 100000 },
  { value: '100000-200000', label: '1 Lac - 2 Lac', min: 100000, max: 200000 },
  { value: '200000-500000', label: '2 Lac - 5 Lac', min: 200000, max: 500000 },
  { value: '500000-9999999', label: 'Above 5 Lac', min: 500000, max: 9_999_999 },
] as const

export const APPLICATION_STATUSES = [
  { value: 'applied', label: 'Applied', color: 'info' },
  { value: 'reviewed', label: 'Reviewed', color: 'warning' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'success' },
  { value: 'interview', label: 'Interview Scheduled', color: 'primary' },
  { value: 'offered', label: 'Offered', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'destructive' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'muted' },
] as const

export const ROUTES = {
  home: '/',
  jobs: '/jobs',
  jobDetails: (id: string | number) => `/jobs/${id}`,
  companies: '/companies',
  companyDetails: (id: string | number) => `/companies/${id}`,
  remoteJobs: '/jobs/remote',
  governmentJobs: '/jobs/government',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',
  // Candidate
  candidateDashboard: '/candidate',
  candidateProfile: '/candidate/profile',
  candidateResume: '/candidate/resume',
  candidateApplications: '/candidate/applications',
  candidateSavedJobs: '/candidate/saved',
  candidateAlerts: '/candidate/alerts',
  candidateRecommended: '/candidate/recommended',
  candidateAi: '/candidate/ai',
  // Employer
  employerDashboard: '/employer',
  employerCompany: '/employer/company',
  employerJobs: '/employer/jobs',
  employerPostJob: '/employer/jobs/new',
  employerEditJob: (id: string | number) => `/employer/jobs/${id}/edit`,
  employerApplicants: '/employer/applicants',
  employerApplicantDetail: (id: string) => `/employer/applicants/${id}`,
  employerInterviews: '/employer/interviews',
  employerAnalytics: '/employer/analytics',
  employerBilling: '/employer/billing',
  // Admin
  adminDashboard: '/admin',
  adminUsers: '/admin/users',
  adminEmployers: '/admin/employers',
  adminJobs: '/admin/jobs',
  adminCategories: '/admin/categories',
  adminRevenue: '/admin/revenue',
  adminAnalytics: '/admin/analytics',
  adminPlans: '/admin/plans',
  adminPayments: '/admin/payments',
} as const

export const MAX_PROFILE_SKILLS = 6
export const MAX_JOB_SKILLS = 10

export const PAGINATION = {
  defaultPageSize: 12,
  jobsPerPage: 10,
  maxPageButtons: 7,
} as const

export const STORAGE_KEYS = {
  authToken: 'pch.auth.token',
  refreshToken: 'pch.auth.refresh',
  authUser: 'pch.auth.user',
  theme: 'pch.theme',
  recentSearches: 'pch.recent_searches',
  savedJobs: 'pch.saved_jobs',
  jobAlerts: 'pch.job_alerts',
  candidateExtras: 'pch.candidate_extras',
} as const

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  '/api/v1'
