import express, { Router } from "express";

import { verifyIdentity } from "zeon-core/dist/func";
import {
  addAdmin,
  changeUserRole,
  createTeam,
  getTeam,
  getTeamData,
  inviteTeamMember,
  removeAdmin,
  removeTeamMember,
  uploadLogo
} from "../controller/team/team.controller";

const router: Router = express.Router();

// Team management
router.post("/", verifyIdentity, createTeam);
router.get("/", verifyIdentity, getTeam);
router.put("/invite", verifyIdentity, inviteTeamMember);
router.put("/cancel-invite", verifyIdentity, removeTeamMember);
router.put("/add-admin", verifyIdentity, addAdmin);
router.put("/remove-admin", verifyIdentity, removeAdmin);
router.put("/role", verifyIdentity, changeUserRole)

router.get("/:workspaceId", getTeamData)
// Team assets
router.put("/asset/upload-logo", verifyIdentity, uploadLogo);



module.exports = router;
