import '@testing-library/jest-dom'

import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import LoginForm from '../../src/app/login/page'
import * as userLib from '@/lib/user'

jest.mock('@/lib/user')
userLib.getSessionUser = jest.fn().mockResolvedValue({ success: false })
userLib.login = jest.fn().mockResolvedValue({ success: false })

describe('LoginForm', () => {
  beforeEach(async () => {
    render(<LoginForm />)

    await waitFor(() => {
      const usernameLabel = screen.getByLabelText('Username')
      expect(usernameLabel).toBeInTheDocument()
    })
  })

  it('has username and password fields', async () => {
    const usernameInput = screen.getByLabelText('Username')
    const passwordInput = screen.getByLabelText('Password')

    expect(usernameInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
  })

  it('submits the form', async () => {
    const usernameInput = screen.getByLabelText('Username')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'testpass' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(userLib.login).toHaveBeenCalledWith('testuser', 'testpass')
    })
  })
})
