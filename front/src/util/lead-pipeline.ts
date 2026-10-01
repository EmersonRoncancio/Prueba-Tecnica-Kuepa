import type { Lead, Tracking } from '@/services/types'

export interface StageColumn {
  stage: Tracking
  leads: Lead[]
}

export interface LeadStats {
  total: number
  fresh: number
  enrolled: number
  /** Percentage of leads in the "Matriculado" stage, rounded. */
  conversion: number
}

/** Full class names so Tailwind can see them. Assigned to stages by position. */
export const stageAccents = [
  { border: 'border-t-sky-400', dot: 'bg-sky-400' },
  { border: 'border-t-indigo-400', dot: 'bg-indigo-400' },
  { border: 'border-t-amber-400', dot: 'bg-amber-400' },
  { border: 'border-t-orange-500', dot: 'bg-orange-500' },
  { border: 'border-t-emerald-500', dot: 'bg-emerald-500' },
  { border: 'border-t-slate-400', dot: 'bg-slate-400' },
]

const plain = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** The current stage is the last tracking; the rest is history. */
export function stageIdOf(lead: Lead, stages: Tracking[]): string {
  const last = lead.trackings?.[lead.trackings.length - 1]?.tracking
  const id = typeof last === 'string' ? last : last?._id
  return id && stages.some((s) => s._id === id) ? id : stages[0]?._id
}

export function groupLeadsByStage(leads: Lead[], stages: Tracking[]): StageColumn[] {
  const columns = stages.map((stage) => ({ stage, leads: [] as Lead[] }))
  for (const lead of leads) {
    columns.find((c) => c.stage._id === stageIdOf(lead, stages))?.leads.push(lead)
  }
  return columns
}

export function filterLeads(leads: Lead[], query: string): Lead[] {
  const needle = plain(query.trim())
  if (!needle) return leads
  return leads.filter((lead) =>
    plain(`${lead.full_name} ${lead.email} ${lead.interestProgram?.name ?? ''}`).includes(needle)
  )
}

export const initials = (lead: Lead): string =>
  `${lead.first_name?.[0] ?? ''}${lead.last_name?.[0] ?? ''}`.toUpperCase()

export function leadStats(columns: StageColumn[]): LeadStats {
  const total = columns.reduce((sum, c) => sum + c.leads.length, 0)
  const enrolled = columns.find((c) => plain(c.stage.name) === 'matriculado')?.leads.length ?? 0
  return {
    total,
    fresh: columns[0]?.leads.length ?? 0,
    enrolled,
    conversion: total ? Math.round((enrolled / total) * 100) : 0,
  }
}
