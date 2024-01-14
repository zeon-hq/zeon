import express, { Express, Request, Response, Router } from "express"
import { createWorkspaceController, deleteInviteController, deleteWorkspaceController, getAllRolesController, getAllWorkspaceUsersController, getAllWorkspacesController, getWorkspaceByIDController, updateWorkspaceController } from "../controller/workspace"
import { getAllInvites } from "../controller/workspace"
import { getAllCompaniesController } from "../controller/company"
import { getAllContactsController, getCRMDetailsController } from "../controller/contact"


const router: Router = express.Router()

router.get("/", getAllWorkspacesController)
router.get("/:workspaceId", getWorkspaceByIDController)

router.delete("/:workspaceId", deleteWorkspaceController)

router.put("/:workspaceId", updateWorkspaceController)

router.post("/", createWorkspaceController)

router.get("/:workspaceId/users", getAllWorkspaceUsersController)

router.get('/:workspaceId/invites', getAllInvites)

router.delete('/:workspaceId/invite/:inviteId', deleteInviteController)

router.get('/:workspaceId/invites', getAllInvites)

router.get("/:workspaceId/roles", getAllRolesController)

router.get("/:workspaceId/companies", getAllCompaniesController)

router.get("/:workspaceId/contacts", getAllContactsController)
router.get("/:workspaceId/minimal/crmDetails", getCRMDetailsController)

export default router
