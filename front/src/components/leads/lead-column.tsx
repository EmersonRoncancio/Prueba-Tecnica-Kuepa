import type { useLeadDrag } from '@/hooks/use-lead-drag'
import type { Lead, Tracking } from '@/services/types'
import { stageAccents } from '@/util/lead-pipeline'
import { LeadCard } from './lead-card'

interface LeadColumnProps {
  stage: Tracking
  index: number
  leads: Lead[]
  stages: Tracking[]
  movingId: string | null
  onMove: (lead: Lead, trackingId: string) => void
  drag: ReturnType<typeof useLeadDrag>
}

export function LeadColumn({ stage, index, leads, stages, movingId, onMove, drag }: LeadColumnProps) {
  const accent = stageAccents[index % stageAccents.length]
  const over = drag.overStageId === stage._id
  const targets = stages.filter((s) => s._id !== stage._id)
  return (
    <section
      aria-label={`Etapa ${stage.name}`}
      {...drag.columnProps(stage._id)}
      className={`flex w-72 shrink-0 snap-start flex-col rounded-xl border border-t-4 transition-colors ${accent.border} ${over ? 'border-orange-400 bg-orange-100' : 'border-orange-100 bg-orange-50/60'}`}
    >
      <header className="flex items-center justify-between px-3 py-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-orange-950">
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${accent.dot}`} />
          {stage.name}
        </h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-orange-700 shadow-sm">
          {leads.length}
        </span>
      </header>
      <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-3 pb-3">
        {leads.length === 0 && (
          <p className="rounded-xl border border-dashed border-orange-200 px-3 py-6 text-center text-xs text-muted-foreground">
            Sin prospectos en esta etapa
          </p>
        )}
        {leads.map((lead) => (
          <LeadCard key={lead._id} lead={lead} targets={targets} moving={movingId === lead._id} dragging={drag.draggingId === lead._id} dragProps={drag.cardProps(lead)} onMove={onMove} />
        ))}
      </div>
    </section>
  )
}
