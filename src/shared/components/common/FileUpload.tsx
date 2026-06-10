import { useCallback, useRef, useState } from 'react'
import { FileText, Loader2, Trash2, Upload, X } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Progress } from '@/shared/components/ui/progress'
import { useToast } from '@/shared/components/ui/toast'
import { cn } from '@/shared/lib/utils'

export interface FileUploadProps {
  /** Native input `accept` value, e.g. `image/*` or `.pdf,.doc,.docx`. */
  accept: string
  /** Human-readable hint, e.g. "PNG, JPG, WEBP up to 5MB". */
  hint?: string
  /** Max size in MB enforced client-side before upload. */
  maxSizeMB?: number
  /** Visual style: an image thumbnail or a document chip. */
  variant?: 'image' | 'document'
  /** Existing uploaded file URL (preview / view / download). */
  currentUrl?: string | null
  /** Display name for the document variant. */
  fileName?: string
  /** Disable the whole control (e.g. company not created yet). */
  disabled?: boolean
  disabledHint?: string
  /** Performs the actual upload and returns the new file URL. */
  upload: (file: File, onProgress: (percent: number) => void) => Promise<string>
  onUploaded?: (url: string) => void
  onRemove?: () => Promise<void> | void
  className?: string
}

const ACCEPT_EXT_RE = /\.([a-z0-9]+)$/i

export function FileUpload({
  accept,
  hint,
  maxSizeMB = 10,
  variant = 'document',
  currentUrl,
  fileName,
  disabled = false,
  disabledHint,
  upload,
  onUploaded,
  onRemove,
  className,
}: FileUploadProps) {
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isRemoving, setIsRemoving] = useState(false)

  const validate = useCallback(
    (file: File): string | null => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File is too large. Maximum size is ${maxSizeMB}MB.`
      }
      // Validate against the accept list (extensions and/or mime patterns).
      const tokens = accept.split(',').map((t) => t.trim().toLowerCase())
      const ext = (file.name.match(ACCEPT_EXT_RE)?.[1] ?? '').toLowerCase()
      const mime = file.type.toLowerCase()
      const ok = tokens.some((token) => {
        if (token.startsWith('.')) return token === `.${ext}`
        if (token.endsWith('/*')) return mime.startsWith(token.slice(0, -1))
        return token === mime
      })
      if (!ok) return `Unsupported file type. Allowed: ${hint ?? accept}.`
      return null
    },
    [accept, hint, maxSizeMB],
  )

  const handleFile = useCallback(
    async (file: File) => {
      const error = validate(file)
      if (error) {
        toast({ title: 'Invalid file', description: error, variant: 'error' })
        return
      }
      setIsUploading(true)
      setProgress(0)
      try {
        const url = await upload(file, setProgress)
        onUploaded?.(url)
        toast({ title: 'Upload complete', variant: 'success' })
      } catch (err) {
        toast({
          title: 'Upload failed',
          description: (err as { message?: string })?.message ?? 'Please try again.',
          variant: 'error',
        })
      } finally {
        setIsUploading(false)
        setProgress(0)
        if (inputRef.current) inputRef.current.value = ''
      }
    },
    [validate, upload, onUploaded, toast],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled || isUploading) return
      const file = e.dataTransfer.files?.[0]
      if (file) void handleFile(file)
    },
    [disabled, isUploading, handleFile],
  )

  async function handleRemove() {
    if (!onRemove) return
    setIsRemoving(true)
    try {
      await onRemove()
      toast({ title: 'File removed', variant: 'success' })
    } catch (err) {
      toast({
        title: 'Could not remove file',
        description: (err as { message?: string })?.message ?? 'Please try again.',
        variant: 'error',
      })
    } finally {
      setIsRemoving(false)
    }
  }

  const open = () => {
    if (!disabled && !isUploading) inputRef.current?.click()
  }

  return (
    <div className={cn('space-y-3', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled || isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
        }}
      />

      {/* Existing file preview */}
      {currentUrl && !isUploading && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
          {variant === 'image' ? (
            <img
              src={currentUrl}
              alt="Uploaded preview"
              className="h-12 w-12 rounded-md border border-border object-cover"
            />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{fileName ?? 'Uploaded file'}</p>
            <div className="mt-1 flex flex-wrap gap-3 text-xs">
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View
              </a>
              <a href={currentUrl} download className="text-primary hover:underline">
                Download
              </a>
            </div>
          </div>
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRemove}
              loading={isRemoving}
              aria-label="Remove file"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled && !isUploading) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-border',
          disabled
            ? 'cursor-not-allowed opacity-60'
            : 'cursor-pointer hover:border-primary/60 hover:bg-muted/40',
        )}
      >
        {isUploading ? (
          <div className="w-full max-w-xs space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Uploading… {progress}%
            </div>
            <Progress value={progress} />
          </div>
        ) : (
          <>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Upload className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium">
              {currentUrl ? 'Replace file' : 'Drag & drop or click to upload'}
            </p>
            {disabled && disabledHint ? (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <X className="h-3 w-3" /> {disabledHint}
              </p>
            ) : (
              hint && <p className="text-xs text-muted-foreground">{hint}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
