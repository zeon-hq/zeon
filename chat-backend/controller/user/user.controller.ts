import { Request, Response } from "express"
import { Channel } from "../../schema/channel"
import { SessionRequest } from "supertokens-node/framework/express"
import {
  getUserByUserId,
  getUser,
  getWorkspaceByWorkspaceId,
} from "zeon-core/dist/func"

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { userId, workspaceId } = req.params
    if (!userId && !workspaceId) {
      return res.status(400).json({ message: "Invalid request" })
    }

    if (!workspaceId) {
      const user = await getUserByUserId({ userId })
      if (!user) {
        return res.status(400).json({ message: "Invalid request" })
      }

      //@ts-ignore
      const workspaceDetails = user.workspaces || []
      //@ts-ignore
      delete user.workspaces

      return res
        .status(200)
        .json({ message: "User info fetched", user, payload: workspaceDetails })
    }

    const userInfo = await getUser({ userId, workspaceId })

    if (!userInfo) {
      return res.status(400).json({ message: "Invalid request" })
    }

    const workspaceDetails = await getWorkspaceByWorkspaceId(workspaceId)

    const info = { ...userInfo, workspaceDetails }


    return res.status(200).json({
      message: "User info fetched",
      payload: info,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}

export const getUserChannels = async (req: SessionRequest, res: Response) => {
  const { workspaceId } = req.body
  let user = req.user

  try {
    // get all channels of the workspace
    const allChannelsInWorkspace = await Channel.find({ workspaceId })

    // in allChannelsInWorkspace, get the channels in which the user is a member
    let channels: any[] = []
    for (let channel of allChannelsInWorkspace) {
      if (channel.members.includes(user.userId)) {
        channels.push(channel)
      }
    }
    return res.status(200).json({
      message: "Channels fetched",
      workspaces: channels,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}
