import { generateId } from "zeon-core/dist/utils/utils"
import { Category, ICategory } from "../schema/categories"
import { Request, Response } from "express" // Add missing import
import { validator } from "../utils/utils"
import { createCategorySchema } from "./validators"
import { ICreateCategoryDTO, ICreateCategoryResponse } from "../types/common"
import { getAllCategories } from "../function/category"

export const createCategory = async (req: Request, res: Response) => {
  try {
    const data: ICreateCategoryDTO = req.body as ICreateCategoryDTO // Cast req.body to ICategory
    validator(createCategorySchema, data) // Validate data
    const categoryId = generateId(10)
    data.categoryId = categoryId
    data.parentCategory = data.parentCategory || "root"
    const category: ICategory = await Category.create(data)

    // check if data.childCategory is present
    if (data.childCategories) {
      // loop through data.childCategory
      for (let i = 0; i < data.childCategories.length; i++) {
        const childCategory = data.childCategories[i]
        // create child category
        if (!childCategory.name)
          return res
            .status(400)
            .json({ message: "Child category name is required" })
        const newChildCategory = await Category.create({
          name: childCategory.name,
          description: childCategory.description,
          workspaceId: data.workspaceId,
          parentCategory: categoryId,
          categoryId: generateId(10),
        })
      }
    }
    return res.status(201).json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    return res
      .status(500)
      .json({ message: error.message || error || "Internal server error" })
  }
}

export const bulkUploadCategory = async (req: Request, res: Response) => {
  try {
    const { workspaceId, categories } = req.body
   
    const categoryPromises = categories.map(async (thisCategory: any) => {
        const categoryId = generateId(10)
        thisCategory.categoryId = categoryId
        thisCategory.parentCategory = thisCategory.parentCategory || "root"
        const category: ICategory = await Category.create({...thisCategory, workspaceId})
      
        // check if data.childCategory is present
        if (thisCategory.childCategories) {
          // loop through data.childCategory
          for (let i = 0; i < thisCategory.childCategories.length; i++) {
            const childCategory = thisCategory.childCategories[i]
            // create child category
            if (!childCategory.name)
              return res
                .status(400)
                .json({ message: "Child category name is required" })
            const newChildCategory = await Category.create({
              name: childCategory.name,
              description: childCategory.description,
              workspaceId: workspaceId,
              parentCategory: categoryId,
              categoryId: generateId(10),
            })
          }
        }
      })
      
      await Promise.all(categoryPromises);
      return res.status(201).json(categories);
  } catch (error) {
    console.error("Error creating category:", error)
  }
}

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId
    if (!categoryId)
      return res.status(400).json({ message: "Category ID is required" })
    const category = await Category.findOne({
      categoryId: categoryId,
      isDeleted: false,
    })
    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }
    return res.status(200).json(category)
  } catch (error) {
    console.error(
      `Error getting category by ID: ${req.params.categoryId}`,
      error
    )
    return res
      .status(500)
      .json({ message: error.message || error || "Internal server error" })
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId
    if (!categoryId)
      return res.status(400).json({ message: "Category ID is required" })
    const data: ICategory = req.body as ICategory
    const category = await Category.findOne({
      categoryId: categoryId,
      isDeleted: false,
    })
    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }
    const updatedCategory = await Category.findOneAndUpdate(
      { categoryId: categoryId },
      { $set: data },
      { new: true }
    )
  } catch (error) {
    console.error(`Error updating category:${req.params.categoryId}`, error)
    return res
      .status(500)
      .json({ message: error.message || error || "Internal server error" })
  }
}

export const deletedCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId
    if (!categoryId)
      return res.status(400).json({ message: "Category ID is required" })
    await Category.findOneAndUpdate(
      { categoryId: categoryId },
      { $set: { isDeleted: true } },
      { new: true }
    )
  } catch (error) {
    console.error(`Error deleting category:${req.params.categoryId}`, error)
    return res
      .status(500)
      .json({ message: error.message || error || "Internal server error" })
  }
}

export const getAllCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const workspaceId = req.params.workspaceId
    const response = await getAllCategories({ workspaceId })

    return res.status(200).json(response)
  } catch (error) {
    console.error("Error getting all categories:", error)
    return res
      .status(500)
      .json({ message: error.message || error || "Internal server error" })
  }
}
