import { getSessionUser } from './user'

export const logger = require('pino')()

async function handleLog (res, target) {
  const sessionUser = (await getSessionUser())?.username
  const username = sessionUser || 'N/A'

  const child = logger.child({ action: res?.action, user: username, target })

  if (res.success) {
    child.info(res?.message)
  } else {
    child.warn(res?.message)
  }
}

export async function logEvent (res, target) {
  handleLog(res, target)
  return res
}
