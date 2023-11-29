import mongoose, { Document, Schema } from "mongoose";

// Define an interface for your JSON data
export interface SocketAdapterEvent extends Document {
  type: number;
  uid: string;
  nsp: string;
}

// Define the Mongoose schema
const socketAdapterEventSchema = new Schema<SocketAdapterEvent>({
  type: Number,
  uid: String,
  nsp: String,
},{
  timestamps:true
});

// Create a Mongoose model using the schema with the specified collection name
const SocketAdapterEventModel = mongoose.model<SocketAdapterEvent>(
  "socket-adapter-events",
  socketAdapterEventSchema
);

export default SocketAdapterEventModel;
