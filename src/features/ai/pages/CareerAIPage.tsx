import { useState } from 'react'
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

const FEEDBACK = [
  { type: 'strength', text: 'Strong action verbs and quantified achievements throughout.' },
  { type: 'strength', text: 'Good keyword density for software engineering roles.' },
  { type: 'improve', text: 'Add a portfolio or GitHub link to boost credibility.' },
  { type: 'improve', text: 'Tailor your summary to each specific job application.' },
  { type: 'improve', text: 'Consider adding 1-2 measurable outcomes to your latest role.' },
]

function useFakeGeneration() {
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  function generate(producer: () => string) {
    setLoading(true)
    setOutput('')
    setTimeout(() => {
      setOutput(producer())
      setLoading(false)
    }, 1100)
  }
  return { loading, output, generate, setOutput }
}

export default function CareerAIPage() {
  const cover = useFakeGeneration()
  const interview = useFakeGeneration()
  const [role, setRole] = useState('Senior Software Engineer')
  const [company, setCompany] = useState('10Pearls Pakistan')

  return (
    <div>
      <PageHeader
        title="Career AI"
        description="AI-powered tools to score your resume, match jobs, and prepare for interviews."
      />

      <Tabs defaultValue="score">
        <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="score" className="gap-1.5">
            <Gauge className="h-4 w-4" /> Resume Score
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

        {/* Resume score */}
        <TabsContent value="score">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: 'Overall Score', value: 82, hint: 'Strong resume', color: 'from-primary to-emerald-500' },
              { label: 'ATS Compatibility', value: 91, hint: 'Excellent', color: 'from-info to-blue-500' },
              { label: 'Keyword Match', value: 74, hint: 'Good', color: 'from-warning to-amber-500' },
            ].map(stat => (
              <Card key={stat.label}>
                <CardContent className="space-y-3 p-6">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-4xl font-bold">{stat.value}%</p>
                  <Progress value={stat.value} indicatorClassName={`bg-gradient-to-r ${stat.color}`} />
                  <Badge variant="soft">{stat.hint}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-6 bg-gradient-to-br from-primary/10 to-emerald-500/10">
            <CardContent className="flex flex-wrap items-center gap-4 p-6">
              <Sparkles className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-semibold">Your resume ranks in the top 20% for software roles</p>
                <p className="text-sm text-muted-foreground">
                  Apply the AI feedback suggestions to push your score above 90.
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
                {FEEDBACK.filter(f => f.type === 'strength').map((f, i) => (
                  <p key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-success">✓</span> {f.text}
                  </p>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-warning">Suggestions to improve</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {FEEDBACK.filter(f => f.type === 'improve').map((f, i) => (
                  <p key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-warning">→</span> {f.text}
                  </p>
                ))}
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
                  <Input value={role} onChange={e => setRole(e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Company</Label>
                  <Input value={company} onChange={e => setCompany(e.target.value)} />
                </div>
                <Button
                  className="w-full"
                  loading={cover.loading}
                  onClick={() =>
                    cover.generate(
                      () =>
                        `Dear Hiring Manager at ${company},\n\nI am excited to apply for the ${role} position. With over five years of experience building scalable, user-focused products, I am confident I can make an immediate impact on your team.\n\nIn my current role I led the development of a platform serving 200,000+ users, improving performance by 40% and mentoring a team of five engineers. I am particularly drawn to ${company}’s reputation for innovation and engineering excellence.\n\nI would welcome the opportunity to discuss how my background aligns with your goals.\n\nWarm regards,\nAli Ahmed`,
                    )
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
                <Input value={role} onChange={e => setRole(e.target.value)} placeholder="Role you’re preparing for" />
                <Button
                  className="shrink-0"
                  loading={interview.loading}
                  onClick={() =>
                    interview.generate(() =>
                      [
                        `1. Walk me through a challenging project you delivered as a ${role}.`,
                        '2. How do you approach designing a scalable system from scratch?',
                        '3. Describe a time you disagreed with a teammate. How did you resolve it?',
                        '4. How do you ensure code quality across a team?',
                        '5. What metrics do you track to measure the success of a feature?',
                        '6. How do you stay current with new technologies?',
                      ].join('\n\n'),
                    )
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
                  {interview.loading ? 'Preparing your questions…' : 'Generate tailored interview questions for your target role.'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
