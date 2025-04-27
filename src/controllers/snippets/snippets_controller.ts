import { type Request, type Response } from 'express'
import {
  deleteOneCodeSnippet,
  findSpecificCodeSnippet,
  listAllCodeSnippetsAsArrRender
} from '../../models/code_snippet/code_snippet_queries.js'
import type ActionResult from '../../modules/server_action/action_result.js'
import type CodeSnippetRender from '../../template_renders/code_snippet_render.js'
import { handleActionController } from '../../modules/server_action/handle_action_controller.js'
import { asyncCall } from '../../modules/async_callbacks.js'
import { type RenderOption, renderPage } from '../../modules/render_page.js'
import { type SessionServer } from '../../modules/session/session_server.js'
import { setFlashMessage } from '../../modules/session/set_flash_message.js'
import {
  handleActionControllerFlashMessage
} from '../../modules/server_action/handle_action_controller_flash_message.js'
import config from '../../../server_config.ts'

export const getSnippetsPage = (req: Request, res: Response): void => {
  asyncCall(req, res, async () => {
    const allCodeSnippets: ActionResult<CodeSnippetRender[]> = await listAllCodeSnippetsAsArrRender()
    await handleActionController(allCodeSnippets, res, async (result) => {
      const options: RenderOption[] = [{ name: 'codeSnippets', data: result }]
      renderPage(req.session, res, 'snippets', 'main', 'Code Snippets | Snippets', options)
    })
  }, (err: Error) => {
    console.log(err)
  })
}

export const viewSnippetPage = (req: Request, res: Response): void => {
  const params = req.params
  const id: string = params.id

  asyncCall(req, res, async () => {
    const actionResult = await findSpecificCodeSnippet(id)
    await handleActionController(actionResult, res, async (result) => {
      if (result === null) {
        res.status(404).send('NOT FOUND WITH ID: ' + id)
      } else {
        const options: RenderOption[] = [
          { name: 'snippet', data: result },
          { name: 'href_delete', data: config.base_url + `/snippets/delete/${id}` },
          { name: 'href_edit', data: config.base_url + `/snippets/edit/${id}` }
        ]
        const session: SessionServer = req.session
        if (result.by_user === session.username) options.push({ name: 'same_user', data: true })
        renderPage(req.session, res, 'snippet_view', 'main', 'Code Snippets | View', options)
      }
    })
  }, (err: Error) => {
    console.log(err)
  })
}

export const deleteCodeSnippet = (req: Request, res: Response): void => {
  const session: SessionServer = req.session
  const params = req.params
  const id: string = params.id
  const username: string = session.username

  asyncCall(req, res, async () => {
    const deleted: ActionResult<[boolean, string]> = await deleteOneCodeSnippet(id, username)
    await handleActionControllerFlashMessage(deleted, req, res, async (result) => {
      if (result[0]) {
        setFlashMessage(req.session, 'DELETED: ' + result[1])
        res.redirect(303, config.base_url + '/snippets')
      } else {
        setFlashMessage(req.session, 'Failed deleting: ' + result[1])
        res.redirect(500, config.base_url + '/snippets')
      }
    })
  }, (err: Error) => {
    console.log(err)
  })
}
