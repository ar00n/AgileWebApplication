import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import TicketView from '../../../../src/app/tickets/[id]/page'
import { act } from 'react-dom/test-utils'

import * as ticketsLib from '@/lib/tickets'
import * as userLib from '@/lib/user'

jest.mock('@/lib/tickets')
jest.mock('@/lib/user')

userLib.getSessionUser = jest.fn().mockResolvedValue({ success: true, isAdmin: false })

async function resolvedComponent (Component, props) {
  const ComponentResolved = await Component(props)
  return () => ComponentResolved
}

describe('TicketView', () => {
  it('renders invalid ticket ID message when ID is not a number', async () => {
    await act(async () => {
      const TicketViewResolved = await resolvedComponent(TicketView, { params: { id: 'not a number' } })
      render(<TicketViewResolved />)
    })

    expect(screen.getByText('Invalid ticket ID.')).toBeInTheDocument()
  })

  it('renders error message when getTicket is unsuccessful', async () => {
    ticketsLib.getTicket.mockResolvedValueOnce({ success: false })

    await act(async () => {
      const TicketViewResolved = await resolvedComponent(TicketView, { params: { id: '1' } })
      render(<TicketViewResolved />)
    })

    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('renders ticket details when getTicket is successful', async () => {
    ticketsLib.getTicket.mockResolvedValueOnce({
      success: true,
      ticket: {
        resolved: true,
        title: 'Test Ticket',
        created_at: '2022-01-01',
        message: 'Test Message',
        severity: 'High',
        requester: 'Test Requester',
        assignee: 'Test Assignee',
        id: '1'
      }
    })

    await act(async () => {
      const TicketViewResolved = await resolvedComponent(TicketView, { params: { id: '1' } })
      render(<TicketViewResolved />)
    })

    expect(screen.getByText('Resolved')).toBeInTheDocument()
    expect(screen.getByText('Test Ticket')).toBeInTheDocument()
    expect(screen.getByText('Test Message')).toBeInTheDocument()
    expect(screen.getByText('Severity: High')).toBeInTheDocument()
    expect(screen.getByText('Requester: Test Requester')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Un-resolve/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument()
  })
})
