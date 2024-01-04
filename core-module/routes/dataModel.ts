import { createDataModelController, getDataModelController } from "../controller/dataModel"
import express, { Router } from "express"

const router: Router = express.Router()

// create data model
router.post("/", createDataModelController)

// get data model
router.get("/", getDataModelController)
export default router