import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import Tickets from '../../../src/app/tickets/page'
import * as ticketsLib from '@/lib/tickets'

jest.mock('@/lib/tickets')

async function resolvedComponent (Component, props) {
  const ComponentResolved = await Component(props)
  return () => ComponentResolved
}

describe('Tickets', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render AlertBox when getTickets is not successful', async () => {
    ticketsLib.getTickets = jest.fn().mockResolvedValueOnce({ success: false, message: 'Error message' })

    const TicketsResolved = await resolvedComponent(Tickets)
    render(<TicketsResolved />)

    const alertBox = await screen.findByRole('alert')
    expect(alertBox).toBeInTheDocument()
    expect(alertBox).toHaveTextContent('Error message')
  })

  it('should render TicketTable when getTickets is successful', async () => {
    const dummyData = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      severity: Math.floor(Math.random() * 5) + 1,
      title: `Ticket ${index + 1}`,
      requester: `User ${index + 1}`,
      assignee: `User ${index + 1}`,
      created_at: new Date().toISOString(),
      resolved: Math.random() > 0.5
    }))
    ticketsLib.getTickets = jest.fn().mockResolvedValueOnce({ success: true, tickets: dummyData })

    const TicketsResolved = await resolvedComponent(Tickets)
    render(<TicketsResolved />)

    const ticketTable = await screen.findByRole('table')
    expect(ticketTable).toBeInTheDocument()
    dummyData.forEach((ticket, index) => {
      expect(screen.getByText(ticket.title)).toBeInTheDocument()
    })
  })
})
