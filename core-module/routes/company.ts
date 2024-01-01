import express, { Router } from "express"
import {
    createCompanyController,
    getCompanyController,
    editCompanyController,
    deleteCompanyController,
    bulkDeleteCompanyController,
    getAllCompaniesValueLabelController
} from "../controller/company"


const router: Router = express.Router()


// get company by companyId
router.get("/:companyId", getCompanyController)

// get company label value pair
router.get("/:workspaceId/all", getAllCompaniesValueLabelController)

// create company
router.post("/", createCompanyController)

// edit company by companyId
router.put("/:companyId", editCompanyController)

// delete company by companyId
router.delete("/:companyId", deleteCompanyController)

// Bulk delete company by companyIs
router.delete("/", bulkDeleteCompanyController)



export default router
