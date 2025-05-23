import express, { type Router } from 'express'
import * as controller from '../../controllers/logout/logout_controller.js'
import { allowIfUserLoggedIn } from '../../middleware/is_user_logged_in.js'

const router: Router = express.Router()
export default router

router.get('/', allowIfUserLoggedIn(), controller.handleLogout)
