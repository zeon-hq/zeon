import express, { Express, Request, Response, Router } from "express"
import User from "../schema/User"
import { generateId, generateJWTToken } from "../utils/utils"
import {
  acceptInvite,
  createInvite,
  createUser,
  deleteUser,
} from "../functions/user"
import { createRole } from "../functions/role"
import {
  createWorkspace,
  getWorkspaceByWorkspaceId,
} from "../functions/workspace"
import Workspace from "../schema/Workspace"
import Role from "../schema/Role"
import Invite, { InviteInterface } from "../schema/Invite"
import { IInviteUserBody, ISignupBody, ZeonModules } from "../types/types"
import UserWorkspace from "../schema/UserWorkspace"
import ForgetPassword from "../schema/ForgetPassword"
import { sendInviteEmail, sendSignupEmail } from "../functions/mailer"
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

/**
 * The `signup` function is an asynchronous function that handles the signup process for a user,
 * including creating a new workspace, role, and user, and generating a JWT token.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made by the
 * client. It contains information such as the request headers, request body, request method, request
 * URL, and other relevant details.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the status code,
 * headers, and send the response body. In this code snippet, it is used to send JSON responses with
 * status codes and error
 * @returns a response with a status code of 200 and a JSON object containing the generated token.
 */

export const newSignup = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body

    // check if email, password and name are present
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password and name are required" })
    }

    // check if user with same email exists
    const userWithSameEmail = await User.findOne({ email })

    // If user exists, return an error
    if (userWithSameEmail) {
      return res.status(400).json({ error: "User already exists" })
    }

    // create user
    const user = await createUser({
      name,
      email,
      password,
      phone,
    })

    if (!user) {
      return res
        .status(400)
        .json({ error: "Error while creating user. Try again" })
    }

    const invites = await Invite.find({
      email: req.body.email,
      isAccepted: false,
      isRejected: false,
      isDeleted: false,
    })

    // accept each invite
    const promises = invites.map(async (invite) => {
      return acceptInvite({
        inviteId: invite.inviteId,
        isAccepted: true,
      })
    })

    await Promise.all(promises)

    // Generate a JWT token that expires in 1 day
    const token = generateJWTToken({
      userId: user.userId,
      email: user.email,
      name: user.name,
    })

    // check if user.name can be split into first name and last name
    let firstName = ""
    let lastName = ""
    if (user.name) {
      const nameArray = user.name.split(" ")
      firstName = nameArray[0]
      // check if nameArray has more than 1 element
      if (nameArray.length > 1) lastName = nameArray[1]
    }

    // send email to user
    const body: ISignupBody = {
      email: user.email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
      },
      emailBlacklisted: false,
      smsBlacklisted: false,
      listIds: [7],
      updateEnabled: false,
    }

    await sendSignupEmail(body)

    // Return the token to the client
    return res.status(200).json({ at: token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}

/**
 * The login function checks if a user exists, verifies their password, and generates a JWT token if
 * successful.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, URL, and body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the status code,
 * headers, and send the response body. In this code snippet, it is used to send JSON responses with
 * error messages when certain
 * @returns In the provided code, if the user does not exist, an error response with status code 400
 * and a message "User does not exist" is returned. If the password is incorrect, an error response
 * with status code 400 and a message "Password is incorrect" is returned. If neither of these
 * conditions are met, a JWT token is generated. However, the code does not specify what should
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // check if email and password are present
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Check if user exists
    const user = await User.findOne({ email: email })

    // If user does not exist, return an error
    if (!user) {
      return res.status(400).json({ error: "Email and password doesn't match" })
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    // If password is incorrect, return an error
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Email and password doesn't match" })
    }

    // Generate a JWT token that expires in 1 day
    const token = generateJWTToken({
      userId: user.userId,
      email: user.email,
      name: user.name,
    })

    // Return the token to the client
    res.status(200).json({ at: token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
}

export const createUserController = async (req: Request, res: Response) => {
  const { name, email, password, roleId = "chatAgent", workspaceId } = req.body

  // check if name, email, password and workspaceId are present
  if (!name || !email || !password || !workspaceId) {
    return res
      .status(400)
      .json({ error: "Name, email, password and workspaceId are required" })
  }

  try {
    const user = await createUser({
      name,
      email,
      password,
      roleId,
      workspaceId,
    })

    res.status(200).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

export const createUserInvite = async (req: Request, res: Response) => {
  const user = req.user
  const { email, workspaceId, roleId = "chatAgent" } = req.body

  // check if email and workspaceId are present
  if (!email || !workspaceId) {
    return res.status(400).json({ error: "Email and workspaceId are required" })
  }

  const workspace = await getWorkspaceByWorkspaceId(workspaceId)

  try {
    const invite = await createInvite({
      email,
      workspaceId,
      roleId,
    })

    // body
    const body: IInviteUserBody = {
      templateId: 25,
      to: [
        {
          email: email,
        },
      ],
      params: {
        inviter: user.name,
        workspacename: workspace.workspaceName,
        invitelink: `https://dev.zeonhq.com`,
      },
    }

    await sendInviteEmail(body)

    res.status(200).json({ invite })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

export const createBulkUserInvite = async (req: Request, res: Response) => {
  const { invites } = req.body
  const user = req.user

  // check if invites are present
  if (!invites) {
    return res.status(400).json({ error: "Invites are required" })
  }

  try {
    const promises = invites.map(async (invite: InviteInterface) => {
      return createInvite({
        email: invite.email,
        workspaceId: invite.workspaceId,
        roleId: invite.roleId,
      })
        .then(async (invite) => {
          const workspace = await getWorkspaceByWorkspaceId(invite.workspaceId)

          // send invite email
          // body
          const body: IInviteUserBody = {
            templateId: 25,
            to: [
              {
                email: invite.email,
              },
            ],
            params: {
              inviter: user.name,
              workspacename: workspace.workspaceName,
              invitelink: `https://dev.zeonhq.com`,
            },
          }

          await sendInviteEmail(body)
        })
        .catch((error) => {
          console.error(error)
          return res.status(500).json({ error })
        })
    })

    const invitesCreated = await Promise.all(promises)

    res.status(200).json({ invitesCreated })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

export const changeInviteStatus = async (req: Request, res: Response) => {
  try {
    const { inviteId, isAccepted } = req.body

    // check if inviteId and isAccepted are present
    if (!inviteId || isAccepted === undefined) {
      return res
        .status(400)
        .json({ error: "inviteId and isAccepted are required" })
    }

    const invite = await acceptInvite({
      inviteId,
      isAccepted,
    })

    if (isAccepted) {
      // // Get user with userId
      const user = await User.findOne({ email: invite.email, isDeleted: false  })
      // // check if user exists
      if (!user) {
        return res.status(400).json({ error: "User does not exist" })
      }

      // const newUser = new User({
      //   userId: user.userId,
      //   name: user.name,
      //   email: user.email,
      //   password: user.password,
      //   roleId: invite.roleId,
      //   workspaceId: invite.workspaceId,
      // })

      // // save the user
      // await newUser.save()
      console.log(`User - ${user.userId} created from invite - ${inviteId}`)
    }

    creturn res.status(200).json({ invite })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

export const getAllInvites = async (req: Request, res: Response) => {
  try {
    const user = req.user
    if (!user) return res.status(400).json({ error: "User not found" })
    const invites = await Invite.find({
      email: user.email,
      isAccepted: false,
      isRejected: false,
      isDeleted: false,
    })

    // populate workspaceName and roleName
    const promises = invites.map(async (invite: any) => {
      const workspace = await Workspace.findOne({
        workspaceId: invite.workspaceId,
      })
      const role = await Role.findOne({ roleId: invite.roleId })
      return {
        ...invite.toObject(),
        workspace: workspace,
        roleName: role?.name,
      }
    })

    const results = await Promise.all(promises)

    return res.status(200).json({ invites: results })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { userId, workspaceId } = req.params

    // check if userId and workspaceId are present
    if (!userId || !workspaceId) {
      return res
        .status(400)
        .json({ error: "userId and workspaceId are required" })
    }

    const user = await deleteUser({ userId, workspaceId })
    return res.status(200).json({ user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

export const editUserController = async (req: Request, res: Response) => {
  try {
    const { userId, workspaceId } = req.params

    // check if userId and workspaceId are present
    if (!userId) {
      return res
        .status(400)
        .json({ error: "userId and workspaceId are required" })
    }

    const { name, roleId, phone, email, profilePic } = req.body

    if (!userId) return res.status(400).json({ error: "User not found" })

    const user = await User.findOne({ userId })

    const userWorkspace = await UserWorkspace.findOne({ userId, workspaceId })

    // check if user exists
    if (!user) {
      return res.status(400).json({ error: "User does not exist" })
    }

    // check if userWorkspace exists
    if (!userWorkspace) {
      return res
        .status(400)
        .json({ error: "This user does not exist in this workspace" })
    }

    if (name) {
      user.name = name
    }

    if (roleId) {
      userWorkspace.roleId = roleId
    }

    if (phone) {
      user.phone = phone
    }

    if (email) {
      // check if email already exists
      const userWithEmailAlreadyExists = await User.findOne({
        email: { $eq: email }, // Match the email
        userId: { $ne: userId }, // Exclude the user with the specified userId
      })
      if (userWithEmailAlreadyExists) {
        return res
          .status(400)
          .json({
            error:
              "Email Address is already taken, please change your email address",
          })
      }
      user.email = email
    }

    if (profilePic) {
      user.profilePic = profilePic
    }

    const userDetails = await user.save()

    let workspaceInfo = await getWorkspaceByWorkspaceId(workspaceId)

    workspaceInfo = {
      ...workspaceInfo,
      ...userWorkspace.toObject(),
    }

    const userInfo = {
      ...userDetails.toObject(),
      workspace: workspaceInfo,
    }

    return res.status(200).json({ user: userInfo })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

export const getUserController = async (req: Request, res: Response) => {
  try {
    const user = req.user
    if (!user) return res.status(400).json({ error: "User not found" })
    const userId = user.userId
    const { workspaceId } = req.params

    // check  and workspaceId are present

    if (!userId) return res.status(400).json({ error: "User not found" })

    const thisUser = await User.findOne({ userId }).select("-password")

    // check if user exists
    if (!thisUser) {
      return res.status(400).json({ error: "User does not exist" })
    }

    // check userWorkspace exists
    const userWorkspaceRelation = await UserWorkspace.findOne({
      userId,
      workspaceId,
    })

    if (!userWorkspaceRelation) {
      return res
        .status(400)
        .json({ error: "User does not exist in this workspace" })
    }
    let workspaceInfo = await getWorkspaceByWorkspaceId(workspaceId)
    workspaceInfo = {
      ...workspaceInfo,
      ...userWorkspaceRelation.toObject(),
    }

    const userInfo = {
      ...thisUser.toObject(),
      workspace: workspaceInfo,
    }

    return res.status(200).json({ user: userInfo })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

export const forgetPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    // check if email is present
    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    // generate a random token
    const token = generateId(18)

    // set expiry date to 1 day from now
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 1)

    // check if user exists
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ error: "User does not exist" })
    }

    // create or update a entry in forgot_password collection
    const forgetPassword = await ForgetPassword.updateOne(
      { email },
      { email, token, expiresAt },
      { upsert: true }
    )
    console.log(
      `>>>>> token generated for user with email ${email} is ${token} <<<<<<< `
    )

    return res.status(200).json({ message: "Token generated successfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const resetPasswordController = async (req: Request, res: Response) => {
  const { token, password, email } = req.body

  try {
    // check if token, password and email are present
    if (!token || !password || !email) {
      return res
        .status(400)
        .json({ error: "Token, password and email are required" })
    }

    // check if user exists
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ error: "User does not exist" })
    }

    // check if token exists

    const forgetPassword = await ForgetPassword.findOne({ email, token })

    if (!forgetPassword) {
      return res.status(400).json({ error: "Token is invalid" })
    }

    // check if token is expired

    const now = new Date()
    if (now > forgetPassword.expiresAt) {
      return res.status(400).json({ error: "Token is expired" })
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10)

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt)

    // update user password
    user.password = hashedPassword

    await user.save()

    return res.status(200).json({ message: "Password updated successfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}
