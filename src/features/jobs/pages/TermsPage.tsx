import { APP_NAME } from '@/shared/constants'

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using ${APP_NAME}, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform.`,
  },
  {
    title: '2. Eligibility',
    body: 'You must be at least 18 years old and legally able to enter into contracts to use our services as a candidate or employer.',
  },
  {
    title: '3. Account Responsibilities',
    body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.',
  },
  {
    title: '4. Acceptable Use',
    body: 'You agree not to post false information, spam, fraudulent job listings, or any content that is unlawful, discriminatory, or harmful to others.',
  },
  {
    title: '5. Employer Obligations',
    body: 'Employers must post genuine opportunities, comply with Pakistani labour laws, and treat candidate data with confidentiality and respect.',
  },
  {
    title: '6. Limitation of Liability',
    body: `${APP_NAME} acts as a platform connecting candidates and employers. We are not party to any employment agreement and are not liable for hiring decisions or outcomes.`,
  },
  {
    title: '7. Changes to Terms',
    body: 'We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the revised terms.',
  },
]

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-14">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: January 2026</p>
      <div className="mt-8 space-y-8">
        {SECTIONS.map(section => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
