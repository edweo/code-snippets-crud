import express, { type Router } from 'express'
import * as controller from '../../../controllers/snippets/new/snippets_new_controller.js'
import { allowIfUserLoggedIn } from '../../../middleware/is_user_logged_in.js'

const router: Router = express.Router()
export default router

router.get('/',
  allowIfUserLoggedIn('You need to log in to create new code snippets'),
  controller.getNewSnippetPage)
router.post('/', allowIfUserLoggedIn(), controller.createNewSnippet)
