import { type Request, type Response } from 'express'
import { type SessionServer } from '../../modules/session/session_server.js'
import { setFlashMessage } from '../../modules/session/set_flash_message.js'
import config from '../../../server_config.js'

export const handleLogout = (req: Request, res: Response): void => {
  const session: SessionServer = req.session

  session.destroy((err: Error) => {
    if (err !== undefined) {
      setFlashMessage(session, 'Logged out')
      res.redirect(config.base_url + '/snippets')
    } else {
      res.status(400).send('bad request')
    }
  })
}
