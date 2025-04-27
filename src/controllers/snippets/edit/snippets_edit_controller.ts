import { type NextFunction, type Request, type Response } from 'express'
import { asyncCall } from '../../../modules/async_callbacks.js'
import { type RenderOption, renderPage } from '../../../modules/render_page.js'
import { handleActionController } from '../../../modules/server_action/handle_action_controller.js'
import { findSpecificCodeSnippet, updateOneCodeSnippet } from '../../../models/code_snippet/code_snippet_queries.js'
import {
  handleActionControllerFlashMessage
} from '../../../modules/server_action/handle_action_controller_flash_message.js'
import { setFlashMessage } from '../../../modules/session/set_flash_message.js'
import config from '../../../../server_config.js'

export const getEditSnippetPage = (req: Request, res: Response, next: NextFunction): void => {
  const params = req.params
  const id: string = params.id

  asyncCall(req, res, async () => {
    const actionResult = await findSpecificCodeSnippet(id)
    await handleActionController(actionResult, next, async (result) => {
      if (result === null) {
        res.status(404).send('NOT FOUND WITH ID: ' + id)
      } else {
        const options: RenderOption[] = [
          { name: 'title', data: result.title },
          { name: 'code', data: result.code },
          { name: 'language', data: result.language },
          { name: 'href_post', data: req.originalUrl }
        ]
        renderPage(req.session, res, 'snippets_edit', 'main', 'Code Snippets | Edit', options)
      }
    })
  }, (err: Error) => {
    console.log(err)
  })
}
export const updateSnippet = (req: Request, res: Response, next: NextFunction): void => {
  const params = req.params
  const body = req.body

  asyncCall(req, res, async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    // @ts-expect-error username exists on req.session
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = await updateOneCodeSnippet(params.id, body.title, body.code, body.language, req.session.username)
    await handleActionControllerFlashMessage(result, req, res, async (result) => {
      if (result[0]) {
        setFlashMessage(req.session, 'Edited: ' + result[1])
        res.redirect(303, config.base_url + '/snippets')
      } else {
        setFlashMessage(req.session, 'Failed editing: ' + result[1])
        res.redirect(500, config.base_url + '/snippets')
      }
    })
  }, (err: Error) => {
    console.log(err)
  })
}
