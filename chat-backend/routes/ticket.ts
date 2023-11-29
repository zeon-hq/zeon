import express, { Express, Request, Response, Router } from 'express';
import { getAllTickets, getTicketAnalytics, updateAssignedUser } from '../controller/ticket/ticket.controller';
import { verifyIdentity } from 'zeon-core/dist/func'

const router: Router = express.Router()


router.get("/analytics/:workspaceId", verifyIdentity, getTicketAnalytics);
router.get("/messages/:workspaceId", verifyIdentity, getAllTickets);

router.post("/assign", verifyIdentity, updateAssignedUser);



module.exports = router;