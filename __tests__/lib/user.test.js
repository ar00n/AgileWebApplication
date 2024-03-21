import { getSessionUser } from '@/lib/user'
import { cookies } from 'next/headers'
const { knexClient } = require('@/lib/database')

// jest.mock('next/headers', () => ({
//   cookies: jest.fn().mockImplementation(() => ({
//     get: jest.fn().mockReturnValue('dummyValue')
//   }))
// }))
jest.mock('next/headers')
jest.mock('@/lib/database')

describe('getSessionUser', () => {
  test('should return error when no session cookies found', async () => {
    cookies.mockImplementation(() => ({
      get: jest.fn().mockReturnValueOnce(undefined).mockReturnValueOnce(undefined)
    }))

    const result = await getSessionUser()

    expect(result).toEqual({
      success: false,
      action: 'getSessionUser',
      message: 'No session cookies found.'
    })
  })

  test('should return error when user session does not exist', async () => {
    cookies.mockImplementation(() => ({
      get: jest.fn().mockReturnValueOnce('testUser').mockReturnValueOnce('dummyToken')
    }))

    knexClient.from.mockReturnValueOnce({
      where: jest.fn().mockReturnThis(),
      join: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(null)
    })

    const result = await getSessionUser()

    expect(result).toEqual({
      success: false,
      action: 'getSessionUser',
      message: 'User session does not exist.'
    })
  })

  test('should return error when user session has expired', async () => {
    cookies.mockImplementation(() => ({
      get: jest.fn().mockReturnValueOnce('testUser').mockReturnValueOnce('dummyToken')
    }))

    knexClient.from.mockReturnValueOnce({
      where: jest.fn().mockReturnThis(),
      join: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue({ expires_at: Date.now() - 1000 })
    })

    const result = await getSessionUser()

    expect(result).toEqual({
      success: false,
      action: 'getSessionUser',
      message: 'User session has expired.'
    })
  })

  test('should return success when user session is valid', async () => {
    const mockUser = {
      username: 'testUser',
      token: 'dummyToken',
      is_admin: false,
      expires_at: Date.now() + 1000
    }

    cookies.mockImplementation(() => ({
      get: jest.fn().mockReturnValueOnce('testUser').mockReturnValueOnce('dummyToken')
    }))

    knexClient.from.mockReturnValueOnce({
      where: jest.fn().mockReturnThis(),
      join: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(mockUser)
    })

    const result = await getSessionUser()

    expect(result).toEqual({
      success: true,
      action: 'getSessionUser',
      message: 'User session is valid.',
      username: mockUser.username,
      isAdmin: mockUser.is_admin
    })
  })
})
