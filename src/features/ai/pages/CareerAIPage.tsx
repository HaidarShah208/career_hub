import { useMemo, useState } from 'react'
import { FileText, Gauge, Lightbulb, MessageSquareQuote, PenLine, Sparkles } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Progress } from '@/shared/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { useAuthStore } from '@/app/store/auth.store'
import { useCandidateProfile } from '@/features/candidates/hooks/useCandidateProfile'
import { getCandidateExtras } from '@/features/candidates/lib/extras'
import { computeProfileSteps, profileScore as scoreFromSteps } from '@/features/candidates/lib/profile'

function band(value: number): string {
  if (value >= 80) return 'Excellent'
  if (value >= 60) return 'Good'
  if (value >= 40) return 'Needs work'
  return 'Just getting started'
}

function useGeneration() {
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  function generate(producer: () => string) {
    setLoading(true)
    setOutput('')
    setTimeout(() => {
      setOutput(producer())
      setLoading(false)
    }, 1000)
  }
  return { loading, output, generate, setOutput }
}

export default function CareerAIPage() {
  const user = useAuthStore(s => s.user)
  const { profile } = useCandidateProfile()
  const cover = useGeneration()
  const interview = useGeneration()
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')

  const skills = useMemo(() => profile?.skills ?? [], [profile])
  const skillCount = skills.length
  const extras = getCandidateExtras(user?.id)

  const overall = scoreFromSteps(computeProfileSteps(profile, user ?? null))
  const ats = Math.min(
    100,
    (profile?.resumeUrl ? 55 : 25) + (profile?.bio ? 25 : 0) + (skillCount >= 5 ? 20 : skillCount * 2),
  )
  const keyword = Math.min(100, skillCount * 12)

  const scoreStats = [
    { label: 'Profile Score', value: overall, color: 'from-primary to-emerald-500' },
    { label: 'ATS Readiness', value: ats, color: 'from-info to-blue-500' },
    { label: 'Skill Coverage', value: keyword, color: 'from-warning to-amber-500' },
  ]

  const strengths: string[] = []
  const improvements: string[] = []
  if (profile?.headline) strengths.push('Professional headline is set.')
  if (profile?.bio) strengths.push('You have a written professional summary.')
  if (skillCount >= 5) strengths.push(`Strong skill list (${skillCount} skills).`)
  if (profile?.resumeUrl) strengths.push('Resume file uploaded and ready to share.')
  if ((profile?.experienceYears ?? 0) > 0) strengths.push('Experience level is specified.')

  if (!profile?.headline) improvements.push('Add a professional headline to your profile.')
  if (!profile?.bio) improvements.push('Write a professional summary describing your strengths.')
  if (skillCount < 5) improvements.push('Add at least 5 relevant skills to improve job matches.')
  if (!profile?.resumeUrl) improvements.push('Upload a resume file (PDF/DOC) so you can apply faster.')
  if (!extras.linkedin && !extras.portfolio) improvements.push('Add a LinkedIn or portfolio link to boost credibility.')

  const hasProfileData = Boolean(profile?.headline || profile?.bio || skillCount > 0 || profile?.resumeUrl)

  return (
    <div>
      <PageHeader
        title="Career AI"
        description="AI-powered tools to score your profile, match jobs, and prepare for interviews."
      />

      <Tabs defaultValue="score">
        <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="score" className="gap-1.5">
            <Gauge className="h-4 w-4" /> Profile Score
          </TabsTrigger>
          <TabsTrigger value="feedback" className="gap-1.5">
            <Lightbulb className="h-4 w-4" /> AI Feedback
          </TabsTrigger>
          <TabsTrigger value="cover" className="gap-1.5">
            <PenLine className="h-4 w-4" /> Cover Letter
          </TabsTrigger>
          <TabsTrigger value="interview" className="gap-1.5">
            <MessageSquareQuote className="h-4 w-4" /> Interview Prep
          </TabsTrigger>
        </TabsList>

        {/* Profile score */}
        <TabsContent value="score">
          <div className="grid gap-6 md:grid-cols-3">
            {scoreStats.map(stat => (
              <Card key={stat.label}>
                <CardContent className="space-y-3 p-6">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-4xl font-bold">{stat.value}%</p>
                  <Progress value={stat.value} indicatorClassName={`bg-gradient-to-r ${stat.color}`} />
                  <Badge variant="soft">{band(stat.value)}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-6 bg-gradient-to-br from-primary/10 to-emerald-500/10">
            <CardContent className="flex flex-wrap items-center gap-4 p-6">
              <Sparkles className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-semibold">
                  {overall >= 80
                    ? 'Your profile is strong and ready for applications'
                    : overall >= 50
                      ? 'Your profile is taking shape'
                      : 'Complete your profile to unlock better matches'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {improvements.length
                    ? `Next step: ${improvements[0]}`
                    : 'Everything looks complete — keep your skills up to date.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback */}
        <TabsContent value="feedback">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-success">What’s working well</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {strengths.length ? (
                  strengths.map((text, i) => (
                    <p key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-success">✓</span> {text}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Start filling in your profile to see what’s working.
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-warning">Suggestions to improve</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {improvements.length ? (
                  improvements.map((text, i) => (
                    <p key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-warning">→</span> {text}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Your profile is complete. Nice work!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cover letter */}
        <TabsContent value="cover">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Generate a cover letter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-1.5 block">Job title</Label>
                  <Input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Backend Developer" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Company</Label>
                  <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Systems Ltd" />
                </div>
                <Button
                  className="w-full"
                  loading={cover.loading}
                  onClick={() =>
                    cover.generate(() => {
                      const skillLine = skillCount
                        ? ` with hands-on experience across ${skills.slice(0, 4).join(', ')}`
                        : ''
                      const years = profile?.experienceYears ?? 0
                      return `Dear Hiring Manager at ${company || 'your company'},\n\nI am excited to apply for the ${role || 'open'} position.${
                        profile?.headline ? ` As a ${profile.headline},` : ''
                      } I bring ${years > 0 ? `${years}+ years of` : 'relevant'} experience${skillLine}.\n\n${
                        profile?.bio ? `${profile.bio}\n\n` : ''
                      }I would welcome the opportunity to discuss how my background aligns with your team’s goals.\n\nWarm regards,\n${
                        user?.fullName ?? 'Your name'
                      }`
                    })
                  }
                >
                  <Sparkles className="h-4 w-4" /> Generate with AI
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" /> Generated cover letter
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cover.output ? (
                  <Textarea
                    value={cover.output}
                    onChange={e => cover.setOutput(e.target.value)}
                    rows={14}
                    className="text-sm"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-center text-sm text-muted-foreground">
                    {cover.loading ? 'Writing your cover letter…' : 'Your AI-generated cover letter will appear here.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Interview prep */}
        <TabsContent value="interview">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interview question generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder={profile?.headline ? `e.g. ${profile.headline}` : 'Role you’re preparing for'}
                />
                <Button
                  className="shrink-0"
                  loading={interview.loading}
                  onClick={() =>
                    interview.generate(() => {
                      const target = role || profile?.headline || 'this role'
                      const skillQ = skillCount
                        ? `2. Walk me through a project where you used ${skills[0]}.`
                        : '2. Walk me through a project you are most proud of.'
                      return [
                        `1. Tell me about your experience as a ${target}.`,
                        skillQ,
                        '3. How do you approach designing a scalable system from scratch?',
                        '4. Describe a time you disagreed with a teammate. How did you resolve it?',
                        '5. How do you ensure quality in your work?',
                        '6. How do you stay current with new technologies?',
                      ].join('\n\n')
                    })
                  }
                >
                  <Sparkles className="h-4 w-4" /> Generate questions
                </Button>
              </div>
              {interview.output ? (
                <div className="whitespace-pre-line rounded-lg border border-border bg-muted/30 p-5 text-sm leading-relaxed">
                  {interview.output}
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-center text-sm text-muted-foreground">
                  {interview.loading
                    ? 'Preparing your questions…'
                    : hasProfileData
                      ? 'Generate tailored interview questions for your target role.'
                      : 'Add your headline and skills in your profile for more tailored questions.'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
