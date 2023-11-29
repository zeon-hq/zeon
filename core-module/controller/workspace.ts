import { Request, Response } from 'express';
import User from '../schema/User'
import Workspace from '../schema/Workspace'
import { createWorkspace, deleteWorkspaceByWorkspaceId, getWorkspaceByWorkspaceId } from '../functions/workspace'
import { createUser, createUserWithUserIdAndWorkspaceId, deleteInvite, getAllUsers } from '../functions/user'
import Invite from '../schema/Invite'
import WorkspaceConfig from '../schema/WorkspaceConfig'
import UserWorkspace from '../schema/UserWorkspace'
import { UserWorkspaceInterface } from '../schema/UserWorkspace'
import { getAllRolesForWorkspace } from '../functions/role'

export const getAllWorkspacesController = async (req: Request, res: Response) => {
    try {
        const user = req.user
        if(!user){
            console.log("User not found")
            return res.status(400).json({ error: "User not found" })
        }
        
        // get users
        const users = await User.find({ userId: user.userId })

        const userWorkspace = await UserWorkspace.find({ userId: user.userId, isActive: true, isDeleted: false })
        const workspaceIds = userWorkspace.map((userWorkspace:UserWorkspaceInterface) => userWorkspace.workspaceId)

        const data:any = []
        const workspaces = await Workspace.find({ workspaceId: { $in: workspaceIds }, isDeleted: false })

        

        // add workspaceConfig to workspace
        const promises = workspaces.map(async workspace => {
            const workspaceConfig = await WorkspaceConfig.findOne({ workspaceId: workspace.workspaceId })
            return {
                ...workspace.toObject(),
                workspaceConfig
            }
        })

        const result = await Promise.all(promises)

        res.status(200).json({ workspaces: result })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

export const getWorkspaceByIDController = async (req: Request, res: Response) => {
    try {
        const { workspaceId } = req.params
        const workspace = await getWorkspaceByWorkspaceId(workspaceId)
        if(!workspace){
            console.log("Workspace not found")
            return res.status(400).json({ error: "Workspace not found" })
        }
        res.status(200).json({ workspace })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

export const deleteWorkspaceController = async (req: Request, res: Response) => {
    try {
        const { workspaceId } = req.params
        const workspace = await deleteWorkspaceByWorkspaceId(workspaceId)
        res.status(200).json({ workspace })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

export const updateWorkspaceController = async (req: Request, res: Response) => {
    try {
        const { workspaceId } = req.params

        // check if workspaceId is present
        if(!workspaceId) {
            return res.status(400).json({ error: "WorkspaceId is required" })
        }

        const workspace = await Workspace.findOne({ workspaceId: workspaceId })
        if(!workspace){
            console.log("Workspace not found")
            return res.status(400).json({ error: "Workspace not found" })
        }

        const workspaceConfig = await WorkspaceConfig.findOne({ workspaceId: workspaceId })

        const { workspaceName, primaryContactName, primaryContactEmail, timezone, logo, modules } = req.body

        if(workspaceName){
            workspace.workspaceName = workspaceName
        }

        if(primaryContactName){
            workspace.primaryContactName = primaryContactName
        }

        if(primaryContactEmail){
            workspace.primaryContactEmail = primaryContactEmail
        }

        if(timezone){
            workspaceConfig.timezone = timezone
        }

        if(modules){
            workspace.modules = modules
        }

        if(logo){
            workspaceConfig.logo = logo
        }

        // update workspace
        await workspace.save()

        // update workspace config
        await workspaceConfig.save()

        // add workspaceConfig to workspace
        const data = {
            ...workspace.toObject(),
            workspaceConfig
        }

        res.status(200).json({ workspace:data })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

export const createWorkspaceController = async (req: Request, res: Response) => {
    try {
        const user = req.user
        if(!user){
            console.log("User not found")
            return res.status(400).json({ error: "User not found" })
        }
        const { workspaceName, legalCompanyName, teamSize, industry } = req.body

        // check if workspaceName is present
        if(!workspaceName) {
            return res.status(400).json({ error: "WorkspaceName is required" })
        }

        // create workspace
        const workspace = await createWorkspace({
            workspaceName,
            primaryContactName: user.name,
            primaryContactEmail: user.email,
            signupDetails: {
                signupMode: "email",
                isVerified: false
            },
            modules: req.body.modules,
            legalCompanyName,
            teamSize,
            industry
            
        })

        // add workspace to user
        const currentUser = await User.findOne({ userId: user.userId })
        if(!currentUser){
            console.log("User not found")
            return res.status(400).json({ error: "User not found" })
        }
        
        // create user with user.userId and workspaceId
        const newUser = await createUserWithUserIdAndWorkspaceId({
            userId: user.userId,
            workspaceId: workspace.workspaceId,
            role:"owner"
        })

        res.status(200).json({ workspace })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

export const getAllWorkspaceUsersController = async (req: Request, res: Response) => {
    try {
        const { workspaceId } = req.params
        // check if workspaceId is present
        if(!workspaceId) {
            return res.status(400).json({ error: "WorkspaceId is required" })
        }

        const workspace = await Workspace.findOne({ workspaceId: workspaceId, isDeleted: false })
        if(!workspace){
            console.log("Workspace not found")
            return res.status(400).json({ error: "Workspace not found" })
        }
        const users = await getAllUsers({ workspaceId: workspaceId })
        res.status(200).json({ users })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

export const getAllInvites = async (req: Request, res: Response) => {
    try {
        const { workspaceId } = req.params

        // check if workspaceId is present
        if(!workspaceId) {
            return res.status(400).json({ error: "WorkspaceId is required" })
        }

        const invites = await Invite.find({ workspaceId: workspaceId, isAccepted: false, isRejected: false, isDeleted: false })
        return res.status(200).json({ invites })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error })
    }
}

export const deleteInviteController = async (req: Request, res: Response) => {
    try {
        const { workspaceId, inviteId } = req.params

        // check if workspaceId is present
        if(!workspaceId) {
            return res.status(400).json({ error: "WorkspaceId is required" })
        }

        // check if inviteId is present
        if(!inviteId) {
            return res.status(400).json({ error: "InviteId is required" })
        }

        

       const invite = await deleteInvite({inviteId})

        return res.status(200).json({ invite })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error })
    }
}

export const getAllRolesController = async (req: Request, res: Response) => {
    try {
        const { workspaceId } = req.params
        // check if workspaceId is present
        if(!workspaceId) {
            return res.status(400).json({ error: "WorkspaceId is required" })
        }
        const roles = await getAllRolesForWorkspace(workspaceId)
        res.status(200).json({ roles })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}