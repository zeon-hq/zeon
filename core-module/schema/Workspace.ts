import mongoose from 'mongoose';
import {  ZeonModulesArray } from './../types/types'

export interface WorkspaceInterface {
    workspaceId: string;
    accountId: string;
    workspaceName: string;
    primaryContactName: string;
    primaryContactEmail: string;
    isDeleted: boolean;
    signupDetails : {
        signupMode: string;
        isVerified: boolean;
    };
    modules: ZeonModulesArray
}

// Create a Schema corresponding to the document interface.
const WorkspaceSchema = new mongoose.Schema<WorkspaceInterface>({
    workspaceId: { type: String, required: true },
    workspaceName: { type: String, required: true },
    primaryContactName: { type: String, required: true },
    primaryContactEmail: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
    signupDetails: {
        signupMode: { type: String, required: true },
        isVerified: { type: Boolean, required: true }
    },
    modules: [{ type: String, required: true, default: [] }]
},{
    timestamps: true
});

// Create a Model.
const Workspace = mongoose.model<WorkspaceInterface>('Workspace', WorkspaceSchema);

export default Workspace;
