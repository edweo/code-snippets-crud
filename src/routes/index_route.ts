import express, { type Router, type Request, type Response } from 'express'
import config from '../../server_config.ts'

const router: Router = express.Router()
export default router

router.get('/', (req: Request, res: Response): void => {
  res.redirect(config.base_url + '/snippets')
})
