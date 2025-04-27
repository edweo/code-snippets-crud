import express, { type Router } from 'express'
import * as controller from '../../../controllers/snippets/edit/snippets_edit_controller.js'
import { allowIfUserLoggedIn } from '../../../middleware/is_user_logged_in.js'

const router: Router = express.Router()
export default router

router.get('/:id',
  allowIfUserLoggedIn('You need to log in to edit code snippets'),
  controller.getEditSnippetPage)
router.put('/:id', allowIfUserLoggedIn(), controller.updateSnippet)
