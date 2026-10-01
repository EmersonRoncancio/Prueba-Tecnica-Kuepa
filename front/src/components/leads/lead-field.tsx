import { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { leadMessage } from '@/util/lead-messages'

export const leadInputClass =
  'h-10 rounded-xl border-orange-200 bg-orange-50/60 focus-visible:ring-orange-400 aria-[invalid=true]:border-red-400 aria-[invalid=true]:bg-red-50/60'

interface LeadFieldProps {
  id: string
  label: string
  required?: boolean
  /** Backend-style error key, translated with `leadMessage`. */
  error?: string
  hint?: string
  children: (aria: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode
}

export function LeadField({ id, label, required, error, hint, children }: LeadFieldProps) {
  const messageId = `${id}-message`
  const described = error || hint
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-orange-900">
        {label}
        {required && <span aria-hidden="true" className="ml-0.5 text-orange-600">*</span>}
      </Label>
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': described ? messageId : undefined,
      })}
      {described && (
        <p id={messageId} className={`text-xs ${error ? 'text-red-600' : 'text-muted-foreground'}`}>
          {error ? leadMessage(error) : hint}
        </p>
      )}
    </div>
  )
}
