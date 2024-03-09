import AIController from "../controller/AIController";
import express, { Router } from "express";
const router: Router = express.Router();

// AI related routes
// upload pdf and injest the data to store in vector's db
router.post('/injest-file', AIController.injestPdf);

router.post('/injest-text', AIController.getInjestPdf);

export default router;