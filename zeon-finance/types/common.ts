import { ICategory } from "schema/categories";

export interface ICreateCategoryDTO {
    categoryId: string;
    name: string;
    description: string;
    parentCategory?: string;
    workspaceId: string;
    childCategories: ICreateCategoryDTO[];
}

export interface ICreateCategoryResponse {
    categoryId: string;
    name: string;
    description: string;
    parentCategory?: string;
    workspaceId: string;
    childCategories: ICategory[];
}