import express, { Router } from "express"
import { createUserController,createUserInvite, changeInviteStatus, getAllInvites,deleteUserController, editUserController, getUserController, createBulkUserInvite } from "../controller/user"


const router: Router = express.Router()

router.post("/", createUserController)
router.put("/:userId/workspace/:workspaceId", editUserController)
router.post("/invite", createUserInvite)
// bulk user invite
router.post("/invite/bulk", createBulkUserInvite)
router.put("/invite/change", changeInviteStatus)
router.get("/invites", getAllInvites)
router.delete("/:userId/workspace/:workspaceId", deleteUserController)
router.get("/workspace/:workspaceId", getUserController)



export default router
