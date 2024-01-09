/**
 * user workspace schema
 * This schema hold info of the user in the context of a workspace
 */


/**
 * Schema for user workspace
 * userId: string
 * workspaceId: string
 * roleId: string
 * isActive: boolean
 * isDeleted: boolean
 */

import mongoose from 'mongoose';

export interface UserWorkspaceInterface {
    userId: string;
    workspaceId: string;
    roleId: string;
    isActive: boolean;
    isDeleted: boolean;
}

// Create a Schema corresponding to the document interface.
const UserWorkspaceSchema = new mongoose.Schema<UserWorkspaceInterface>({
    userId: { type: String, required: true },
    workspaceId: { type: String, required: true },
    roleId: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
},{
    timestamps: true
});

// index on userId and workspaceId
UserWorkspaceSchema.index({ userId: 1, workspaceId: 1 }, { unique: true });

// Create a Model.
const UserWorkspace = mongoose.model<UserWorkspaceInterface>('user_workspace', UserWorkspaceSchema);

export default UserWorkspace;