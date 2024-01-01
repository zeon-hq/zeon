import express, { Router } from "express"
import {
    createContactController,
    getContactController,
    updateContactController,
    deleteContactController
} from "../controller/contact"


const router: Router = express.Router()

// get company by companyId
router.get("/:contactId", getContactController)

// create company
router.post("/", createContactController)

// edit company by companyId
router.put("/:contactId", updateContactController)

// delete company by companyId
router.delete("/:contactId", deleteContactController)




export default router
