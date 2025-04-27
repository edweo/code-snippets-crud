import config from '../../server_config.js'

export const preserveIndent = (text: string): string => {
  const result = text.replace(/(\r\n|\n|\r)/gm, '<br>')
    .replaceAll('    ', '&nbsp;&nbsp;')
  return result
}

export const preserveIndentTextArea = (text: string): string => {
  const result = text.replaceAll('\r\n', '\r')
  const result2 = result.replaceAll('\n', '')
  return result2
}

export const baseUrl = (text: string): string => {
  return config.base_url + text
}
