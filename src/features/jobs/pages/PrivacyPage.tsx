import { APP_NAME } from '@/shared/constants'

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide directly — such as your name, email, phone number, resume, and profile details — as well as usage data like pages visited, searches performed, and jobs viewed.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'Your information is used to match you with relevant jobs, power our AI recommendation engine, communicate updates and alerts, and improve the overall platform experience.',
  },
  {
    title: '3. Sharing With Employers',
    body: 'When you apply to a job, your profile and resume are shared with that employer. We never sell your personal data to third parties for advertising.',
  },
  {
    title: '4. Data Security',
    body: 'We use industry-standard encryption and security practices to protect your data. Access is restricted to authorised personnel only.',
  },
  {
    title: '5. Your Rights',
    body: 'You can access, update, or delete your personal information at any time from your account settings. You may also opt out of marketing communications.',
  },
  {
    title: '6. Cookies',
    body: 'We use cookies to remember your preferences, keep you signed in, and analyse traffic. You can control cookies through your browser settings.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-14">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: January 2026</p>
      <p className="mt-6 leading-relaxed text-muted-foreground">
        At {APP_NAME}, we take your privacy seriously. This policy explains what data we collect, how we use it, and
        the choices you have.
      </p>
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
