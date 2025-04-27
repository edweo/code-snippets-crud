enum CodeLanguage {
  JAVASCRIPT = 'JavaScript',
  PYTHON = 'Python',
  JAVA = 'Java',
  C_SHARP = 'C#',
  CPP = 'C++',
  C = 'C',
  KOTLIN = 'Kotlin',
  SWIFT = 'Swift',
  TYPESCRIPT = 'TypeScript'
}

enum CodeLanguageImage {
  JAVASCRIPT = '/icons/code/js.png',
  PYTHON = '/icons/code/py.png',
  JAVA = '/icons/code/java.png',
  C_SHARP = '/icons/code/cs.png',
  CPP = '/icons/code/cpp.png',
  C = '/icons/code/c.png',
  KOTLIN = '/icons/code/kt.png',
  SWIFT = '/icons/code/swift.png',
  TYPESCRIPT = '/icons/code/ts.png'
}

const validateValidCodeLanguage = (language: string): string | null => {
  const languageUpperCase = language.toUpperCase()
  for (const key in CodeLanguage) {
    // @ts-expect-error should not be an error as they key is guaranteed to match
    const value = CodeLanguage[key].toUpperCase()
    if (value === languageUpperCase) return key
  }
  return null
}

const getCodeLanguageImgUrl = (language: string): string | null => {
  const validLanguage = validateValidCodeLanguage(language)
  if (validLanguage === null) return null

  // Should be guaranteed to find key since language is valid
  for (const key in CodeLanguageImage) {
    // @ts-expect-error should not be an error as they key is guaranteed to match
    if (key === validLanguage) return CodeLanguageImage[key]
  }

  return null
}

export { CodeLanguage, CodeLanguageImage, validateValidCodeLanguage, getCodeLanguageImgUrl }
