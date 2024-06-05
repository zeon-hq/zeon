import { Response } from "express"
import { SessionRequest } from "supertokens-node/framework/express"
import { Message } from "../../schema/message"
import { Ticket } from "../../schema/ticket"
import { getUser } from "zeon-core/dist/func"
import {Logger} from "zeon-core/dist/index"
import {ZeonServices} from "zeon-core/dist/types/types"


const logger = new Logger(ZeonServices.CHAT)

export const getAllTickets = async (req: SessionRequest, res: Response) => {
  const { workspaceId } = req.params

  try {
    let tickets = await Ticket.find({ workspaceId: workspaceId })
    let messages = await Message.find({ workspaceId: workspaceId })

    for (let ticket of tickets) {
      const msgs = messages.filter((msg) => msg?.ticketId === ticket.ticketId)
      ticket.messages = msgs
      if (ticket.assignedUser) {
        const userId = ticket.assignedUser
        const _user = await getUser({ userId, workspaceId })
        ticket.assignedUserInfo = _user
      } else {
        ticket.assignedUserInfo = null
      }
    }
    return res.status(200).json({ tickets })
  } catch (error) {
    console.log(error)
    logger.error({
      message: "Error in getting all tickets",
      error,
    })
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}

export const searchTicket = async (req: SessionRequest, res: Response) => {
  const { searchTerm, workspaceId } = req.body

  try {
    const searchResults = await Ticket.find({
      $or: [
        { customerEmail: searchTerm },
        { ticketId: searchTerm },
        { workspaceId: workspaceId },
      ],
    }).exec()

    return res.status(200).json({ results: searchResults })
  } catch (error) {
    console.log(error)
    logger.error({
      message: "Error in searching ticket",
      error,
    })
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}

export const updateAssignedUser = async (
  req: SessionRequest,
  res: Response
) => {
  const { ticketId, userId, unassign } = req.body

  try {
    const ticket = await Ticket.findOne({ ticketId })
    if (!ticket) return res.status(404).json({ message: "Ticket not found" })
    const workspaceId = ticket.workspaceId
    const user = await getUser({ userId, workspaceId })

    if (!user) return res.status(404).json({ message: "User not found" })

    if (unassign) {
      return res
        .status(200)
        .json({ message: "Assigned user updated", assignedUserInfo: null })
    }
    return res
      .status(200)
      .json({ message: "Assigned user updated", assignedUserInfo: user })
  } catch (error) {
    console.log(error)
    logger.error({
      message: "Error in updating assigned user",
      error,
    })
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}
