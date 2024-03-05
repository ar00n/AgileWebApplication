import '@testing-library/jest-dom'

import { render, waitFor, screen } from '@testing-library/react'
import Users from '../../src/app/users/page'
import { getUserProfiles } from '@/lib/user'

jest.mock('@/lib/user')

async function resolvedComponent (Component, props) {
  const ComponentResolved = await Component(props)
  return () => ComponentResolved
}

describe('Users component', () => {
  test('renders AlertBox when getUserProfiles fails', async () => {
    getUserProfiles.mockResolvedValueOnce({ success: false })

    const ResolvedUsers = await resolvedComponent(Users)
    render(<ResolvedUsers />)

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })

  test('renders UserTable when getUserProfiles succeeds', async () => {
    const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }]
    getUserProfiles.mockResolvedValueOnce({ success: true, users })

    const ResolvedUsers = await resolvedComponent(Users)
    render(<ResolvedUsers />)

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument())

    users.forEach(user => {
      expect(screen.getByText(user.name)).toBeInTheDocument()
    })
  })
})
