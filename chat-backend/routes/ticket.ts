import express, { Router } from 'express';
import { verifyIdentity } from 'zeon-core/dist/func';
import { getAllTickets, updateAssignedUser } from '../controller/ticket/ticket.controller';

const router: Router = express.Router()

router.get("/messages/:workspaceId", verifyIdentity, getAllTickets);

router.post("/assign", verifyIdentity, updateAssignedUser);



module.exports = router;