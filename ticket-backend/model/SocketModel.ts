import mongoose, { Document, Schema } from "mongoose";

// Define an interface for your JSON data
export interface Socket extends Document{
  
  workspaceId: string;
  socketId: string;
  isDeleted: boolean;
}

// Define the Mongoose schema
const socketSchema = new Schema<Socket>({
  workspaceId: String,
  socketId: String,
  isDeleted: {
    type: Boolean,
    default: false
  }
},{
  timestamps:true
});

// Create a Mongoose model using the schema with the specified collection name
const SocketModel = mongoose.model<Socket>("sockets", socketSchema);

export default SocketModel;
