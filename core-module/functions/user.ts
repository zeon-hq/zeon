import UserWorkspace from "../schema/UserWorkspace"
import Invite from "../schema/Invite"
import User, { UserInterface } from "../schema/User"
import Workspace, { WorkspaceInterface } from "../schema/Workspace"
import {
  CreateUserDTO,
  ZeonError,
  AcceptInviteDTO,
  CreateInviteDTO,
  UserWorkspaceRelationDTO,
} from "../types/types"
import { generateId } from "../utils/utils"
import bcrypt from "bcrypt"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { getWorkspaceByWorkspaceId } from "./workspace"

/**
 * The function `createUser` creates a new user with the provided parameters and saves it to the
 * database, performing necessary validations and hashing the password.
 * @param {CreateUserDTO} params - The `params` parameter is an object that contains the following
 * properties:
 * @returns a Promise that resolves to a UserInterface object.
 */
export const createUser = async (
  params: CreateUserDTO
): Promise<UserInterface> => {
  try {
    const { name, email,phone, password, roleId = "chatAgent", workspaceId } = params

    // check if name, email and password are provided
    if (!name || !email || !password) {
      throw {
        code: 500,
        message: "Name, email and password are required",
        error: "Name, email and password are required",
      }
    }

    // Check with user with the same email exists
    const userWithSameEmail = await User.findOne({
      email: email,
      isDeleted: false,
    })

    // If user with the same email exists, return an error
    if (userWithSameEmail) {
      throw {
        code: 500,
        message: "User with the same email already exists",
        error: "User with the same email already exists",
      }
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10)

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt)

    // create a userId
    const userId = generateId(6)

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      userId: userId,
      phone
    })

    // create user workspace relation
    if (workspaceId) {
      await createUserWorkspaceRelation({
        userId: userId,
        workspaceId,
        roleId,
        isActive: true,
        isDeleted: false,
      })
    }

    // Save the user to the database
    await user.save()

    return user
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export function Authorize(permission: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      // If the user has the required permission, call the original method
      // return originalMethod.apply(this, args);
    }

    return descriptor
  }
}

export const verifyIdentity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" })
  }
  try {
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(
      token,
      "acnasjcnasjcnejfn3r823923r900239funcajsc"
    ) as {
      userId: string
    }
    // check if jwt.verify returns a valid userId
    if (!decoded.userId) {
      return res.status(400).json({ error: "Invalid token" })
    }
    const user = await User.findOne({ userId: decoded.userId })
    if (!user) {
      return res.status(400).json({ error: "User not found" })
    }
    // @ts-ignore
    req.user = user as UserInterface
  } catch (error) {
    console.error(error)
    return res.status(401).json({ error: error.message })
  }

  next()
}

export const createInvite = async (params: CreateInviteDTO) => {
  try {
    const { email, workspaceId, roleId } = params

    const sameInvite = await Invite.findOne({
      email: email,
      workspaceId: workspaceId,
    })

    // If invite with the same email exists, return an error
    if (sameInvite) {
      throw {
        code: 500,
        message: "Invite with the same email already exists",
        error: "Invite with the same email already exists",
      }
    }

    // Check if user with the same email exists
    const userWithSameEmail = await User.findOne({
      email: email,
      isDeleted: false,
    })

    // If user with the same email exists, return an error
    // if (userWithSameEmail) {
    //   throw {
    //     code: 500,
    //     message: "User with the same email already exists",
    //     error: "User with the same email already exists",
    //   }
    // }

    // Check if workspaceId and roleId are valid
    if (!workspaceId || !roleId) {
      throw {
        code: 500,
        message: "WorkspaceId and roleId are required",
        error: "WorkspaceId and roleId are required",
      }
    }

    // Create a Invite
    const invite = new Invite({
      email,
      workspaceId,
      roleId,
      inviteId: generateId(6),
    })

    // Save the invite to the database
    await invite.save()

    return invite
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const deleteInvite = async (params: { inviteId: string }) => {
  try {
    const { inviteId } = params

    // check if inviteId is provided
    if (!inviteId) {
      throw {
        code: 500,
        message: "InviteId is required",
        error: "InviteId is required",
      }
    }

    // check if inviteId is valid
    const invite = await Invite.findOne({ inviteId: inviteId, isDeleted: false })

    // If inviteId is invalid, return an error
    if (!invite) {
      throw {
        code: 500,
        message: "InviteId is invalid",
        error: "InviteId is invalid",
      }
    }

    // delete the invite
    await Invite.updateOne({ inviteId: inviteId }, { isDeleted: true })

    return invite
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

// controller to be called whe  user accepts or rejects the invite
export const acceptInvite = async (params: AcceptInviteDTO) => {
  try {
    const { inviteId, isAccepted } = params

    // check if inviteId is provided
    if (!inviteId) {
      throw {
        code: 500,
        message: "InviteId is required",
        error: "InviteId is required",
      }
    }

    // check if inviteId is valid
    const invite = await Invite.findOne({ inviteId: inviteId, isDeleted: false })

    // If inviteId is invalid, return an error
    if (!invite) {
      throw {
        code: 500,
        message: "InviteId is invalid",
        error: "InviteId is invalid",
      }
    }

    // check if invite is already accepted
    if (invite.isAccepted) {
      throw {
        code: 500,
        message: "Invite is already accepted",
        error: "Invite is already accepted",
      }
    }

    // check if invite is already rejected
    if (invite.isRejected) {
      throw {
        code: 500,
        message: "Invite is already rejected",
        error: "Invite is already rejected",
      }
    }

    // if invite is accepted make isAccepted true
    if (isAccepted) {
      invite.isAccepted = true
      // get email
      const email = invite.email

      // get user with the same email
      const user = await User.findOne({ email: email })

      // create an entry in userWorkspace
      const userWorkspace = await createUserWorkspaceRelation({
        userId: user.userId,
        workspaceId: invite.workspaceId,
        roleId: invite.roleId,
        isActive: true,
        isDeleted: false,
      })

      await invite.save()
      console.log(`Invite - ${inviteId} accepted by ${email}`)
    }

    // if invite is rejected make isRejected true
    if (!isAccepted) {
      invite.isRejected = true
      await invite.save()
      console.log(`Invite - ${inviteId} rejected`)
    }

    return invite
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const getInviteByInviteId = async (params: { inviteId: string }) => {
  try {
    const { inviteId } = params

    // check if inviteId is provided
    if (!inviteId) {
      throw {
        code: 500,
        message: "InviteId is required",
        error: "InviteId is required",
      }
    }

    // check if inviteId is valid
    const invite = await Invite.findOne({ inviteId: inviteId, isDeleted: false })

    // If inviteId is invalid, return an error
    if (!invite) {
      throw {
        code: 500,
        message: "InviteId is invalid",
        error: "InviteId is invalid",
      }
    }

    return invite
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const deleteUser = async (params: {
  userId: string
  workspaceId: string
}) => {
  try {
    const { userId, workspaceId } = params
    // check if userId is provided
    if (!userId) {
      throw {
        code: 500,
        message: "userId is required",
        error: "userId is required",
      }
    }

    // check if userId is valid
    const user = await User.findOne({ userId: userId })

    // If userId is invalid, return an error
    if (!user) {
      throw {
        code: 500,
        message: "userId is invalid",
        error: "userId is invalid",
      }
    }

    // check if userWorkspace is valid
    const userWorkspace = await UserWorkspace.findOne({
      userId: userId,
      workspaceId: workspaceId,
    })

    // If userWorkspace is invalid, return an error
    if (!userWorkspace) {
      throw {
        code: 500,
        message: "userWorkspace is invalid",
        error: "userWorkspace is invalid",
      }
    }

    // delete the user
    await UserWorkspace.updateOne(
      { userId: userId, workspaceId },
      { isDeleted: true }
    )

    return user
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const getAllUsers = async (params: { workspaceId: string }) => {
  try {
    const { workspaceId } = params
    // check if workspaceId is provided
    if (!workspaceId) {
      throw {
        code: 500,
        message: "workspaceId is required",
        error: "workspaceId is required",
      }
    }

    // check if workspaceId is valid
    const workspace = Workspace.findOne({ workspaceId: workspaceId })

    // If workspaceId is invalid, return an error
    if (!workspace) {
      throw {
        code: 500,
        message: "workspaceId is invalid",
        error: "workspaceId is invalid",
      }
    }

    // // get all users in the workspace. user.workspace is an array of workspaceIds
    // const users = await User.find({
    //   workspaceId: workspaceId,
    //   isDeleted: false,
    //   isActive: true,
    // })
    const userWorkspaceRelation = await UserWorkspace.find({
      workspaceId: workspaceId,
      isDeleted: false,
      isActive: true
    })

    const userIds = userWorkspaceRelation.map((userWorkspaceRelation:any) => {
      return {userId: userWorkspaceRelation.userId, roleId: userWorkspaceRelation.roleId}
    })

    // fetch all users and add their roleIds
    const promises = userIds.map(async (userId:any) => {
      const userInfo = await User.findOne({ userId: userId.userId }).select("-password")
      return {
        ...userInfo.toObject(),
        roleId: userId.roleId
      }
    })

    const users = await Promise.all(promises)

    return users
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const getUserByUserId = async (params: { userId: string }) => {
  try {
    const { userId } = params
    // check if userId is provided
    if (!userId) {
      throw {
        code: 500,
        message: "userId is required",
        error: "userId is required",
      }
    }

    // check if userId is valid
    const user = await User.findOne({ userId: userId, isDeleted: false })

    // If userId is invalid, return an error
    if (!user) {
      throw {
        code: 500,
        message: "userId is invalid",
        error: "userId is invalid",
      }
    }

    // get all workspaces from userWorkspace relation
    const userWorkspace = await UserWorkspace.find({
      userId: userId,
      isDeleted: false,
    })

    // get all workspaceIds
    const workspaceIds = userWorkspace.map(
      (userWorkspace:any) => userWorkspace.workspaceId
    )

    // get all workspaces
    const promises = workspaceIds.map(async (workspaceId:any) => {
      return getWorkspaceByWorkspaceId(workspaceId)

    })

    const workspaces = await Promise.all(promises)

    // add workspaces to user
    const userInfo = {
      ...user.toObject(),
      workspaces,
    }

    return userInfo
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const getUser = async (params: {
  userId: string
  workspaceId: string
}) => {
  try {
    const { userId, workspaceId } = params
    // check if userId is provided
    if (!userId) {
      throw {
        code: 500,
        message: "userId is required",
        error: "userId is required",
      }
    }

    // check if workspaceId is provided
    if (!workspaceId) {
      throw {
        code: 500,
        message: "workspaceId is required",
        error: "workspaceId is required",
      }
    }

    // get user
    const user = await User.findOne({ userId: userId, isDeleted: false })

    // get user workspace
    const userWorkspace = await UserWorkspace.findOne({
      userId: userId,
      workspaceId: workspaceId,
      isDeleted: false,
    })

    // If userId is invalid, return an error
    if (!user) {
      throw {
        code: 500,
        message: "userId is invalid",
        error: "userId is invalid",
      }
    }

    // If workspaceId is invalid, return an error
    if (!userWorkspace) {
      throw {
        code: 500,
        message: "User and Workspace are not linked",
        error: "User and Workspace are not linked",
      }
    }

    const userInfo = {
      ...user.toObject(),
      ...userWorkspace.toObject(),
    }

    return userInfo
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const createUserWithUserIdAndWorkspaceId = async (params: {
  userId: string
  workspaceId: string
  role?: string
}) => {
  try {
    const { userId, workspaceId, role = "chatAgent" } = params
    // check if userId is provided
    if (!userId) {
      throw {
        code: 500,
        message: "userId is required",
        error: "userId is required",
      }
    }

    // check if workspaceId is provided
    if (!workspaceId) {
      throw {
        code: 500,
        message: "workspaceId is required",
        error: "workspaceId is required",
      }
    }

    // check if userId is valid
    const user = await User.findOne({ userId: userId, isDeleted: false })

    // If userId is invalid, return an error
    if (!user) {
      throw {
        code: 500,
        message: "userId is invalid",
        error: "userId is invalid",
      }
    }

    // check if workspaceId is valid
    const workspace = await Workspace.findOne({
      workspaceId: workspaceId,
      isDeleted: false,
    })

    // If workspaceId is invalid, return an error
    if (!workspace) {
      throw {
        code: 500,
        message: "workspaceId is invalid",
        error: "workspaceId is invalid",
      }
    }

    // create a new user workspace
    const newUserWorkspace = new UserWorkspace({
      userId: userId,
      workspaceId: workspaceId,
      roleId: role,
      isActive: true,
      isDeleted: false,
    })

    // save the user
    await newUserWorkspace.save()
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const createUserWorkspaceRelation = async (
  params: UserWorkspaceRelationDTO
) => {
  try {
    const { userId, workspaceId, roleId, isActive, isDeleted } = params
    // check if userId is provided
    if (!userId) {
      throw {
        code: 500,
        message: "userId is required",
        error: "userId is required",
      }
    }

    // check if workspaceId is provided
    if (!workspaceId) {
      throw {
        code: 500,
        message: "workspaceId is required",
        error: "workspaceId is required",
      }
    }

    // check if userId is valid
    const user = await User.findOne({ userId: userId, isDeleted: false })

    // If userId is invalid, return an error
    if (!user) {
      throw {
        code: 500,
        message: "userId is invalid",
        error: "userId is invalid",
      }
    }

    // check if workspaceId is valid
    const workspace = await Workspace.findOne({
      workspaceId: workspaceId,
      isDeleted: false,
    })

    // If workspaceId is invalid, return an error
    if (!workspace) {
      throw {
        code: 500,
        message: "workspaceId is invalid",
        error: "workspaceId is invalid",
      }
    }

    // create a new user workspace
    const newUserWorkspace = new UserWorkspace({
      userId: userId,
      workspaceId: workspaceId,
      roleId: roleId,
      isActive: isActive,
      isDeleted: isDeleted,
    })

    // save the user
    await newUserWorkspace.save()

    return newUserWorkspace
  } catch (error) {
    console.error(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}
