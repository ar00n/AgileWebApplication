import { knexClient } from '@/lib/database'
import { editTicket } from '@/lib/tickets'
import { getSessionUser, getUser } from '@/lib/user'

jest.mock('@/lib/database')
jest.mock('@/lib/user')

describe('editTicket', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('should fail if not logged in', async () => {
    getSessionUser.mockResolvedValueOnce({ success: false })

    const result = await editTicket(1, {})

    expect(result).toEqual({ success: false, action: 'editTicket', message: 'Not logged in.' })
  })

  test('should fail if requester does not exist', async () => {
    getSessionUser.mockResolvedValueOnce({ success: true })
    getUser.mockRejectedValue(new Error('User not found'))

    const result = await editTicket(1, { requester: 'nonexistent' })

    expect(result).toEqual({ success: false, action: 'editTicket', message: 'User not found' })
  })

  test('should fail if ticket update fails', async () => {
    getSessionUser.mockResolvedValueOnce({ success: true })
    getUser.mockResolvedValueOnce({ success: true })
    knexClient.mockImplementation(() => ({
      where: () => ({
        update: () => Promise.resolve(null)
      })
    }))

    const result = await editTicket(1, { requester: 'existing', severity: 'high', title: 'title', message: 'message' })

    expect(result).toEqual({ success: false, action: 'editTicket', message: 'Failed to create ticket.' })
  })

  test('should succeed if all conditions are met', async () => {
    getSessionUser.mockResolvedValueOnce({ success: true })
    getUser.mockResolvedValueOnce({ success: true })
    knexClient.mockImplementation(() => ({
      where: () => ({
        update: () => Promise.resolve([{}])
      })
    }))

    const result = await editTicket(1, { requester: 'existing', severity: 'high', title: 'title', message: 'message' })

    expect(result).toEqual({ success: true, action: 'editTicket', message: 'Ticket modified.', ticket: {} })
  })
})
