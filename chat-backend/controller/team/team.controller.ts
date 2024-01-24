import dotenv from "dotenv"
import { Request, Response } from "express"
import { IncomingForm } from "formidable"
import fs from "fs"
import https from "https"
import path from "path"
import { SessionRequest } from "supertokens-node/framework/express"
// @ts-ignore
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
import { generateRandomString } from "../../utils/blocks"
import {
  sendEmailOnInvite,
  sendEmailOnSignUp_PersonalHello,
} from "../../utils/notifications"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import multer from "multer"
import { generateId } from "zeon-core/dist/utils/utils"

const secretAccessKey = process.env.SECRET_ACCESS_KEY as string
const accessKeyId = process.env.ACCESS_KEY_ID as string

const s3 = new S3Client({
  credentials: {
    secretAccessKey,
    accessKeyId,
  },
  region: "us-east-1",
})

dotenv.config()

const WEBSITE_URL = process.env.WEBSITE_URL as string

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

export const createTeam = async (req: Request, res: Response) => {
  const user: UserInterface = req.user
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
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}

export const uploadLogo = async (req: SessionRequest, res: Response) => {
  try {
    const form = new IncomingForm({ multiples: true, keepExtensions: true })

    form.parse(req, async (err, fields, files: any) => {
      if (err) {
        res.send(400).json({
          message: "Something went wrong",
        })
      }

      // Data
      // const fileStream = fs.createReadStream(files.file.filepath)

      // const filename = path.basename(files.file.filepath)
      // const extension = path.extname(files.file.filepath)

      // const REGION = "" // If German region, set this to an empty string: ''
      // const BASE_HOSTNAME = "ny.storage.bunnycdn.com"
      // const HOSTNAME = REGION ? `${REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME
      // const STORAGE_ZONE_NAME = "zeon"
      // const FILENAME_TO_UPLOAD = `${generateRandomString(6)}${extension}`
      // const ACCESS_KEY = "df1b1ba6-089f-47fc-b556185b8dfa-dc4b-43ed"

      // const pathDef = `/${STORAGE_ZONE_NAME}/${FILENAME_TO_UPLOAD}`

      // const options = {
      //   method: "PUT",
      //   host: HOSTNAME,
      //   path: pathDef,
      //   headers: {
      //     AccessKey: ACCESS_KEY,
      //     "Content-Type": "application/octet-stream",
      //   },
      // }

      // const req = https.request(options, (apiRes) => {
      //   apiRes.on("data", (chunk) => {
      //     console.log("Uploaded File : --------------", chunk.toString("utf8"))
      //     return res.status(200).json({
      //       message: "Logo uplodaded",
      //       uploadedUrl:
      //         `https://zeonhq.b-cdn.net/${FILENAME_TO_UPLOAD}` || undefined,
      //     })
      //   })
      // })

      // req.on("error", (error) => {
      //   console.error(error)
      // })

      // fileStream.pipe(req)
      const tempId = generateId(10);
      //@ts-ignore
      const fileName = `${req.file.originalname}-${tempId}`;
      const command = new PutObjectCommand({
        Bucket: 'zeon-finance-docs',
        Key: fileName,
        //@ts-ignore
        Body: req.file.buffer,
        //@ts-ignore
        ContentType: req.file.mimetype,
      });
      const savedFile = await s3.send(command);
      const signedURL = await getSignedUrl(s3, command, { expiresIn: 3600 });
      })
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}
