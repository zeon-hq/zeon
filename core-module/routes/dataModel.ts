import { createDataModelController, getDataModelController } from "../controller/dataModel"
import express, { Router } from "express"

const router: Router = express.Router()

// create data model
router.post("/create", createDataModelController)

// get data model
router.post("/", getDataModelController)
export default router