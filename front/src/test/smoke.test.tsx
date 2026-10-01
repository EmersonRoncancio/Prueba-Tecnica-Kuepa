import { render, screen } from '@testing-library/react'
import { cn } from '@/lib/utils'

describe('test setup', () => {
  it('renders React with jsdom, jest-dom matchers and the @ alias', () => {
    render(<p className={cn('text-sm', 'font-bold')}>Kuepa</p>)
    expect(screen.getByText('Kuepa')).toBeInTheDocument()
    expect(screen.getByText('Kuepa')).toHaveClass('font-bold')
  })
})
