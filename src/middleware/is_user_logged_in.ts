import { type Request, type Response, type NextFunction } from 'express'
import { type SessionServer } from '../modules/session/session_server.js'
import { setFlashMessage } from '../modules/session/set_flash_message.js'
import config from '../../server_config.js'

export const allowIfUserLoggedIn = (msgOnNotLoggedIn?: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userSession: SessionServer = req.session
    if (isUserLoggedIn(userSession)) {
      next() // User is logged in
    } else {
      const msg = msgOnNotLoggedIn ?? 'You need to log in to access this resource'
      setFlashMessage(userSession, msg)
      res.status(403).redirect(config.base_url + '/login')
    }
  }
}

export const allowIfUserNotLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
  const userSession: SessionServer = req.session
  if (isUserLoggedIn(userSession)) {
    res.redirect(config.base_url + '/snippets')
  } else {
    next()
  }
}

const isUserLoggedIn = (session: SessionServer): boolean => {
  let isLoggedIn: boolean = false
  if (session.username !== undefined) {
    isLoggedIn = true
  }

  return isLoggedIn
}
