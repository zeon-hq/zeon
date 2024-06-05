import { model, Schema, Model, Document } from 'mongoose';
import mongoose from "mongoose"

interface ITicket {
  workspaceId: string;
  channelId: string;
  customerEmail: string;
  text: string;
  createdAt: number;
  updatedAt: number;
  isOpen: boolean;
  type: string;
  widgetId: string;
  socketId: string;
  ticketId?:string; // making the ticketId optional, because this is adding after 1 year, so it won't break in older structure
  messages?: any[];
  assignedUser?: string;
  assignedUserInfo?: any;
}

const TicketSchema: Schema = new Schema({
  workspaceId: {type: String, required: true},
  channelId: {type: String, required: true},
  widgetId: {type: String, required: true},
  text: {type: String, required: true},
  createdAt: {type: Number,  required: true},
  updatedAt: {type: Number,  required: true},
  isOpen: {type: Boolean, required: true},
  ticketId: String,
  type: {type: String, required: true},
  socketId: {type: String, required: true},
  messages: {type: Array, required: false},
  assignedUser: {type: String, required: true},
  assignedUserInfo: {type: Object, required: true},
},{
  timestamps:true
});

//@ts-ignore
export const Ticket: Model<ITicket> = model('Ticket', TicketSchema);