import { type Session } from 'express-session'
export interface SessionServer extends Session {
  username?: string
  flash_message?: string
  flash_shown_times?: 0
}
