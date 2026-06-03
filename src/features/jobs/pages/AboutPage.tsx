import { Link } from 'react-router-dom'
import { Briefcase, Building2, Globe, Heart, Sparkles, Target, TrendingUp, Users } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { APP_NAME, ROUTES } from '@/shared/constants'

const STATS = [
  { label: 'Jobs posted', value: '1.2M+', icon: Briefcase },
  { label: 'Companies', value: '8,400+', icon: Building2 },
  { label: 'Professionals', value: '2.1M+', icon: Users },
  { label: 'Cities covered', value: '120+', icon: Globe },
]

const VALUES = [
  { title: 'Candidate first', desc: 'Every decision starts with what is best for job seekers.', icon: Heart },
  { title: 'Built for Pakistan', desc: 'Localised for the realities of the Pakistani job market.', icon: Target },
  { title: 'Powered by AI', desc: 'Smart matching that saves both candidates and recruiters time.', icon: Sparkles },
  { title: 'Always improving', desc: 'We ship fast and listen to our community constantly.', icon: TrendingUp },
]

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="container py-16 text-center">
          <Badge variant="soft" className="mb-3">
            Our story
          </Badge>
          <h1 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            We’re building the future of hiring in Pakistan
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {APP_NAME} was founded with a simple mission: to connect Pakistan’s talent with the right opportunities
            using technology that actually understands people — not just keywords.
          </p>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map(stat => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-14">
        <div className="container">
          <h2 className="text-center text-2xl font-bold tracking-tight">What we stand for</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(value => {
              const Icon = value.icon
              return (
                <Card key={value.title}>
                  <CardContent className="space-y-2 p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="container py-16 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Join 2 million+ professionals</h2>
        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
          Whether you’re looking for your next role or your next great hire, we’d love to have you.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild size="lg">
            <Link to={ROUTES.register}>Get started free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to={ROUTES.contact}>Contact us</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
