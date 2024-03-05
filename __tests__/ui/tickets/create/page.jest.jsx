import '@testing-library/jest-dom'

import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import CreateTicketForm from '../../../../src/app/tickets/create/page'
import { useRouter } from 'next/navigation'

import { createTicket } from '@/lib/tickets'
import { getSessionUser } from '@/lib/user'

global.ResizeObserver = class {
  observe () {}
  unobserve () {}
  disconnect () {}
}

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/lib/tickets', () => ({
  createTicket: jest.fn()
}))

jest.mock('@/lib/user', () => ({
  getSessionUser: jest.fn()
}))

describe('CreateTicketForm', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: jest.fn()
    }))

    getSessionUser.mockResolvedValue({ success: true, isAdmin: false })
  })

  it('renders correctly', async () => {
    render(<CreateTicketForm />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument()
    })
  })

  it('has title, severity, and message fields', async () => {
    render(<CreateTicketForm />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument()
    })

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Message')).toBeInTheDocument()
    // Assuming the severity field is a range input
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('submits the form', async () => {
    createTicket.mockResolvedValue({ success: true, ticket: '123' })
    render(<CreateTicketForm />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Test title' } })
    fireEvent.change(screen.getByPlaceholderText('Message'), { target: { value: 'Test message' } })
    fireEvent.submit(screen.getByText('Create'))

    await waitFor(() => {
      expect(createTicket).toHaveBeenCalledWith({
        title: 'Test title',
        message: 'Test message',
        severity: 5 // assuming this is the default value
      })
    })
  })
})
