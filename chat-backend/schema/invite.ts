import { model, Schema, Model, Document } from "mongoose";
import mongoose from "mongoose";

interface IInvite {
  email: string;
  workspaceId: string;
  channelId?: string;
}

const InviteSchema: Schema = new Schema({
  email: { type: String, required: true },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
},{
  timestamps:true
});

//@ts-ignore
export const Invite: Model<IInvite> = model("Invite", InviteSchema);
