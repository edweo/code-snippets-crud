import type ActionResult from '../../modules/server_action/action_result.js'
import type { HydratedDocument } from 'mongoose'
import { CodeSnippet, type ICodeSnippet } from './code_snippet.js'
import type CodeSnippetRender from '../../template_renders/code_snippet_render.js'
import { CodeLanguage, getCodeLanguageImgUrl, validateValidCodeLanguage } from './code_language.js'
import * as serverErrors from '../../modules/server_errors/server_errors.js'
import { handleActionModel } from '../../modules/server_action/handle_action_model.js'
import * as modelErrors from './code_snippet_errors.js'

export const listAllCodeSnippetsDocuments = async (): Promise<ActionResult<Array<HydratedDocument<ICodeSnippet>>>> => {
  const actionResult: ActionResult<Array<HydratedDocument<ICodeSnippet>>> = {
    msgToServer: 'Error fetching all code snippets',
    result: [],
    serverError: undefined
  }

  try {
    const allCodeSnippets: Array<HydratedDocument<ICodeSnippet>> = await CodeSnippet.find()
    actionResult.msgToServer = 'Successfully fetched all Code Snippet Documents from DB'
    actionResult.result = allCodeSnippets
  } catch (e) {
    actionResult.serverError = serverErrors.ERROR_ACCESSING_DB
  }

  return actionResult
}

export const listAllCodeSnippetsAsArrRender = async (): Promise<ActionResult<CodeSnippetRender[]>> => {
  const actionResult: ActionResult<CodeSnippetRender[]> = {
    msgToServer: 'Error fetching all code snippets',
    result: [],
    serverError: undefined
  }

  const allCodeSnippets: ActionResult<Array<HydratedDocument<ICodeSnippet>>> = await listAllCodeSnippetsDocuments()
  await handleActionModel(allCodeSnippets, async (result: Array<HydratedDocument<ICodeSnippet>>) => {
    actionResult.result = result.map((document: HydratedDocument<ICodeSnippet>) => {
      return convertDocToRender(document)
    })
    actionResult.msgToServer = 'Queried all Code Snippets for render in template array'
  })

  return actionResult
}

export const createNewCodeSnippet = async (codeSnippet: ICodeSnippet): Promise<ActionResult<boolean>> => {
  const actionResult: ActionResult<boolean> = { msgToServer: `Error creating new code snippet: ${codeSnippet.title}`, result: false, serverError: undefined }
  if (codeSnippet.title.length < 3) {
    actionResult.serverError = modelErrors.ERROR_TITLE_CODE_SNIPPET_IN_DB
    return actionResult
  }

  if (codeSnippet.code.length < 3) {
    actionResult.serverError = modelErrors.ERROR_CODE_CODE_SNIPPET_IN_DB
    return actionResult
  }

  if (validateValidCodeLanguage(codeSnippet.language) === null) {
    actionResult.serverError = modelErrors.ERROR_LANGUAGE_CODE_SNIPPET_IN_DB
    return actionResult
  }

  try {
    const newCodeSnippet: HydratedDocument<ICodeSnippet> = new CodeSnippet(codeSnippet)
    await newCodeSnippet.save()
    actionResult.result = true
    actionResult.msgToServer = `Created new code snippet: ${codeSnippet.title}, ${codeSnippet.by_user}`
  } catch (e) {
    actionResult.serverError = modelErrors.ERROR_SAVING_CODE_SNIPPET_IN_DB
  }

  return actionResult
}

export const findSpecificCodeSnippet = async (id: string): Promise<ActionResult<CodeSnippetRender | null>> => {
  const actionResult: ActionResult<CodeSnippetRender | null> = { msgToServer: `Error finding code snippet with id: ${id}`, result: null, serverError: undefined }

  try {
    const doc: HydratedDocument<ICodeSnippet> | null = await CodeSnippet.findById(id)
    actionResult.result = convertDocToRender(doc)
    actionResult.msgToServer = `Successfully queried code snippet with id: ${id}`
  } catch (e) {
    actionResult.serverError = modelErrors.ERROR_FINDING_CODE_SNIPPET_IN_DB
  }

  return actionResult
}

export const deleteOneCodeSnippet = async (snippetId: string, snippetUsername: string): Promise<ActionResult<[boolean, string]>> => {
  const actionResult: ActionResult<[boolean, string]> = { msgToServer: `Error deleting code snippet with id: ${snippetId}`, result: [false, ''], serverError: undefined }

  try {
    const doc: HydratedDocument<ICodeSnippet> | null = await CodeSnippet.findById(snippetId)

    if (doc === null) {
      actionResult.serverError = modelErrors.ERROR_FINDING_CODE_SNIPPET_IN_DB
      return actionResult
    }

    if (doc.by_user !== snippetUsername) {
      actionResult.serverError = modelErrors.ERROR_UNAUTHORIZED_USER_CODE_SNIPPET_IN_DB
      actionResult.result[1] = doc.title
      return actionResult
    }

    await doc.deleteOne()
    actionResult.msgToServer = 'Successfully deleted code snippet with id: ' + snippetId
    actionResult.result[0] = true
    actionResult.result[1] = doc.title
  } catch (e) {
    actionResult.serverError = serverErrors.ERROR_ACCESSING_DB
  }

  return actionResult
}

export const updateOneCodeSnippet = async (snippetId: string, title: string, code: string, language: string, snippetUsername: string): Promise<ActionResult<[boolean, string]>> => {
  const actionResult: ActionResult<[boolean, string]> = { msgToServer: `Error deleting code snippet with id: ${snippetId}`, result: [false, ''], serverError: undefined }

  try {
    const doc: HydratedDocument<ICodeSnippet> | null = await CodeSnippet.findById(snippetId)

    if (doc === null) {
      actionResult.serverError = modelErrors.ERROR_FINDING_CODE_SNIPPET_IN_DB
      return actionResult
    }

    if (doc.by_user !== snippetUsername) {
      actionResult.serverError = modelErrors.ERROR_UNAUTHORIZED_USER_CODE_SNIPPET_IN_DB
      actionResult.result[1] = doc.title
      return actionResult
    }

    if (title.length < 3) {
      actionResult.serverError = modelErrors.ERROR_TITLE_CODE_SNIPPET_IN_DB
      return actionResult
    }

    if (code.length < 3) {
      actionResult.serverError = modelErrors.ERROR_CODE_CODE_SNIPPET_IN_DB
      return actionResult
    }

    if (validateValidCodeLanguage(language) === null) {
      actionResult.serverError = modelErrors.ERROR_LANGUAGE_CODE_SNIPPET_IN_DB
      return actionResult
    }

    doc.title = title
    doc.language = language
    doc.code = code.trim()

    await doc.save()
    actionResult.msgToServer = 'Successfully edited code snippet with id: ' + snippetId
    actionResult.result[0] = true
    actionResult.result[1] = doc.title
  } catch (e) {
    actionResult.serverError = serverErrors.ERROR_ACCESSING_DB
  }

  return actionResult
}

const convertDocToRender = (doc: HydratedDocument<ICodeSnippet>): CodeSnippetRender => {
  // @ts-expect-error language parse might throw error
  return {
    id: doc.id,
    title: doc.title,
    code: doc.code,
    tags: doc.tags,
    by_user: doc.by_user,
    language: CodeLanguage[validateValidCodeLanguage(doc.language)],
    img_language: getCodeLanguageImgUrl(doc.language) ?? 'img/icon.png'
  }
}
