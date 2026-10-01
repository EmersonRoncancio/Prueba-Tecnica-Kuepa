import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { token, user, access } from '@/atoms/kuepa'

vi.mock('@/services/authService', () => ({
  AuthService: class {
    login = vi.fn().mockResolvedValue({
      token: 'test-token',
      user: { _id: 'u1', homes: [{ app: 'kuepa' }] },
    })
    token = vi.fn()
  },
}))

import Login from './login'

describe('Login', () => {
  beforeEach(() => {
    token.set(null)
    user.set(null)
    access.set(null)
  })

  it('redirects to the leads pipeline after a successful login', async () => {
    render(
      <MemoryRouter initialEntries={['/auth']}>
        <Routes>
          <Route path="/auth" element={<Login />} />
          <Route path="/leads" element={<p>pipeline page</p>} />
          <Route path="/home" element={<p>home page</p>} />
        </Routes>
      </MemoryRouter>
    )

    const [usernameInput, passwordInput] = Array.from(document.querySelectorAll('input'))
    await userEvent.type(usernameInput, 'useradminket')
    await userEvent.type(passwordInput, 'secret123')
    await userEvent.click(screen.getByRole('button', { name: /conectarme/i }))

    expect(await screen.findByText('pipeline page')).toBeInTheDocument()
  })
})
