import '@testing-library/jest-dom'

import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import RegisterForm from '../../src/app/register/page'
import * as userLib from '@/lib/user'

jest.mock('@/lib/user')
userLib.getSessionUser = jest.fn().mockResolvedValue({ success: false })
userLib.register = jest.fn().mockResolvedValue({ success: false })

describe('RegisterForm', () => {
  beforeEach(async () => {
    render(<RegisterForm />)

    await waitFor(() => {
      const usernameLabel = screen.getByLabelText('Username')
      expect(usernameLabel).toBeInTheDocument()
    })
  })

  it('has username and password fields', async () => {
    const usernameInput = screen.getByLabelText('Username')
    const nameInput = screen.getByLabelText('Name')
    const passwordInput = screen.getByLabelText('Password')

    expect(usernameInput).toBeInTheDocument()
    expect(nameInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
  })

  it('fails bad password', async () => {
    const usernameInput = screen.getByLabelText('Username')
    const nameInput = screen.getByLabelText('Name')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /Register/i })

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(nameInput, { target: { value: 'testname' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })
    fireEvent.click(submitButton)

    expect(await screen.findByText('Password is too weak. This is a top-10 common password')).toBeInTheDocument()
  })

  it('submits the form', async () => {
    const usernameInput = screen.getByLabelText('Username')
    const nameInput = screen.getByLabelText('Name')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /Register/i })

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(nameInput, { target: { value: 'testname' } })
    fireEvent.change(passwordInput, { target: { value: 'pas$22^3512#' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(userLib.register).toHaveBeenCalledWith('testuser', 'testname', 'pas$22^3512#')
    })
  })
})
