import express, { Router } from "express"
import {
    createContactController,
    getContactController,
    updateContactController,
    deleteContactController,
    addNoteToContactController
} from "../controller/contact"


const router: Router = express.Router()

// get company by companyId
router.get("/:contactId", getContactController)

// create company
router.post("/", createContactController)

// edit company by companyId
router.put("/", updateContactController)

// delete company by companyId
router.delete("/:contactId", deleteContactController)

router.put("/:contactId/notes", addNoteToContactController)




export default router
