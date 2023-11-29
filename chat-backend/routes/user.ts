import express, { Express, Request, Response, Router } from "express";
import {
  getUserInfo,
  getUserChannels,
} from "../controller/user/user.controller";
import { verifyIdentity } from "zeon-core/dist/func"


const router: Router = express.Router();

router.get("/:userId/workspace/:workspaceId",verifyIdentity, getUserInfo);
router.get("/channels", verifyIdentity, getUserChannels);

module.exports = router;
