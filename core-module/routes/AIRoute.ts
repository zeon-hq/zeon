import AIController from "../controller/AIController";
import express, { Router } from "express";
const router: Router = express.Router();


router.post('/ai/injest-file', AIController.injestPdf);

export default router;