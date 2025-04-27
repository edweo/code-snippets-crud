import type { SessionServer } from './session_server.js'

export const setFlashMessage = (session: SessionServer, msg: string): void => {
  session.flash_message = msg
  session.flash_shown_times = 0
}
