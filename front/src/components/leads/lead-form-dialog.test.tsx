import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LeadFormDialog } from './lead-form-dialog'
import { programService } from '@/services/programService'

vi.mock('@/services/programService', () => ({ programService: { list: vi.fn() } }))
// The form itself is covered in lead-form.test.tsx; Radix Select inside a Dialog is
// unreliable under jsdom, so the dialog is tested against a stub.
vi.mock('./lead-form', () => ({
  LeadForm: ({ onCreated }: { onCreated: (lead: unknown) => void }) => (
    <button onClick={() => onCreated({ _id: 'l1' })}>stub-submit</button>
  ),
}))

const list = vi.mocked(programService.list)

describe('LeadFormDialog', () => {
  beforeEach(() => list.mockReset())

  it('does not fetch programs while closed', () => {
    render(<LeadFormDialog open={false} onOpenChange={vi.fn()} onCreated={vi.fn()} />)
    expect(list).not.toHaveBeenCalled()
  })

  it('loads programs when opened and renders the form', async () => {
    list.mockResolvedValue({ code: 200, status: 'success', list: [{ _id: 'p1', name: 'Inglés' }] })
    render(<LeadFormDialog open onOpenChange={vi.fn()} onCreated={vi.fn()} />)

    expect(screen.getByRole('dialog', { name: /nuevo prospecto/i })).toBeInTheDocument()
    await waitFor(() => expect(list).toHaveBeenCalledTimes(1))
    expect(await screen.findByRole('button', { name: 'stub-submit' })).toBeEnabled()
  })

  it('shows an error when programs cannot be loaded', async () => {
    list.mockResolvedValue(undefined)
    render(<LeadFormDialog open onOpenChange={vi.fn()} onCreated={vi.fn()} />)
    expect(await screen.findByText(/no pudimos cargar los programas/i)).toBeInTheDocument()
  })

  it('closes and notifies the parent after a lead is created', async () => {
    const user = userEvent.setup()
    list.mockResolvedValue({ code: 200, status: 'success', list: [] })
    const onOpenChange = vi.fn()
    const onCreated = vi.fn()
    render(<LeadFormDialog open onOpenChange={onOpenChange} onCreated={onCreated} />)

    await user.click(await screen.findByRole('button', { name: 'stub-submit' }))

    expect(onCreated).toHaveBeenCalledWith({ _id: 'l1' })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
