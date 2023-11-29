import { model, Schema, Model, Document } from 'mongoose';
import mongoose from "mongoose"

interface IWorkspace {
  workspaceName: string;
  members: string[];
  owner: string;
}

const WorkspaceSchema: Schema = new Schema({
  workspaceName: { type: String, required: true },
  members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
},{
  timestamps:true
});

//@ts-ignore
export const Workspace: Model<IWorkspace> = model('Workspace', WorkspaceSchema);