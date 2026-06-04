import { useState } from 'react'
import {
  Download,
  FileText,
  GraduationCap,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  Briefcase as BriefcaseIcon,
} from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Progress } from '@/shared/components/ui/progress'
import { PageHeader } from '@/shared/components/common/PageHeader'
import { FileUpload } from '@/shared/components/common/FileUpload'
import { useToast } from '@/shared/components/ui/toast'
import { useCandidateProfile } from '@/features/candidates/hooks/useCandidateProfile'
import { uploadResume, deleteResume } from '@/shared/services/uploads.api'

interface ExperienceItem {
  id: string
  title: string
  company: string
  duration: string
  description: string
}
interface EducationItem {
  id: string
  degree: string
  institute: string
  year: string
}

export default function ResumePage() {
  const { toast } = useToast()
  const { profile, refetch } = useCandidateProfile()
  const resumeUrl = profile?.resumeUrl ?? null
  const [summary, setSummary] = useState(
    'Results-driven software engineer with 5+ years building scalable web applications using React and Node.js.',
  )
  const [skills, setSkills] = useState('React, TypeScript, Node.js, PostgreSQL, AWS, Tailwind CSS')
  const [experience, setExperience] = useState<ExperienceItem[]>([
    {
      id: 'e1',
      title: 'Senior Software Engineer',
      company: '10Pearls Pakistan',
      duration: '2022 — Present',
      description: 'Led a team of 5 engineers building a fintech platform serving 200k+ users.',
    },
  ])
  const [education, setEducation] = useState<EducationItem[]>([
    { id: 'ed1', degree: 'BS Computer Science', institute: 'FAST-NUCES, Lahore', year: '2019' },
  ])

  const filledSections = [summary, skills].filter(Boolean).length + (experience.length ? 1 : 0) + (education.length ? 1 : 0)
  const score = Math.min(100, 40 + filledSections * 15)

  function addExperience() {
    setExperience(prev => [
      ...prev,
      { id: `e${Date.now()}`, title: '', company: '', duration: '', description: '' },
    ])
  }
  function addEducation() {
    setEducation(prev => [...prev, { id: `ed${Date.now()}`, degree: '', institute: '', year: '' }])
  }

  return (
    <div>
      <PageHeader
        title="Resume Builder"
        description="Build a professional resume and let AI score it before you apply."
        actions={
          resumeUrl ? (
            <>
              <Button variant="outline" asChild>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4" /> View resume
                </a>
              </Button>
              <Button asChild>
                <a href={resumeUrl} download>
                  <Download className="h-4 w-4" /> Download
                </a>
              </Button>
            </>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" /> Professional summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea rows={4} value={summary} onChange={e => setSummary(e.target.value)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <BriefcaseIcon className="h-4 w-4" /> Work experience
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {experience.map((exp, i) => (
                <div key={exp.id} className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Experience {i + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setExperience(prev => prev.filter(e => e.id !== exp.id))}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      placeholder="Job title"
                      value={exp.title}
                      onChange={e => setExperience(prev => prev.map(x => (x.id === exp.id ? { ...x, title: e.target.value } : x)))}
                    />
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={e => setExperience(prev => prev.map(x => (x.id === exp.id ? { ...x, company: e.target.value } : x)))}
                    />
                  </div>
                  <Input
                    placeholder="Duration (e.g. 2022 — Present)"
                    value={exp.duration}
                    onChange={e => setExperience(prev => prev.map(x => (x.id === exp.id ? { ...x, duration: e.target.value } : x)))}
                  />
                  <Textarea
                    rows={2}
                    placeholder="What did you achieve in this role?"
                    value={exp.description}
                    onChange={e => setExperience(prev => prev.map(x => (x.id === exp.id ? { ...x, description: e.target.value } : x)))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="h-4 w-4" /> Education
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {education.map(ed => (
                <div key={ed.id} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-[2fr_2fr_1fr_auto]">
                  <Input
                    placeholder="Degree"
                    value={ed.degree}
                    onChange={e => setEducation(prev => prev.map(x => (x.id === ed.id ? { ...x, degree: e.target.value } : x)))}
                  />
                  <Input
                    placeholder="Institute"
                    value={ed.institute}
                    onChange={e => setEducation(prev => prev.map(x => (x.id === ed.id ? { ...x, institute: e.target.value } : x)))}
                  />
                  <Input
                    placeholder="Year"
                    value={ed.year}
                    onChange={e => setEducation(prev => prev.map(x => (x.id === ed.id ? { ...x, year: e.target.value } : x)))}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEducation(prev => prev.filter(x => x.id !== ed.id))}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Comma separated skills" />
              <div className="flex flex-wrap gap-1.5">
                {skills
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean)
                  .map(s => (
                    <Badge key={s} variant="soft">
                      {s}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Upload className="h-4 w-4" /> Resume file
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                accept=".pdf,.doc,.docx"
                hint="PDF, DOC, DOCX up to 10MB"
                maxSizeMB={10}
                variant="document"
                currentUrl={resumeUrl}
                fileName="My resume"
                upload={async (file, onProgress) => {
                  const { resumeUrl: url } = await uploadResume(file, onProgress)
                  void refetch()
                  return url
                }}
                onRemove={async () => {
                  await deleteResume()
                  void refetch()
                }}
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-emerald-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" /> AI Resume Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-4xl font-bold text-primary">{score}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
              <Progress value={score} indicatorClassName="bg-gradient-to-r from-primary to-emerald-500" />
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Clear professional summary</li>
                <li>✓ Quantified achievements</li>
                <li>{skills.split(',').length >= 5 ? '✓' : '○'} Add at least 5 relevant skills</li>
                <li>○ Add a portfolio or GitHub link</li>
              </ul>
              <Button
                className="w-full"
                onClick={() => toast({ title: 'AI analysis complete', description: 'See suggestions in Career AI.', variant: 'success' })}
              >
                Re-analyze with AI
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
