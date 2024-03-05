import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../../src/app/page'

describe('Home component', () => {
  beforeEach(() => {
    render(<Home />)
  })

  test('renders TicketCut 2.0 heading', () => {
    const headingElement = screen.getByText(/TicketCut 2.0/i)
    expect(headingElement).toBeInTheDocument()
  })

  test('renders login link', () => {
    const loginLinkElement = screen.getByText(/login/i)
    expect(loginLinkElement).toBeInTheDocument()
    expect(loginLinkElement.closest('a')).toHaveAttribute('href', '/login')
  })

  test('renders register link', () => {
    const registerLinkElement = screen.getByText(/register/i)
    expect(registerLinkElement).toBeInTheDocument()
    expect(registerLinkElement.closest('a')).toHaveAttribute('href', '/register')
  })
})
