import mongoose, { Document, Schema } from "mongoose";

export enum IMessageSource {
  DASHBOARD = "dashboard",
  WIDGET = "widget",
  BOTH = "both",
  SLACK = "slack",
  HUMAN_INTERVENTION = "human_intervention"
}

export enum IChatType {
  AI_MESSAGE = 'AI_MESSAGE',
  HUMAN_MESSAGE = 'HUMAN_MESSAGE',
  AUTO_REPLY = 'AUTO_REPLY',
  OUT_OF_OFFICE = 'OUT_OF_OFFICE',
  NOTE = 'NOTE',
  SLACK_MESSAGE = 'SLACK_MESSAGE',
  ERROR = 'ERROR'
}

export enum IMessageType {
  SENT = "sent",
  RECEIVED = "received",
  NOTE = "NOTE"
}

export interface IMessage extends Document {
  message: string;
  messageSenderName: string;
  messageSenderProfilePicUrl: string;
  ticketId: string;
  workspaceId: string;
  createdAt: number;
  type: IMessageType;
  chatType: IChatType;
  messageSource: IMessageSource;
  isRead: boolean;
}

const messageSchema = new Schema<IMessage>({
  message: String,
  ticketId: {type:String, ref:'tickets'},
  workspaceId: { type: String },
  createdAt: { type: Number },
  type: { type: String },
  messageSenderName: { type: String },
  messageSenderProfilePicUrl: { type: String },
  chatType: { type: String },
  messageSource: {type: String},
  isRead: { type: Boolean },
}, {
  timestamps: true
});

const MessageModel = mongoose.model<IMessage>('messages', messageSchema);

export default MessageModel;