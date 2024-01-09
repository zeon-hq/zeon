import mongoose from "mongoose"

export interface UserInterface {
  userId: string
  name: string
  password: string
  phone?: {
    countryCode: string
    num: string
  }
  email: string
  teamIds?: string[]

  isActive: boolean
  isDeleted: boolean

  profilePic?: string,
}

// Create a Schema corresponding to the document interface.
const UserSchema = new mongoose.Schema<UserInterface>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  phone: {
    countryCode: { type: String, required: false },
    num: { type: String, required: false },
  },
  email: { type: String, required: true, unique: false },
  teamIds: [{ type: String, required: false }],

  isActive: { type: Boolean, required: true, default: true },
  isDeleted: { type: Boolean, required: true, default: false },

  profilePic: { type: String, required: false, default: null },
},{
    timestamps: true
})

// index on userId and workspaceId
UserSchema.index({ userId: 1, workspaceId: 1 }, { unique: true })

// Create a Model.
const User = mongoose.model<UserInterface>("user", UserSchema)

export default User
