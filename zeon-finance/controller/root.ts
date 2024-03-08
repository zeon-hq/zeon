import { Request, Response } from 'express';
import { getAllCategories } from '../function/category';
import { getAllExpenses } from '../function/expense';
import { getAllTags } from '../function/tags';
import {getAllContacts} from "zeon-core/dist/functions/contact"
import {getAllCompanies} from "zeon-core/dist/functions/company"


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

        // get all contacts
        const contacts = await getAllContacts(workspaceId);
        const contactMap:any = {}
        contacts.forEach((contact:any) => {
            
            contactMap[contact.contactId] = contact.toObject()
            
        })

        // // get all companies
        const companies = await getAllCompanies(workspaceId);
        const companyMap:any = {}
        companies.forEach((company:any) => {
            
            companyMap[company.companyId] = company.toObject()
            
        })

        // get vendor id from expense and get vendor info from contact or companies
        const vendorInfo:any = {}
        expenses.forEach((expense:any) => {
            const id = expense.vendor
            if(contactMap[id]) {
                vendorInfo[id] = contactMap[id]
            } else if(companyMap[id]) {
                vendorInfo[id] = companyMap[id]
            }
        })

        return res.status(200).json({ expenses, categories, tags, vendorInfo });
        
    } catch (error) {
        console.error('Error getting workspace finance:', error);
        return res.status(500).json({ message: error.message || error || 'Internal server error' });
    }
};