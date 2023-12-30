import express, { Router } from "express"
import {
    createCompanyController,
    getAllCompaniesController,
    getCompanyController,
    editCompanyController,
    deleteCompanyController,
    bulkDeleteCompanyController
} from "../controller/company"


const router: Router = express.Router()


// get company by companyId
router.get("/:companyId", getCompanyController)

// create company
router.post("/", createCompanyController)

// edit company by companyId
router.put("/", editCompanyController)

// delete company by companyId
router.delete("/:companyId", deleteCompanyController)

// Bulk delete company by companyIs
router.delete("/", bulkDeleteCompanyController)



export default router
