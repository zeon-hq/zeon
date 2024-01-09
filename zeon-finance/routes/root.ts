import { getFinanceWorkspaceInfo } from "../controller/root";
import express from "express"
import { Request, Response } from "express";


// create routed for CRUD on category
const router = express.Router();

// Get all category
router.get('/:workspaceId', getFinanceWorkspaceInfo);


export default router;
