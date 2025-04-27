import { model, type Model, Schema } from 'mongoose'

export interface ICodeSnippet {
  title: string
  code: string
  tags: string[]
  by_user: string
  language: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICodeSnippetMethods {
  // print: () => void
}

// eslint-disable-next-line @typescript-eslint/ban-types
type CodeSnippetModel = Model<ICodeSnippet, {}, ICodeSnippetMethods>

const schema: Schema<ICodeSnippet, CodeSnippetModel, ICodeSnippetMethods> = new Schema<ICodeSnippet, CodeSnippetModel, ICodeSnippetMethods>({
  title: { type: String, required: true },
  code: { type: String, required: true },
  tags: { type: [String], required: true },
  by_user: { type: String, required: true },
  language: { type: String, required: true }
})

export const CodeSnippet: CodeSnippetModel = model<ICodeSnippet, CodeSnippetModel>('CodeSnippet', schema)
