import { filterLeads, groupLeadsByStage, initials, leadStats, stageIdOf } from './lead-pipeline'
import type { Lead, Tracking } from '@/services/types'

const stages: Tracking[] = [
  { _id: 't1', name: 'Nuevo', order: 1 },
  { _id: 't2', name: 'Contactado', order: 2 },
  { _id: 't3', name: 'Matriculado', order: 3 },
]

const lead = (over: Partial<Lead> & { _id: string }): Lead => ({
  full_name: 'Ana Pérez',
  first_name: 'Ana',
  last_name: 'Pérez',
  email: 'ana@example.com',
  mobile_phone: '3001234567',
  interestProgram: { _id: 'p1', name: 'Inglés' },
  trackings: [{ tracking: stages[0] }],
  created_at: '2026-09-01T00:00:00.000Z',
  ...over,
})

describe('stageIdOf', () => {
  it('uses the last tracking, populated or not', () => {
    expect(stageIdOf(lead({ _id: 'a', trackings: [{ tracking: stages[0] }, { tracking: stages[1] }] }), stages)).toBe('t2')
    expect(stageIdOf(lead({ _id: 'a', trackings: [{ tracking: 't3' }] }), stages)).toBe('t3')
  })

  it('falls back to the first stage when there is no tracking', () => {
    expect(stageIdOf(lead({ _id: 'a', trackings: [] }), stages)).toBe('t1')
  })
})

describe('groupLeadsByStage', () => {
  it('keeps stage order and places leads by their last tracking', () => {
    const leads = [
      lead({ _id: 'a' }),
      lead({ _id: 'b', trackings: [{ tracking: stages[0] }, { tracking: stages[2] }] }),
    ]
    const columns = groupLeadsByStage(leads, stages)
    expect(columns.map((c) => c.stage.name)).toEqual(['Nuevo', 'Contactado', 'Matriculado'])
    expect(columns.map((c) => c.leads.map((l) => l._id))).toEqual([['a'], [], ['b']])
  })
})

describe('filterLeads', () => {
  const leads = [
    lead({ _id: 'a' }),
    lead({ _id: 'b', full_name: 'Luis Gómez', email: 'luis@mail.co', interestProgram: { _id: 'p2', name: 'Contabilidad' } }),
  ]

  it('returns everything for a blank query', () => {
    expect(filterLeads(leads, '  ')).toHaveLength(2)
  })

  it('matches name, email and program ignoring case and accents', () => {
    expect(filterLeads(leads, 'perez').map((l) => l._id)).toEqual(['a'])
    expect(filterLeads(leads, 'LUIS@MAIL').map((l) => l._id)).toEqual(['b'])
    expect(filterLeads(leads, 'contab').map((l) => l._id)).toEqual(['b'])
    expect(filterLeads(leads, 'zzz')).toEqual([])
  })
})

describe('initials', () => {
  it('takes the first letter of first and last name', () => {
    expect(initials(lead({ _id: 'a' }))).toBe('AP')
  })
})

describe('leadStats', () => {
  it('computes total, new, enrolled and conversion', () => {
    const columns = groupLeadsByStage(
      [
        lead({ _id: 'a' }),
        lead({ _id: 'b' }),
        lead({ _id: 'c', trackings: [{ tracking: stages[2] }] }),
        lead({ _id: 'd', trackings: [{ tracking: stages[2] }] }),
      ],
      stages
    )
    expect(leadStats(columns)).toEqual({ total: 4, fresh: 2, enrolled: 2, conversion: 50 })
  })

  it('has zero conversion without leads', () => {
    expect(leadStats(groupLeadsByStage([], stages)).conversion).toBe(0)
  })
})
