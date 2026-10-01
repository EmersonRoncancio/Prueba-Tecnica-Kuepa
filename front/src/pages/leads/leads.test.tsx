import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Leads from './leads'
import { leadService } from '@/services/leadService'
import { trackingService } from '@/services/trackingService'
import { programService } from '@/services/programService'
import type { Lead, Tracking } from '@/services/types'

vi.mock('@/services/leadService', () => ({ leadService: { list: vi.fn(), move: vi.fn(), create: vi.fn() } }))
vi.mock('@/services/trackingService', () => ({ trackingService: { list: vi.fn() } }))
vi.mock('@/services/programService', () => ({ programService: { list: vi.fn() } }))

const stages: Tracking[] = [
  { _id: 't1', name: 'Nuevo', order: 1 },
  { _id: 't2', name: 'Contactado', order: 2 },
  { _id: 't3', name: 'Matriculado', order: 3 },
]
const base = {
  mobile_phone: '3001234567',
  interestProgram: { _id: 'p1', name: 'Inglés' },
  created_at: '2026-09-01T00:00:00.000Z',
}
const ana: Lead = {
  ...base, _id: 'a', full_name: 'Ana Pérez', first_name: 'Ana', last_name: 'Pérez',
  email: 'ana@example.com', trackings: [{ tracking: stages[0] }, { tracking: stages[1] }],
}
const luis: Lead = {
  ...base, _id: 'b', full_name: 'Luis Gómez', first_name: 'Luis', last_name: 'Gómez',
  email: 'luis@mail.co', interestProgram: { _id: 'p2', name: 'Contabilidad' },
  trackings: [{ tracking: stages[0] }],
}

const list = vi.mocked(leadService.list)
const move = vi.mocked(leadService.move)
const stageList = vi.mocked(trackingService.list)
const column = (name: string) => screen.getByRole('region', { name: `Etapa ${name}` })

beforeEach(() => {
  vi.resetAllMocks()
  stageList.mockResolvedValue({ code: 200, status: 'success', list: stages })
  list.mockResolvedValue({ code: 200, status: 'success', list: [ana, luis] })
  vi.mocked(programService.list).mockResolvedValue({ code: 200, status: 'success', list: [] })
})

describe('Leads page', () => {
  it('renders the stages in order and each lead under its last tracking', async () => {
    render(<Leads />)
    await screen.findByText('Ana Pérez')

    const names = screen.getAllByRole('region').map((r) => r.getAttribute('aria-label'))
    expect(names).toEqual(['Etapa Nuevo', 'Etapa Contactado', 'Etapa Matriculado'])
    expect(within(column('Contactado')).getByText('Ana Pérez')).toBeInTheDocument()
    expect(within(column('Nuevo')).getByText('Luis Gómez')).toBeInTheDocument()
    expect(within(column('Nuevo')).queryByText('Ana Pérez')).not.toBeInTheDocument()
    expect(within(column('Matriculado')).getByText(/sin prospectos/i)).toBeInTheDocument()
  })

  it('moves a lead to another stage through the move control', async () => {
    const user = userEvent.setup()
    move.mockResolvedValue({
      code: 200, status: 'success',
      object: { ...luis, trackings: [...luis.trackings, { tracking: stages[2] }] },
    } as never)
    render(<Leads />)
    await screen.findByText('Luis Gómez')

    await user.click(within(column('Nuevo')).getByRole('combobox', { name: /mover a luis gómez/i }))
    await user.click(await screen.findByRole('option', { name: 'Matriculado' }))

    expect(move).toHaveBeenCalledWith({ _id: 'b', tracking: 't3' })
    await waitFor(() => expect(within(column('Matriculado')).getByText('Luis Gómez')).toBeInTheDocument())
    expect(within(column('Nuevo')).queryByText('Luis Gómez')).not.toBeInTheDocument()
  })

  it('keeps the lead in place when the move fails', async () => {
    const user = userEvent.setup()
    move.mockResolvedValue({ code: 404, status: 'error', message: 'tracking.not_found' } as never)
    render(<Leads />)
    await screen.findByText('Luis Gómez')

    await user.click(within(column('Nuevo')).getByRole('combobox', { name: /mover a luis gómez/i }))
    await user.click(await screen.findByRole('option', { name: 'Matriculado' }))

    await waitFor(() => expect(move).toHaveBeenCalled())
    expect(within(column('Nuevo')).getByText('Luis Gómez')).toBeInTheDocument()
  })

  it('filters cards by name, email or program', async () => {
    const user = userEvent.setup()
    render(<Leads />)
    await screen.findByText('Ana Pérez')

    await user.type(screen.getByRole('searchbox', { name: /buscar/i }), 'contab')

    expect(screen.queryByText('Ana Pérez')).not.toBeInTheDocument()
    expect(screen.getByText('Luis Gómez')).toBeInTheDocument()
  })

  it('shows summary stats', async () => {
    render(<Leads />)
    await screen.findByText('Ana Pérez')
    expect(screen.getByLabelText('Total de prospectos')).toHaveTextContent('2')
  })

  it('shows an error state and retries', async () => {
    const user = userEvent.setup()
    list.mockResolvedValueOnce(undefined)
    render(<Leads />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/no pudimos cargar/i)
    await user.click(screen.getByRole('button', { name: /reintentar/i }))

    expect(await screen.findByText('Ana Pérez')).toBeInTheDocument()
  })

  it('opens the registration dialog from the header button', async () => {
    const user = userEvent.setup()
    render(<Leads />)
    await screen.findByText('Ana Pérez')

    await user.click(screen.getByRole('button', { name: /nuevo prospecto/i }))

    expect(await screen.findByRole('dialog', { name: /nuevo prospecto/i })).toBeInTheDocument()
  })

  describe('drag and drop', () => {
    const dataTransfer = () => {
      const store: Record<string, string> = {}
      return {
        setData: (k: string, v: string) => { store[k] = v },
        getData: (k: string) => store[k] ?? '',
        effectAllowed: '', dropEffect: '',
      }
    }
    const card = (name: string) => screen.getByText(name).closest('article') as HTMLElement

    it('marks cards as draggable with a hint', async () => {
      render(<Leads />)
      await screen.findByText('Luis Gómez')
      expect(card('Luis Gómez')).toHaveAttribute('draggable', 'true')
      expect(card('Luis Gómez')).toHaveAttribute('aria-roledescription', 'tarjeta arrastrable')
      expect(card('Luis Gómez')).toHaveAttribute('title', 'Arrastra para mover')
    })

    it('moves a lead to the column where it is dropped', async () => {
      move.mockResolvedValue({
        code: 200, status: 'success',
        object: { ...luis, trackings: [...luis.trackings, { tracking: stages[2] }] },
      } as never)
      render(<Leads />)
      await screen.findByText('Luis Gómez')
      const dt = dataTransfer()

      fireEvent.dragStart(card('Luis Gómez'), { dataTransfer: dt })
      expect(card('Luis Gómez')).toHaveClass('opacity-50')
      fireEvent.dragOver(column('Matriculado'), { dataTransfer: dt })
      expect(column('Matriculado')).toHaveClass('bg-orange-100')
      fireEvent.drop(column('Matriculado'), { dataTransfer: dt })

      expect(move).toHaveBeenCalledWith({ _id: 'b', tracking: 't3' })
      await waitFor(() => expect(within(column('Matriculado')).getByText('Luis Gómez')).toBeInTheDocument())
      expect(column('Matriculado')).not.toHaveClass('bg-orange-100')
    })

    it('ignores a drop on the lead\'s own column', async () => {
      render(<Leads />)
      await screen.findByText('Luis Gómez')
      const dt = dataTransfer()

      fireEvent.dragStart(card('Luis Gómez'), { dataTransfer: dt })
      fireEvent.dragOver(column('Nuevo'), { dataTransfer: dt })
      fireEvent.drop(column('Nuevo'), { dataTransfer: dt })

      expect(move).not.toHaveBeenCalled()
    })

    it('toasts and keeps the lead when a dropped move fails', async () => {
      move.mockResolvedValue({ code: 404, status: 'error', message: 'tracking.not_found' } as never)
      render(<Leads />)
      await screen.findByText('Luis Gómez')
      const dt = dataTransfer()

      fireEvent.dragStart(card('Luis Gómez'), { dataTransfer: dt })
      fireEvent.drop(column('Matriculado'), { dataTransfer: dt })

      await waitFor(() => expect(move).toHaveBeenCalled())
      expect(within(column('Nuevo')).getByText('Luis Gómez')).toBeInTheDocument()
    })
  })
})
