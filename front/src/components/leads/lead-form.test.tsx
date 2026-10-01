import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LeadForm } from './lead-form'
import { leadService } from '@/services/leadService'
import type { Program } from '@/services/types'

vi.mock('@/services/leadService', () => ({
  leadService: { create: vi.fn() },
}))

const programs: Program[] = [
  { _id: '66f0c0ffee00000000000001', name: 'Inglés' },
  { _id: '66f0c0ffee00000000000002', name: 'Bachillerato Virtual' },
]
const create = vi.mocked(leadService.create)

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^nombres/i), 'Ana')
  await user.type(screen.getByLabelText(/^apellidos/i), 'Pérez')
  await user.type(screen.getByLabelText(/correo/i), 'ana@example.com')
  await user.type(screen.getByLabelText(/celular/i), '300 123 4567')
  await user.click(screen.getByRole('combobox', { name: /programa/i }))
  await user.click(await screen.findByRole('option', { name: 'Inglés' }))
}

describe('LeadForm', () => {
  beforeEach(() => create.mockReset())

  it('shows inline errors and does not submit an empty form', async () => {
    const user = userEvent.setup()
    render(<LeadForm programs={programs} onCreated={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /registrar prospecto/i }))

    const first = screen.getByLabelText(/^nombres/i)
    expect(first).toHaveAttribute('aria-invalid', 'true')
    expect(first).toHaveAccessibleDescription(/nombre es obligatorio/i)
    expect(screen.getByLabelText(/correo/i)).toHaveAttribute('aria-invalid', 'true')
    expect(create).not.toHaveBeenCalled()
  })

  it('flags an invalid email format', async () => {
    const user = userEvent.setup()
    render(<LeadForm programs={programs} onCreated={vi.fn()} />)

    await user.type(screen.getByLabelText(/correo/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /registrar prospecto/i }))

    expect(screen.getByLabelText(/correo/i)).toHaveAccessibleDescription(/correo.*válido/i)
  })

  it('submits normalized data, resets the form and notifies the parent', async () => {
    const user = userEvent.setup()
    const lead = { _id: 'l1' }
    create.mockResolvedValue({ code: 200, status: 'success', object: lead } as never)
    const onCreated = vi.fn()
    render(<LeadForm programs={programs} onCreated={onCreated} />)

    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /registrar prospecto/i }))

    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(lead))
    expect(create).toHaveBeenCalledWith({
      first_name: 'Ana',
      last_name: 'Pérez',
      email: 'ana@example.com',
      mobile_phone: '3001234567',
      interestProgram: '66f0c0ffee00000000000001',
      description: '',
    })
    expect(screen.getByLabelText(/^nombres/i)).toHaveValue('')
  })

  it('maps server validation errors onto their fields', async () => {
    const user = userEvent.setup()
    create.mockResolvedValue({
      code: 400,
      status: 'error',
      message: 'lead.invalid',
      errors: { mobile_phone: 'lead.mobile_phone.invalid' },
    } as never)
    const onCreated = vi.fn()
    render(<LeadForm programs={programs} onCreated={onCreated} />)

    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /registrar prospecto/i }))

    expect(await screen.findByText(/teléfono.*7 y 15/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/celular/i)).toHaveAttribute('aria-invalid', 'true')
    expect(onCreated).not.toHaveBeenCalled()
  })

  it('shows a duplicated email (409) on the email field', async () => {
    const user = userEvent.setup()
    create.mockResolvedValue({ code: 409, status: 'error', message: 'lead.email.duplicated' } as never)
    render(<LeadForm programs={programs} onCreated={vi.fn()} />)

    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /registrar prospecto/i }))

    await waitFor(() =>
      expect(screen.getByLabelText(/correo/i)).toHaveAccessibleDescription(/ya está registrado/i)
    )
  })

  it('shows a generic error when the request fails without a response', async () => {
    const user = userEvent.setup()
    create.mockResolvedValue(undefined as never)
    render(<LeadForm programs={programs} onCreated={vi.fn()} />)

    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /registrar prospecto/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/inténtalo/i)
  })
})
