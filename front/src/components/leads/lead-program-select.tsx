import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Program } from '@/services/types'
import { leadInputClass } from './lead-field'

interface LeadProgramSelectProps {
  id: string
  programs: Program[]
  value: string
  onChange: (value: string) => void
  invalid?: boolean
  describedBy?: string
}

export function LeadProgramSelect({ id, programs, value, onChange, invalid, describedBy }: LeadProgramSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={`${leadInputClass} border-solid`}
      >
        <SelectValue placeholder="Selecciona un programa" />
      </SelectTrigger>
      <SelectContent>
        {programs.map((program) => (
          <SelectItem key={program._id} value={program._id}>{program.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
