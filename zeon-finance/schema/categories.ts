/**
 * name
 * id
 * description
 * parentCategory
 */
// create a interface for category
// create a schema for category

import mongoose, { Schema } from "mongoose"

export interface ICategory {
    name: string;
    description: string;
    parentCategory: string;
    categoryId: string;
    isDeleted: boolean;
    workspaceId: string;
}

export const CategorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    parentCategory: { type: String, required: true, default:"root" },
    categoryId: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
    workspaceId: { type: String, required: true }
})
// make categoryId and workspaceId unique
CategorySchema.index({ categoryId: 1, workspaceId: 1 }, { unique: true });
// create a model for category
export const Category = mongoose.model<ICategory>('Category', CategorySchema);