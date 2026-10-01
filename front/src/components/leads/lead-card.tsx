import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Mail, Phone } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import type { Lead, Tracking } from '@/services/types'
import { initials } from '@/util/lead-pipeline'
import { LeadMoveSelect } from './lead-move-select'

interface LeadCardProps {
  lead: Lead
  /** Stages the lead can move to (the current one is excluded). */
  targets: Tracking[]
  moving?: boolean
  dragging?: boolean
  dragProps?: HTMLAttributes<HTMLElement>
  onMove: (lead: Lead, trackingId: string) => void
}

export function LeadCard({ lead, targets, moving, dragging, dragProps, onMove }: LeadCardProps) {
  const created = formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: es })
  return (
    <article
      {...dragProps}
      title="Arrastra para mover"
      aria-roledescription="tarjeta arrastrable"
      className={`flex cursor-grab flex-col gap-3 rounded-xl border border-orange-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing ${dragging ? 'rotate-2 opacity-50' : moving ? 'opacity-60' : ''}`}
    >
      <header className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white"
        >
          {initials(lead)}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-orange-950">{lead.full_name}</h3>
          <p className="text-xs text-muted-foreground">Registrado {created}</p>
        </div>
      </header>
      {lead.interestProgram && (
        <span className="w-fit max-w-full truncate rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
          {lead.interestProgram.name}
        </span>
      )}
      <ul className="flex flex-col gap-1 text-xs text-slate-600">
        <li className="flex items-center gap-2 truncate"><Mail className="h-3.5 w-3.5 shrink-0 text-orange-500" />{lead.email}</li>
        <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0 text-orange-500" />{lead.mobile_phone}</li>
      </ul>
      <LeadMoveSelect
        leadName={lead.full_name}
        stages={targets}
        disabled={moving}
        onMove={(trackingId) => onMove(lead, trackingId)}
      />
    </article>
  )
}
