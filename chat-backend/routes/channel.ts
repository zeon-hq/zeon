import express, { Express, Request, Response, Router } from 'express';
import { createChannel,updateChannelInfo,getChannel, createCanned,getUserFromChannel, updatedCannedResponse, getAllCannedResponsedFromChannel, deleteCannedResponse, addUserIdsToChannel, removeUserIdsFromChannel } from '../controller/channel/channel.controller';
import { verifyIdentity } from 'zeon-core/dist/func'

const router: Router = express.Router()


router.post("/",verifyIdentity, createChannel)
router.put("/:channelId", verifyIdentity, updateChannelInfo)
router.get("/:channelId",verifyIdentity, getChannel)
router.post("/slack/oauth", createChannel)
router.post("/canned",verifyIdentity, createCanned)
router.delete("/canned/:cannedId",verifyIdentity,deleteCannedResponse)
router.post("/canned/update",verifyIdentity, updatedCannedResponse)
router.get("/canned/:channelId",verifyIdentity, getAllCannedResponsedFromChannel)
router.get("/user/:channelId", getUserFromChannel)
router.post("/addUser",verifyIdentity, addUserIdsToChannel)
router.post("/removeUser",verifyIdentity, removeUserIdsFromChannel)

module.exports = router;