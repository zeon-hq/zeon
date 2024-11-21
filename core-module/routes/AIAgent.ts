import express, { Router } from "express";
import AgentController from "../controller/AgentController"
const router: Router = express.Router();

// AI related routes
router.post('/create', AgentController.createAgent);

router.put('/update/:agentId', AgentController.updateAgent);

router.delete('/delete/:agentId', AgentController.deleteAgent);

router.get('/get/:agentId', AgentController.getAgent);

router.get('/list', AgentController.listAgents);

router.all('/incoming/:agentId', AgentController.incomingCallHandler);

export default router;