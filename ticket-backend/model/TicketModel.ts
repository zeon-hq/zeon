// @ts-nocheck
import mongoose, { Document, Schema } from "mongoose";

// Define an interface for your JSON data
export interface ITicketModel {
  workspaceId: string;
  ticketId: string;
  channelId: string;
  customerEmail: string;
  createdAt: number;
  updatedAt: number;
  text: string;
  isOpen: boolean;
  type: string;
  socketId: string;
  widgetId?: string;
  messages?: any[];
  assignedUser?: string;
  assignedUserInfo?: any;
  thread_ts?: string;
}

// Define the Mongoose schema
const ticketModelSchema = new Schema<ITicketModel>({
  workspaceId: String,
  channelId: {type: String, required: true},
  text: String,
  ticketId: String,
  customerEmail: String,
  thread_ts: String,
  createdAt: Number,
  updatedAt: Number,
  isOpen: Boolean,
  type: String,
  socketId: {type: String, required: true},
  widgetId: {type: String},
  messages: {type: Array, required: false},
  assignedUser: String,
  assignedUserInfo: {type: Object, required: false},
},{
  timestamps:true
});

// Create a Mongoose model using the schema
const TicketModel = mongoose.model<ITicketModel & Document>("tickets", ticketModelSchema);

export default TicketModel;
