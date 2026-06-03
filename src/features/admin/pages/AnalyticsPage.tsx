import {
  Area,
  AreaChart,
  Cell,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Activity, Eye, MousePointerClick, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { StatCard } from '@/shared/components/common/StatCard'
import { PageHeader } from '@/shared/components/common/PageHeader'

const TRAFFIC = [
  { day: 'Mon', visitors: 4200, signups: 120 },
  { day: 'Tue', visitors: 5100, signups: 160 },
  { day: 'Wed', visitors: 4800, signups: 140 },
  { day: 'Thu', visitors: 6200, signups: 210 },
  { day: 'Fri', visitors: 7100, signups: 260 },
  { day: 'Sat', visitors: 5400, signups: 180 },
  { day: 'Sun', visitors: 4000, signups: 110 },
]

const DEVICES = [
  { name: 'Mobile', value: 62 },
  { name: 'Desktop', value: 31 },
  { name: 'Tablet', value: 7 },
]

const COLORS = ['hsl(var(--primary))', '#3b82f6', '#f59e0b']

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
}

export default function AdminAnalyticsPage() {
  return (
    <div>
      <PageHeader title="Site Analytics" description="Traffic, engagement, and acquisition insights." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Weekly Visitors" value="36.8k" icon={Users} accent="primary" trend={12} />
        <StatCard label="Page Views" value="142k" icon={Eye} accent="info" trend={9} />
        <StatCard label="Avg. Session" value="4m 32s" icon={Activity} accent="success" trend={4} />
        <StatCard label="Click-through Rate" value="6.4%" icon={MousePointerClick} accent="warning" trend={-1} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Traffic & sign-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={TRAFFIC}>
                <defs>
                  <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="day" className="text-xs" tickLine={false} axisLine={false} />
                <YAxis className="text-xs" tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#visGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={DEVICES} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                  {DEVICES.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
