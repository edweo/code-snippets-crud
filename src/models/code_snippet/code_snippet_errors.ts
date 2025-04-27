import type ServerError from '../../modules/server_errors/server_error.js'

export const ERROR_SAVING_CODE_SNIPPET_IN_DB: ServerError = { msgToServer: 'Error saving code snippet in DB', msgToClient: 'Internal server error', statusCode: 500 }
export const ERROR_FINDING_CODE_SNIPPET_IN_DB: ServerError = { msgToServer: 'Error finding code snippet in DB', msgToClient: 'Code snippet does not exist', statusCode: 500 }
export const ERROR_TITLE_CODE_SNIPPET_IN_DB: ServerError = { msgToServer: 'Error incorrect title while creating code snippet', msgToClient: 'Title not correct, empty or too short', statusCode: 500 }
export const ERROR_CODE_CODE_SNIPPET_IN_DB: ServerError = { msgToServer: 'Error incorrect code while creating code snippet', msgToClient: 'Code not correct, empty or too short', statusCode: 400 }
export const ERROR_UNAUTHORIZED_USER_CODE_SNIPPET_IN_DB: ServerError = { msgToServer: 'Error deleting code snippet by wrong user', msgToClient: 'Unauthorized to acces this resource', statusCode: 403 }
export const ERROR_LANGUAGE_CODE_SNIPPET_IN_DB: ServerError = { msgToServer: 'Error incorrect language', msgToClient: 'Language not correct', statusCode: 400 }
