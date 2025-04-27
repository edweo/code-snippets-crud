import { type NextFunction, type Request, type Response } from 'express'
import { type ICodeSnippet } from '../../../models/code_snippet/code_snippet.js'
import { asyncCall } from '../../../modules/async_callbacks.js'
import { createNewCodeSnippet } from '../../../models/code_snippet/code_snippet_queries.js'
import { type SessionServer } from '../../../modules/session/session_server.js'
import { type NewCodeSnippetBody } from './new_snippet_body.js'
import { handleActionControllerFlashMessage } from '../../../modules/server_action/handle_action_controller_flash_message.js'
import { renderPage } from '../../../modules/render_page.js'
import { setFlashMessage } from '../../../modules/session/set_flash_message.js'
import config from '../../../../server_config.js'

export const getNewSnippetPage = (req: Request, res: Response): void => {
  renderPage(req.session, res, 'snippets_new', 'main', 'Code Snippets | New')
}
export const createNewSnippet = (req: Request, res: Response, next: NextFunction): void => {
  const params: NewCodeSnippetBody = req.body
  const session: SessionServer = req.session

  if (session.username === undefined) {
    setFlashMessage(req.session, 'Internal error while creating code snippet')
    res.redirect(config.base_url + '/snippets')
    return
  }
  const username = session.username

  asyncCall(req, res, async () => {
    const codeSnippet: ICodeSnippet = {
      title: params.title,
      code: params.code,
      tags: [],
      by_user: username,
      language: params.language
    }

    const createdSnippet = await createNewCodeSnippet(codeSnippet)
    await handleActionControllerFlashMessage(createdSnippet, req, res, async () => {
      setFlashMessage(req.session, 'Successfully created code snippet: ' + codeSnippet.title)
      res.redirect(config.base_url + '/snippets')
    })
  }, (err: Error) => {
    console.log(err)
    setFlashMessage(req.session, 'Internal error while creating code snippet')
    res.redirect(config.base_url + '/snippets')
  })
}
