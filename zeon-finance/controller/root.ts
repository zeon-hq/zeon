import { Request, Response } from 'express';
import { getAllCategories } from '../function/category';
import { getAllExpenses } from '../function/expense';
import { getAllTags } from '../function/tags';

export const getFinanceWorkspaceInfo = async (req: Request, res: Response) => {
    try {
        const workspaceId = req.params.workspaceId;

        if(!workspaceId) return res.status(400).json({ message: 'Workspace ID is required' });
        // get all expense from a workspace
        const expenses = await getAllExpenses({ workspaceId });
        // get all category from a workspace
        const categories = await getAllCategories({ workspaceId });
        // get all tags
        const tags = await getAllTags({ workspaceId });

        return res.status(200).json({ expenses, categories, tags });
        
    } catch (error) {
        console.error('Error getting workspace finance:', error);
        return res.status(500).json({ message: error.message || error || 'Internal server error' });
    }
};