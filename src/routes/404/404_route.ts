import express, { type Request, type Response, type Router } from 'express'

const router: Router = express.Router()
export default router

router.all('*', (req: Request, res: Response) => {
  res.status(404).render('pages/404', {
    layout: 'hero',
    title: '404'
  })
})
