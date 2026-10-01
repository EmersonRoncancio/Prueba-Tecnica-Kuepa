import type { LeadStats } from '@/util/lead-pipeline'

const tiles = (s: LeadStats) => [
  { label: 'Total de prospectos', value: s.total, tone: 'text-orange-900' },
  { label: 'Nuevos', value: s.fresh, tone: 'text-sky-700' },
  { label: 'Matriculados', value: s.enrolled, tone: 'text-emerald-700' },
  { label: 'Conversión', value: `${s.conversion}%`, tone: 'text-orange-600' },
]

export function LeadsStats({ stats }: { stats: LeadStats }) {
  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles(stats).map((tile) => (
        <div
          key={tile.label}
          aria-label={tile.label}
          className="rounded-xl border border-orange-100 bg-white px-4 py-3 shadow-sm"
        >
          <dt className="text-xs font-medium text-muted-foreground">{tile.label}</dt>
          <dd className={`text-2xl font-extrabold ${tile.tone}`}>{tile.value}</dd>
        </div>
      ))}
    </dl>
  )
}
