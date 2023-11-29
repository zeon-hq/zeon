// @ts-nocheck
import mongoose, { Document, Schema } from "mongoose";

// Define an interface for your JSON data
export interface TicketModel {
  workspaceId: string;
  ticketId: string;
  channelId: string;
  customerEmail: string;
  createdAt: number;
  updatedAt: number;
  text: string;
  isOpen: boolean;
  type: string;
  messageCount: number;
  socketId: string;
  widgetId: string;
  messages?: any[];
  assignedUser?: string;
  assignedUserInfo?: any;
}

// Define the Mongoose schema
const ticketModelSchema = new Schema<TicketModel>({
  workspaceId: String,
  channelId: {type: String, required: true},
  text: String,
  ticketId: String,
  customerEmail: String,
  createdAt: Number,
  updatedAt: Number,
  isOpen: Boolean,
  type: String,
  socketId: {type: String, required: true},
  widgetId: {type: String, required: true},
  messages: {type: Array, required: false},
  messageCount: {type: Number, required: true},
  assignedUser: String,
  assignedUserInfo: {type: Object, required: false},
},{
  timestamps:true
});

// Create a Mongoose model using the schema
const TicketModel = mongoose.model<TicketModel & Document>("tickets", ticketModelSchema);

export default TicketModel;
