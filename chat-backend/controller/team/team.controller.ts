import dotenv from "dotenv"
import { Request, Response } from "express"
import { SessionRequest } from "supertokens-node/framework/express"
import {
  createUserWithUserIdAndWorkspaceId,
  createWorkspace,
  getAllUsers,
  getWorkspaceByWorkspaceId,
} from "zeon-core/dist/func"
import { UserInterface, ZeonModulesArray } from "zeon-core/dist/types"
import { Channel, IChannelsInfo } from "../../schema/channel"
import { Invite } from "../../schema/invite"
import { Team } from "../../schema/team"
import { User } from "../../schema/user"
import {
  sendEmailOnInvite,
  sendEmailOnSignUp_PersonalHello,
} from "../../utils/notifications"
import {Logger} from "zeon-core/dist/index"
import {ZeonServices} from "zeon-core/dist/types/types"


const logger = new Logger(ZeonServices.CHAT)

dotenv.config()

const WEBSITE_URL = process.env.WEBSITE_URL as string


export const createTeam = async (req: Request, res: Response) => {
  const user: UserInterface | any = req.user
  try {
    const workspaceName = req.body.workspaceName
    const modules: ZeonModulesArray = req.body.modules
    // create a workspace
    const workspace = await createWorkspace({
      workspaceName,
      primaryContactEmail: user.email,
      primaryContactName: user.name,
      signupDetails: { signupMode: "api", isVerified: true },
      modules,
    })
    // create a entry in user table with userId and workspaceId
    await createUserWithUserIdAndWorkspaceId({
      userId: user.userId,
      workspaceId: workspace.workspaceId,
      role: "owner",
    })

    await sendEmailOnSignUp_PersonalHello({
      email: user.email,
      firstName: user.name,
      lastName: "",
    })

    return res.status(200).json({
      message: "Workspace created",
      workspace,
    })
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    })
  }
}

export const inviteTeamMember = async (req: SessionRequest, res: Response) => {
  let { email, workspaceId, channelId } = req.body

  const isInviteAlreadySent = await Invite.findOne({
    email: email,
    workspaceId: workspaceId,
    channelId: channelId,
  })

  if (isInviteAlreadySent) {
    return res.status(500).json({
      message: "Invite already sent",
    })
  }

  try {
    const invite = await Invite.create({ email, workspaceId, channelId })

    const checkIfUserExists = await User.findOne({ email })
    if (checkIfUserExists) {
      const team = await Team.findById(workspaceId)
      team.members.push(checkIfUserExists._id)

      const channel = await Channel.findOne({ channelId })
      channel.members.push(checkIfUserExists._id)

      checkIfUserExists.teams.push(workspaceId)
      await checkIfUserExists.save()

      await team.save()
    }

    const inviteId = invite._id.toString()
    // Trigger invite e-mail
    await sendEmailOnInvite({ email })

    return res.send({ inviteId })
  } catch (error) {
    console.log(error)
    logger.error({
      message: "Error in inviting team member",
      error,
    })
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}

export const removeTeamMember = async (req: SessionRequest, res: Response) => {
  let { email, workspaceId } = req.body

  try {
    await Team.updateOne({ _id: workspaceId }, { $pull: { members: email } })
    return res.send({ workspaceId })
  } catch (error) {
    console.log(error)
    logger.error({
      message: "Error in removing team member",
      error,
    })
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}

export const addAdmin = async (req: SessionRequest, res: Response) => {
  let { userId, workspaceId } = req.body

  try {
    await Team.updateOne({ _id: workspaceId }, { $push: { admins: userId } })
    return res.send({ workspaceId })
  } catch (error) {
    console.log(error)
    logger.error({
      message: "Error in adding admin",
      error,
    })
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}

export const changeUserRole = async (req: SessionRequest, res: Response) => {
  let { userId, workspaceId, role } = req.body

  try {
    // if the role is "admin" add user to to team.admins array and remove from team.members array
    if (role === "admin") {
      await Team.updateOne({ _id: workspaceId }, { $push: { admins: userId } })
      await Team.updateOne({ _id: workspaceId }, { $pull: { members: userId } })
    } else if (role === "member") {
      await Team.updateOne({ _id: workspaceId }, { $push: { members: userId } })
      await Team.updateOne({ _id: workspaceId }, { $pull: { admins: userId } })
    }

    return res.status(200).json({
      message: "Role changed",
    })
  } catch (error) {
    console.log(error)
    logger.error({
      message: "Error in changing user role",
      error,
    })
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}

export const removeAdmin = async (req: SessionRequest, res: Response) => {
  let { userId, workspaceId } = req.body

  try {
    await Team.updateOne({ _id: workspaceId }, { $pull: { admins: userId } })
    return res.send({ workspaceId })
  } catch (error) {
    console.log(error)
    logger.error({
      message: "Error in removing admin",
      error,
    })
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}

export const getTeam = async (req: Request, res: Response) => {
  const user = req.user

  const { workspaceId } = req.body

  try {
    const workspace = await getWorkspaceByWorkspaceId(workspaceId)
    res.status(200).json({
      workspace,
    })
  } catch (error) {
    console.log(error)
    logger.error({
      message: "Error in getting team",
      error,
    })
    return res.status(500).json({
      message: "Something went wrong",
      error,
    })
  }
}

export const getTeamData = async (req: SessionRequest, res: Response) => {
  const { workspaceId } = req.params
  try {
    const team = await getWorkspaceByWorkspaceId(workspaceId)
    if (!team) {
      return res.status(500).json({ message: "No team found" })
    }
    //@ts-ignore
    const data: any = team

    // get all the users in workspace
    const allUsers = await getAllUsers({ workspaceId })

    let owners = allUsers.filter((user: any) => user.roleId === "owner")
    let admins = allUsers.filter((user: any) => user.roleId === "admin")
    let users = allUsers.filter(
      (user: any) => user.roleId !== "owner" && user.roleId !== "admin"
    )

    data.owners = owners
    data.admins = admins
    data.users = users
    data.allUsers = allUsers

    // add referral link
    data.referralLink = `${WEBSITE_URL}/signup?referralCode=${team.workspaceId}`

    // add invoices
    data.invoices = []


    let payload: any = {
      ...data,
      channelsInfo: { channels: [] },
    }

    const channels = await Channel.find({ workspaceId })

    channels.forEach((channel: IChannelsInfo) => {
      payload.channelsInfo.channels.push({
        name: channel.name,
        channelId: channel.channelId,
      })
      //@ts-ignore
      const channelInfo = channel.toObject()
      payload.channelsInfo[channel.channelId] = { ...channelInfo }
    })

    return res.status(200).json({
      message: "Team data fetched",
      payload,
    })
  } catch (error) {
    console.log(error)
    logger.error({
      message: "Error in getting team data",
      error,
    })
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}