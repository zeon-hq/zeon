import { Response } from "express"
import { SessionRequest } from "supertokens-node/framework/express"
import { Message } from "../../schema/message"
import { Ticket } from "../../schema/ticket"
import { getUser } from "zeon-core/dist/func"

export const getTicketAnalytics = async (
  req: SessionRequest,
  res: Response
) => {
  const { workspaceId } = req.params

  try {
    const open = await Ticket.countDocuments({
      workspaceId: workspaceId,
      isOpen: true,
    })
    const closed = await Ticket.countDocuments({
      workspaceId: workspaceId,
      isOpen: false,
    })

    const date = new Date()
    const monthStart =
      new Date(date.getFullYear(), date.getMonth(), 1).getTime() / 1000

    const ticketsMessageCount = await Message.countDocuments({
      workspaceId: workspaceId,
      createdAt: { $gte: monthStart, $lte: Date.now() },
    })

    const yearStart = new Date(date.getFullYear(), 0, 1).getTime() / 1000

    const tickets = await Ticket.aggregate([
      {
        $match: {
          workspaceId: workspaceId,
          createdAt: { $gte: yearStart, $lte: Date.now() },
        },
      },
    ])

    let monthsCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let ticket of tickets) {
      const createdAt = ticket.createdAt
      const date = new Date(createdAt * 1000)
      monthsCount[date.getMonth()] += ticket.messageCount
    }
    const months = {
      January: monthsCount[0],
      February: monthsCount[1],
      March: monthsCount[2],
      April: monthsCount[3],
      May: monthsCount[4],
      June: monthsCount[5],
      July: monthsCount[6],
      August: monthsCount[7],
      September: monthsCount[8],
      October: monthsCount[9],
      November: monthsCount[10],
      December: monthsCount[11],
    }

    return res.status(200).json({
      open,
      closed,
      messageCount: ticketsMessageCount,
      months,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}

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
  } catch (error) {}
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
    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}
