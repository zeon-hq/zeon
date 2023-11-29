import mongoose, { Model, Schema, model } from "mongoose";

interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  teams: string[];
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }]
},{
  timestamps:true
});


//@ts-ignore
export const User: Model<IUser> = model("User", UserSchema);
