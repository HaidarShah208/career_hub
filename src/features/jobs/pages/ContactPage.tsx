import { useState } from 'react'
import { Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { useToast } from '@/shared/components/ui/toast'

const CONTACT_INFO = [
  { icon: Mail, label: 'Email', value: 'alhi7896542@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+92 3107580073' },
  { icon: MapPin, label: 'Office', value: 'Garden Town, Lahore' },
]

export default function ContactPage() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      ;(e.target as HTMLFormElement).reset()
      toast({ title: 'Message sent!', description: 'We’ll get back to you within 24 hours.', variant: 'success' })
    }, 900)
  }

  return (
    <div className="container py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Get in touch</h1>
        <p className="mt-3 text-muted-foreground">
          Have a question, partnership idea, or feedback? We’d love to hear from you.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {CONTACT_INFO.map(info => {
            const Icon = info.icon
            return (
              <Card key={info.label}>
                <CardContent className="flex items-center gap-4 p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">{info.label}</p>
                    <p className="font-medium">{info.value}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          <Card className="bg-primary/5">
            <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
              <MessageSquare className="h-5 w-5 text-primary" />
              Live chat available Mon–Sat, 9 AM – 9 PM (PKT)
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required placeholder="Your name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required placeholder="you@example.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required placeholder="How can we help?" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" required rows={5} placeholder="Write your message…" />
              </div>
              <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
                <Send className="h-4 w-4" /> Send message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
