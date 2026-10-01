import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Tracking } from '@/services/types'

interface LeadMoveSelectProps {
  leadName: string
  stages: Tracking[]
  disabled?: boolean
  onMove: (trackingId: string) => void
}

/** Always shows the placeholder: the lead's current stage is the column it sits in. */
export function LeadMoveSelect({ leadName, stages, disabled, onMove }: LeadMoveSelectProps) {
  return (
    <Select value="" onValueChange={onMove} disabled={disabled}>
      <SelectTrigger
        aria-label={`Mover a ${leadName}`}
        className="h-8 rounded-full border-orange-200 bg-orange-50 px-3 text-xs font-medium text-orange-800 focus:ring-orange-400"
      >
        <SelectValue placeholder="Mover a…" />
      </SelectTrigger>
      <SelectContent>
        {stages.map((stage) => (
          <SelectItem key={stage._id} value={stage._id}>{stage.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
