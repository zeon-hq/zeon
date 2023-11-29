import { model, Schema, Model, Document } from 'mongoose';
import mongoose from "mongoose"

interface IMessage {
  message: string;
  workspaceId: string;
  createdAt: number;
  type: "SENT" | "RECEIVED" | "NOTE";
  isRead: boolean;
  threadId?: string;
  ticketId: string;
}

const MessageSchema: Schema = new Schema({
  message: {type: String, required: true},
  workspaceId: {type: String, required: true},
  createdAt: {type: Number, required: true},
  type: {type: String, required: true},
  isRead: {type: Boolean, required: true},
  threadId: {type: String, default: ""},
  ticketId: {type: String, required: true},
},{
  timestamps:true
});

//@ts-ignore
export const Message: Model<IMessage> = model('Message', MessageSchema);