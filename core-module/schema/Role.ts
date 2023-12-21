import mongoose from 'mongoose';

export interface RoleInterface {
    roleId: string;
    name: string;
    description: string;
    workspaceId: string;
    isInternal: boolean;
}

// Create a Schema corresponding to the document interface.
const RoleSchema = new mongoose.Schema<RoleInterface>({
    roleId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    workspaceId: { type: String, required: true },
    isInternal: { type: Boolean, required: true, default: false },
},{
    // add createdAt and updatedAt fields
    timestamps: true
});


// Create a Model.
const Role = mongoose.model<RoleInterface>('Role', RoleSchema);

export default Role;
