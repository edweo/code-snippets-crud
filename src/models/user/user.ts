import { model, type Model, Schema } from 'mongoose'

export interface IUser {
  username: string
  username_lower: string
  password: string
  snippetsCount: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserMethods {
  // print: () => void
}

// eslint-disable-next-line @typescript-eslint/ban-types
type UserModel = Model<IUser, {}, IUserMethods>

const schema: Schema<IUser, UserModel, IUserMethods> = new Schema<IUser, UserModel, IUserMethods>({
  username: { type: String, required: true, unique: true },
  username_lower: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  snippetsCount: { type: Number, required: true }
})

export const User: UserModel = model<IUser, UserModel>('User', schema)
