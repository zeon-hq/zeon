import Role, { RoleInterface } from "../schema/Role"
import { CreateRoleDTO } from "../types/types"
import { generateId } from "../utils/utils"

export const createRole = async (params:CreateRoleDTO): Promise<RoleInterface> => {
    try {
        let { name, description, workspaceId, roleId } = params
      
        if(!roleId) {
          // Generate a roleId  
          roleId = generateId(6)
        }
        
    
        // Create a new role
        const role = new Role({
          name,
          description,
          workspaceId: workspaceId,
          roleId: roleId
        })
    
        // Save the role to the database
        await role.save()

        return role
    
      } catch (error) {
        console.error(error)
        throw {
            code: 500,
            message: error,
            error
        }
      }
}

export const getAllRolesForWorkspace = async (workspaceId: string): Promise<RoleInterface[]> => {
  try {
    if(!workspaceId) {
      throw {
        code: 400,
        message: "WorkspaceId is required"
      }
    }

    const roles = await Role.find({ workspaceId: workspaceId })
    return roles
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error
    }
  }
}
