import mongoose, { Document, Schema } from "mongoose";

// Define an interface for your JSON data
export interface Socket extends Document{
  
  workspaceId: string;
  socketId: string;
}

// Define the Mongoose schema
const socketSchema = new Schema<Socket>({
  workspaceId: String,
  socketId: String,
},{
  timestamps:true
});

// Create a Mongoose model using the schema with the specified collection name
const SocketModel = mongoose.model<Socket>("sockets", socketSchema);

export default SocketModel;
