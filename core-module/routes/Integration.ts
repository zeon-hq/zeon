import TwilioController from "../controller/TwilioController";
import express, { Router } from "express";
const router: Router = express.Router();

// AI related routes
router.post("/twilio", TwilioController.addTwilioIntegration);

export default router;
