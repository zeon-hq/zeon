import mongoose from 'mongoose';

export interface ResourceActionInterface {
    id: string;
    description: string; 
}

export interface IResource {
    resource : string;
    resourceName : string;
    actions : ResourceActionInterface[];
}

// Convert this to mongoose schema

const ResourceSchema = new mongoose.Schema<IResource>({
    resource: { type: String, required: true, unique: true },
    resourceName: { type: String, required: true },
    actions: [{ type: Object, required: true }],
});

const Resource = mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;



