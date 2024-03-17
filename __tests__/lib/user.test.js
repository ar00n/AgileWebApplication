import { getSessionUser } from '@/lib/user'
import { cookies } from 'next/headers'
const { knexClient } = require('@/lib/database')

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockImplementation(() => ({
    get: jest.fn()
  }))
}))
jest.mock('@/lib/database')

describe('getSessionUser', () => {
  beforeEach(() => {
    // jest.resetAllMocks()
  })

  // test('should return error when no session cookies found', async () => {
  //   cookies().get.mockReturnValueOnce(undefined)

  //   const result = await getSessionUser()

  //   expect(result).toEqual({
  //     success: false,
  //     action: 'getSessionUser',
  //     message: 'No session cookies found.'
  //   })
  // })

  test('should return error when user session does not exist', async () => {
    jest.mock('next/headers', () => ({
      cookies: jest.fn().mockImplementation(() => ({
        get: jest.fn()
          .mockReturnValueOnce(() => 'session_username')
          .mockReturnValueOnce(() => 'session_token')
      }))
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

  // test('should return error when user session has expired', async () => {
  //   cookies().get.mockReturnValueOnce('dummyValue')
  //   knexClient.from.mockReturnValueOnce({
  //     where: jest.fn().mockReturnThis(),
  //     join: jest.fn().mockReturnThis(),
  //     first: jest.fn().mockResolvedValue({ expires_at: Date.now() - 1000 })
  //   })

  //   const result = await getSessionUser()

  //   expect(result).toEqual({
  //     success: false,
  //     action: 'getSessionUser',
  //     message: 'User session has expired.'
  //   })
  // })

  // test('should return success when user session is valid', async () => {
  //   const mockUser = {
  //     username: 'testUser',
  //     is_admin: false,
  //     expires_at: Date.now() + 1000
  //   }
  //   cookies().get.mockReturnValueOnce('dummyValue')
  //   knexClient.from.mockReturnValueOnce({
  //     where: jest.fn().mockReturnThis(),
  //     join: jest.fn().mockReturnThis(),
  //     first: jest.fn().mockResolvedValue(mockUser)
  //   })

  //   const result = await getSessionUser()

  //   expect(result).toEqual({
  //     success: true,
  //     action: 'getSessionUser',
  //     message: 'User session is valid.',
  //     username: mockUser.username,
  //     isAdmin: mockUser.is_admin
  //   })
  // })
})
