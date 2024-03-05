import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import UserProfile from '../../../src/app/users/[user]/page'
import { getUserProfile } from '@/lib/user'
import { getSessionUser } from '@/lib/user'

jest.mock('@/lib/user', () => ({
  getUserProfile: jest.fn(),
  getSessionUser: jest.fn()
}))

getSessionUser.mockResolvedValue({ success: true, isAdmin: false })

async function resolvedComponent (Component, props) {
  const ComponentResolved = await Component(props)
  return () => ComponentResolved
}

test('renders user profile', async () => {
  getUserProfile.mockResolvedValueOnce({ success: true, user: { name: 'Test User', username: 'testuser', is_admin: false } })

  const ResolvedUserProfile = await resolvedComponent(UserProfile, { params: { user: 'testuser' } })
  render(<ResolvedUserProfile />)

  await waitFor(() => screen.getByText('@testuser'))

  expect(screen.getByText('Test User')).toBeInTheDocument()
  expect(screen.getByText('@testuser')).toBeInTheDocument()
  expect(screen.getByTestId('user-icon')).toBeInTheDocument()
})

test('renders admin badge for admin users', async () => {
  getUserProfile.mockResolvedValueOnce({ success: true, user: { name: 'Admin User', username: 'adminuser', is_admin: true } })

  const ResolvedUserProfile = await resolvedComponent(UserProfile, { params: { user: 'adminuser' } })
  render(<ResolvedUserProfile />)

  await waitFor(() => screen.getByText('@adminuser'))

  expect(screen.getByText('Admin User')).toBeInTheDocument()
  expect(screen.getByText('@adminuser')).toBeInTheDocument()
  expect(screen.getByTestId('admin-icon')).toBeInTheDocument()
})

test('renders error message on failure', async () => {
  getUserProfile.mockResolvedValueOnce({ success: false, message: 'User not found' })

  const ResolvedUserProfile = await resolvedComponent(UserProfile, { params: { user: 'nonexistentuser' } })
  render(<ResolvedUserProfile />)

  await waitFor(() => screen.getByText('User not found'))

  expect(screen.getByText('User not found')).toBeInTheDocument()
})
