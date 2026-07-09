import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react'

import { Logo } from './Logo'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useAuthStore } from '@/app/store/auth.store'
import { ROUTES } from '@/shared/constants'
import type { UserRole } from '@/shared/types'

type FooterLink = { label: string; to: string }
type FooterSection = { title: string; links: FooterLink[] }

const GUEST_SECTIONS: FooterSection[] = [
  {
    title: 'Job Seekers',
    links: [
      { label: 'Browse Jobs', to: ROUTES.jobs },
      { label: 'Remote Jobs', to: ROUTES.remoteJobs },
      { label: 'Government Jobs', to: ROUTES.governmentJobs },
      { label: 'Create Account', to: ROUTES.register },
      { label: 'Sign In', to: ROUTES.login },
    ],
  },
  {
    title: 'Employers',
    links: [
      { label: 'Post a Job', to: ROUTES.employerPostJob },
      { label: 'Employer Sign Up', to: ROUTES.register },
      { label: 'Browse Companies', to: ROUTES.companies },
      { label: 'Employer Login', to: ROUTES.login },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: ROUTES.about },
      { label: 'Contact Us', to: ROUTES.contact },
      { label: 'Privacy Policy', to: ROUTES.privacy },
      { label: 'Terms of Service', to: ROUTES.terms },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: ROUTES.contact },
      { label: 'Report an Issue', to: ROUTES.contact },
    ],
  },
]

const CANDIDATE_SECTIONS: FooterSection[] = [
  {
    title: 'My Career',
    links: [
      { label: 'Dashboard', to: ROUTES.candidateDashboard },
      { label: 'My Applications', to: ROUTES.candidateApplications },
      { label: 'Saved Jobs', to: ROUTES.candidateSavedJobs },
      { label: 'My Profile', to: ROUTES.candidateProfile },
      { label: 'Resume', to: ROUTES.candidateResume },
      { label: 'Job Alerts', to: ROUTES.candidateAlerts },
    ],
  },
  {
    title: 'Find Jobs',
    links: [
      { label: 'Browse Jobs', to: ROUTES.jobs },
      { label: 'Recommended', to: ROUTES.candidateRecommended },
      { label: 'Remote Jobs', to: ROUTES.remoteJobs },
      { label: 'Government Jobs', to: ROUTES.governmentJobs },
      { label: 'Career AI', to: ROUTES.candidateAi },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: ROUTES.about },
      { label: 'Contact Us', to: ROUTES.contact },
      { label: 'Privacy Policy', to: ROUTES.privacy },
      { label: 'Terms of Service', to: ROUTES.terms },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Settings', to: `${ROUTES.candidateDashboard}/settings` },
      { label: 'Browse Companies', to: ROUTES.companies },
    ],
  },
]

const EMPLOYER_SECTIONS: FooterSection[] = [
  {
    title: 'Hiring',
    links: [
      { label: 'Dashboard', to: ROUTES.employerDashboard },
      { label: 'My Jobs', to: ROUTES.employerJobs },
      { label: 'Post a Job', to: ROUTES.employerPostJob },
      { label: 'Applicants', to: ROUTES.employerApplicants },
      { label: 'Interviews', to: ROUTES.employerInterviews },
      { label: 'Analytics', to: ROUTES.employerAnalytics },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Company Profile', to: ROUTES.employerCompany },
      { label: 'Browse Jobs', to: ROUTES.jobs },
      { label: 'Top Companies', to: ROUTES.companies },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'About Us', to: ROUTES.about },
      { label: 'Contact Us', to: ROUTES.contact },
      { label: 'Privacy Policy', to: ROUTES.privacy },
      { label: 'Terms of Service', to: ROUTES.terms },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Settings', to: `${ROUTES.employerDashboard}/settings` },
    ],
  },
]

const ADMIN_SECTIONS: FooterSection[] = [
  {
    title: 'Administration',
    links: [
      { label: 'Dashboard', to: ROUTES.adminDashboard },
      { label: 'Users', to: ROUTES.adminUsers },
      { label: 'Employers', to: ROUTES.adminEmployers },
      { label: 'Jobs', to: ROUTES.adminJobs },
      { label: 'Categories', to: ROUTES.adminCategories },
      { label: 'Analytics', to: ROUTES.adminAnalytics },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Browse Jobs', to: ROUTES.jobs },
      { label: 'Companies', to: ROUTES.companies },
      { label: 'Revenue', to: ROUTES.adminRevenue },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: ROUTES.about },
      { label: 'Contact Us', to: ROUTES.contact },
      { label: 'Privacy Policy', to: ROUTES.privacy },
      { label: 'Terms of Service', to: ROUTES.terms },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Settings', to: `${ROUTES.adminDashboard}/settings` },
    ],
  },
]

function sectionsForRole(role: UserRole | undefined, isAuthenticated: boolean): FooterSection[] {
  if (!isAuthenticated || !role) return GUEST_SECTIONS
  switch (role) {
    case 'candidate':
      return CANDIDATE_SECTIONS
    case 'employer':
      return EMPLOYER_SECTIONS
    case 'admin':
      return ADMIN_SECTIONS
    default:
      return GUEST_SECTIONS
  }
}

export function PublicFooter() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const sections = useMemo(
    () => sectionsForRole(user?.role, isAuthenticated),
    [user?.role, isAuthenticated],
  )

  return (
    <footer className="mt-20 border-t border-border bg-muted/30">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo size="md" />
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Pakistan&apos;s most modern AI-powered job portal. We connect professionals with the right
              opportunities across Pakistan and remote roles worldwide.
            </p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>dev.alihaidar.eng@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+92 3107580073</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Lahore</span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Instagram, label: 'Instagram' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {sections.map(section => (
              <div key={section.title}>
                <h4 className="mb-4 text-sm font-semibold text-foreground">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {!isAuthenticated && (
          <div className="mt-12 rounded-2xl border border-border bg-background p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h4 className="text-lg font-semibold">Stay updated with new opportunities</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get fresh jobs in your inbox every Monday. No spam, only quality openings.
                </p>
              </div>
              <form
                onSubmit={e => e.preventDefault()}
                className="flex w-full max-w-md flex-col items-stretch gap-2 sm:flex-row"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  leftIcon={<Mail />}
                  className="h-11"
                  required
                />
                <Button type="submit" className="h-11 shrink-0">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border/60">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Pakistan Career Hub (Pvt.) Ltd. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with <span aria-label="love" className="text-destructive">♥</span> in Pakistan
          </p>
        </div>
      </div>
    </footer>
  )
}
