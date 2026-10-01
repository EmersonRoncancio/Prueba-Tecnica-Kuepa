import { useLeadDrag } from '@/hooks/use-lead-drag'
import type { Lead } from '@/services/types'
import type { StageColumn } from '@/util/lead-pipeline'
import { LeadColumn } from './lead-column'

interface LeadsBoardProps {
  columns: StageColumn[]
  movingId: string | null
  onMove: (lead: Lead, trackingId: string) => void
}

export function LeadsBoard({ columns, movingId, onMove }: LeadsBoardProps) {
  const stages = columns.map((c) => c.stage)
  const drag = useLeadDrag(columns, onMove)
  return (
    <div className="flex snap-x items-start gap-4 overflow-x-auto pb-4">
      {columns.map((column, index) => (
        <LeadColumn
          key={column.stage._id}
          stage={column.stage}
          index={index}
          leads={column.leads}
          stages={stages}
          movingId={movingId}
          onMove={onMove}
          drag={drag}
        />
      ))}
    </div>
  )
}
