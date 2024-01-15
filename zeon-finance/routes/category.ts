import { createCategory,getCategoryById,updateCategory, deletedCategory, getAllCategoriesController, bulkUploadCategory } from "../controller/category"

import express from "express"
import { Request, Response } from "express";


// create routed for CRUD on category
const router = express.Router();

// Get all category
router.get('/:workspaceId', getAllCategoriesController);

// Get an expense by ID
router.get('/:categoryId', getCategoryById);

// Create a new expense
router.post('/', createCategory);

router.post('/bulk', bulkUploadCategory);

// Update an expense by ID
router.put('/:categoryId', updateCategory);

// Delete an expense by ID
router.delete('/:categoryId', deletedCategory);

export default router;
