import { ICreateCategoryResponse } from "../types/common";
import { Category } from "../schema/categories";

export const getAllCategories = async({ workspaceId }: { workspaceId: string }) => {
  try {
    // check if workspaceId is present
    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }

    let categoriesDoc = await Category.find({
      workspaceId,
      isDeleted: false,
    }).exec();
    let categories = categoriesDoc.map((category) => category.toObject());

    // loop through categories and put child categories in parent category
    const parentCategories = categories.filter(
      (category) => category.parentCategory === "root"
    );
    const response: ICreateCategoryResponse[] = [];
    const childCategories = categories.filter(
      (category) => category.parentCategory !== "root"
    );
    for (let i = 0; i < parentCategories.length; i++) {
      const parentCategory = parentCategories[i];
      const childCategory = childCategories.filter(
        (category) => category.parentCategory === parentCategory.categoryId
      );
      const categoryResponse: ICreateCategoryResponse = {
        ...parentCategory,
        childCategories: childCategory,
      };
      response.push(categoryResponse);
    }

    return response;

    // get all categories from the database
  } catch (error) {
    console.error(`Error getting all categories`, error);
    throw error;
  }
};
