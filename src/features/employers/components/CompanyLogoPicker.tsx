import { useRef, useState } from 'react'
import { Loader2, Pencil } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/shared/components/ui/toast'
import { cn } from '@/shared/lib/utils'
import { uploadCompanyLogo } from '@/shared/services/uploads.api'
import { FILE_UPLOAD_KINDS } from '@/shared/components/common/FileUpload'
import { employerCompanyKeys } from '../hooks/useEmployerCompany'

const ACCEPT = FILE_UPLOAD_KINDS.companyLogo.accept
const MAX_BYTES = FILE_UPLOAD_KINDS.companyLogo.maxSizeMB * 1024 * 1024

interface CompanyLogoPickerProps {
  logoUrl: string
  className?: string
}

/** Compact logo with pencil overlay — upload only (shown on company profile card). */
export function CompanyLogoPicker({ logoUrl, className }: CompanyLogoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)

  async function handleFile(file: File) {
    if (file.size > MAX_BYTES) {
      toast({
        title: 'File too large',
        description: FILE_UPLOAD_KINDS.companyLogo.hint,
        variant: 'error',
      })
      return
    }

    setUploading(true)
    try {
      await uploadCompanyLogo(file)
      await queryClient.invalidateQueries({ queryKey: employerCompanyKeys.company })
      toast({ title: 'Logo updated', variant: 'success' })
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('relative h-24 w-24 shrink-0', className)}>
      <img
        src={logoUrl}
        alt=""
        className="h-full w-full rounded-xl border border-border object-cover shadow-sm"
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-60"
        aria-label="Change company logo"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
        }}
      />
    </div>
  )
}
