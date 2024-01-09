import mongoose, { Schema } from "mongoose"

// create a interface for tags
export interface ITag {
    name: string;
    tagId: string;
    isDeleted: boolean;
    workspaceId: string;
}

export const TagSchema = new Schema({
    name: { type: String, required: true, unique: true },
    tagId: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false  },
    workspaceId: { type: String, required: true }

})

TagSchema.index({ name: 1, workspaceId: 1 }, { unique: true });

// create a model for tags
export const Tag = mongoose.model<ITag>('Tag', TagSchema);