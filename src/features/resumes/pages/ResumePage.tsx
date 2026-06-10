import { useEffect, useState } from 'react'
import {
  Download,
  FileText,
  GraduationCap,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
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
  const { profile, refetch, updateProfile, isSaving } = useCandidateProfile()
  const resumeUrl = profile?.resumeUrl ?? null
  const [summary, setSummary] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [skillTags, setSkillTags] = useState<string[]>([])
  const [experience, setExperience] = useState<ExperienceItem[]>([])
  const [education, setEducation] = useState<EducationItem[]>([])

  // Seed editable fields from the saved profile (bio → summary, skills).
  useEffect(() => {
    if (!profile) return
    setSummary(profile.bio ?? '')
    setSkillTags(profile.skills ?? [])
  }, [profile])

  function addSkill(raw: string) {
    const skill = raw.trim()
    if (!skill) return
    if (skillTags.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setSkillInput('')
      return
    }
    setSkillTags((prev) => [...prev, skill])
    setSkillInput('')
  }

  function removeSkill(skill: string) {
    setSkillTags((prev) => prev.filter((s) => s !== skill))
  }

  const skillCount = skillTags.length
  const checks = [
    { label: 'Professional summary added', done: summary.trim().length >= 30 },
    { label: 'At least 5 relevant skills', done: skillCount >= 5 },
    { label: 'Work experience added', done: experience.length > 0 },
    { label: 'Resume file uploaded', done: Boolean(resumeUrl) },
  ]
  const score = Math.round((checks.filter(c => c.done).length / checks.length) * 100)

  async function handleSave() {
    try {
      await updateProfile({
        bio: summary || undefined,
        skills: skillTags,
      })
      void refetch()
      toast({ title: 'Resume saved', variant: 'success' })
    } catch (err) {
      toast({
        title: 'Could not save',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    }
  }

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
          <>
            {resumeUrl && (
              <>
                <Button variant="outline" asChild>
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4" /> View resume
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={resumeUrl} download>
                    <Download className="h-4 w-4" /> Download
                  </a>
                </Button>
              </>
            )}
            <Button onClick={handleSave} loading={isSaving}>
              <Save className="h-4 w-4" /> Save
            </Button>
          </>
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
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault()
                    addSkill(skillInput)
                  } else if (e.key === 'Backspace' && !skillInput && skillTags.length > 0) {
                    removeSkill(skillTags[skillTags.length - 1])
                  }
                }}
                onBlur={() => {
                  if (skillInput.trim()) addSkill(skillInput)
                }}
                placeholder="Type a skill and press Enter"
              />
              {skillTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {skillTags.map((skill) => (
                    <Badge key={skill} variant="soft" className="gap-1 pr-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="rounded-full p-0.5 hover:bg-muted"
                        aria-label={`Remove ${skill}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Press Enter to add each skill. Click Save to persist them to your profile.
              </p>
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
                {checks.map(c => (
                  <li key={c.label} className={c.done ? 'text-foreground' : ''}>
                    {c.done ? '✓' : '○'} {c.label}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
