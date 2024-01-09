import { addNoteController, updateNoteController, deleteNoteController, getNotesController } from "../controller/notes"
import express, { Router } from "express"

const router: Router = express.Router()

// create note
router.post("/", addNoteController)
// edit note
router.put("/", updateNoteController)
// delete note
router.delete("/", deleteNoteController)
// get notes
router.get("/", getNotesController)

export default router