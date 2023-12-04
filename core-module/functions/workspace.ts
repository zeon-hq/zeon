import Workspace, { WorkspaceInterface } from "../schema/Workspace"
import WorkspaceConfig from "../schema/WorkspaceConfig"
import { CreateWorkspaceDTO } from "../types/types"
import { generateId } from "../utils/utils"
import { createRole } from "./role"
import mongoose from "mongoose"

export const createWorkspace = async (params: CreateWorkspaceDTO): Promise<WorkspaceInterface> => {
    try {
        const { workspaceName, primaryContactName, primaryContactEmail, signupDetails, modules,legalCompanyName, teamSize, industry } = params

        // check if all the params are present
        if(!workspaceName || !primaryContactEmail || !primaryContactName || !signupDetails || !modules){
            throw {
                code: 400,
                message: "Missing parameters",
                error: "Missing parameters"
            }
        }
    
        // Generate a workspaceId
        const workspaceId = generateId(6)
    
        // Create a new workspace
        const workspace = new Workspace({
          workspaceName,
          primaryContactName,
          primaryContactEmail,
          signupDetails,
          workspaceId: workspaceId,
          modules
        })
    
        // Save the workspace to the database
        await workspace.save()

        // create owner role
        await createRole({
          name: "Owner",
          description: "Owner of the workspace",
          workspaceId: workspace.workspaceId,
          roleId: "owner"
        })

        // create member role
        await createRole({
          name: "Chat Agent",
          description: "Chat Agent of the workspace",
          workspaceId: workspace.workspaceId,
          roleId: "chatAgent"
        })

        // create admin role
        await createRole({
          name: "Admin",
          description: "Admin of the workspace",
          workspaceId: workspace.workspaceId,
          roleId: "admin"
        })

        // create workspace config
        await WorkspaceConfig.create({
          workspaceId: workspace.workspaceId,
          legalCompanyName,
          teamSize,
          industry
        })

        const data = {
          ...workspace.toObject(),
          workspaceConfig: {
            workspaceId: workspace.workspaceId
          }
        }

        return data
    
      } catch (error) {
        console.error(error)
        throw {
            code: 500,
            message: error,
            error
        }
      }
}

export const getWorkspaceByWorkspaceId = async (workspaceId: string): Promise<WorkspaceInterface> => {
  try {
    const workspace = await Workspace.findOne({ workspaceId: workspaceId })

    if(!workspace){
      throw {
        code: 500,
        message: "Workspace not found",
        error: "Workspace not found"
      }
    }

    // check if workspace is deleted
    if(workspace.isDeleted){
      throw {
        code: 500,
        message: "Workspace not found",
        error: "Workspace not found"
      }
    }

    // get workspaceConfig

    const workspaceConfig = await WorkspaceConfig.findOne({ workspaceId: workspaceId })

    const data = {
      ...workspace.toObject(),
      workspaceConfig
    }

    return data
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error
    }
  }
}

export const deleteWorkspaceByWorkspaceId = async (workspaceId: string): Promise<WorkspaceInterface> => {
  try {
    const workspace = await Workspace.findOne({ workspaceId: workspaceId })

    if(!workspace){
      throw {
        code: 500,
        message: "Workspace not found",
        error: "Workspace not found"
      }
    }

    // update isDeleted to true
    workspace.isDeleted = true
    await workspace.save()
    return workspace
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error
    }
  }
}

export const initializeDB = async (): Promise<void> => {
  mongoose
  //@ts-ignore
  .connect(process.env.DB_URI, {dbName: process.env.DB_NAME})
  .then(() => {
    console.log("Connected to DB in core module");
  })
  .catch((e) => {
    console.log(e);
  });
}