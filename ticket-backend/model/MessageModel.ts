import mongoose, { Document, Schema } from "mongoose";

export enum IMessageSource {
  DASHBOARD = "dashbaord",
  WIDGET = "widget",
  BOTH = "both",
  SLACK = "slack",
  HUMAN_INTERVENTION = "human_intervention"
}

export enum IMessageType {
  SENT = "sent",
  RECEIVED = "received",
  NOTE = "NOTE"
}

export interface IMessage extends Document {
  message: string;
  ticketId: string;
  workspaceId: string;
  createdAt: number;
  type: IMessageType;
  messageSource: IMessageSource;
  isRead: boolean;
}

const messageSchema = new Schema<IMessage>({
  message: String,
  ticketId: {type:String, ref:'tickets'},
  workspaceId: { type: String },
  createdAt: { type: Number },
  type: { type: String },
  messageSource: {type: String},
  isRead: { type: Boolean },
}, {
  timestamps: true
});

const MessageModel = mongoose.model<IMessage>('messages', messageSchema);

export default MessageModel;