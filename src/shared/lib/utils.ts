import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPKR(amount: number, opts?: { compact?: boolean }) {
  if (opts?.compact) {
    if (amount >= 10_000_000) return `Rs ${(amount / 10_000_000).toFixed(1)} Cr`
    if (amount >= 100_000) return `Rs ${(amount / 100_000).toFixed(1)} Lac`
    if (amount >= 1_000) return `Rs ${(amount / 1_000).toFixed(0)}k`
    return `Rs ${amount}`
  }
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatSalaryRange(min?: number, max?: number) {
  if (!min && !max) return 'Salary not disclosed'
  if (min && max) return `${formatPKR(min, { compact: true })} - ${formatPKR(max, { compact: true })}`
  if (min) return `From ${formatPKR(min, { compact: true })}`
  if (max) return `Up to ${formatPKR(max, { compact: true })}`
  return 'Salary not disclosed'
}

export function timeAgo(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diff = now.getTime() - past.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 4) return `${weeks}w ago`
  if (months < 12) return `${months}mo ago`
  return `${years}y ago`
}

export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
  const d = new Date(date)
  if (format === 'long') {
    return d.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  return d.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '…'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

export function debounce<T extends (...args: any[]) => void>(fn: T, ms = 300): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i)
}
