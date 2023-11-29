import mongoose from 'mongoose';

export interface AclInterface {
    roleId: string;
    workspaceId: string;
    resourceActions: {
        resource: string;
        resourceName: string;
        actions: {
            id: string;
            description: string;
            groupId?: string;
        }[];
    }[];
}


// Create a Schema corresponding to the document interface.
const AclSchema = new mongoose.Schema<AclInterface>({
    roleId: { type: String, required: true },
    workspaceId: { type: String, required: true },
    resourceActions: [
        {
            resource: { type: String, required: true },
            resourceName: { type: String, required: true },
            actions: [
                {
                    id: { type: String, required: true },
                    description: { type: String, required: true },
                    groupId: { type: String, required: false }
                }
            ]
        }
    ]
});

// Create a Model.
const Acl = mongoose.model<AclInterface>('Acl', AclSchema);

export default Acl;