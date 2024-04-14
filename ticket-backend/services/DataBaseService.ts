import { Collection, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { MessageOptions, ITicketOptions } from "../schema/types/ticket";
import TicketModel from "../model/TicketModel";
import MessageModel from "../model/MessageModel";
import SocketModel from "../model/SocketModel";
import TeamModel from "../model/TeamModel";
import ChannelModel from "../model/ChannelModel";
import { generateRandomString } from "../utils/blocks";

dotenv.config();

const uri: string = process.env.DB_URI as string;
const dbName: string = process.env.DB_NAME as string;

/**
 * Stores a ticket in the database
 * @returns
 */
export async function storeTicket(ticketOptions: ITicketOptions) {
  try {

    const createTicket = await TicketModel.create({
      workspaceId: ticketOptions.workspaceId,
      customerEmail: ticketOptions.customerEmail,
      createdAt: ticketOptions.createdAt,
      updatedAt: ticketOptions.createdAt,
      text: ticketOptions.message,
      isOpen: ticketOptions.isOpen,
      widgetId:ticketOptions.widgetId,
      type: ticketOptions.type,
      channelId:ticketOptions.channelId,
      messageCount:ticketOptions.messageCount,
      socketId: ticketOptions.socketId,
      asignedUser: ticketOptions.assignedUser,
      ticketId:ticketOptions.ticketId
    })

    return createTicket;
  } finally {
  }
}

/**
 * Returns a team data from database
 * @param workspaceId - Team's unique Identifier in database
 * @returns
 */
export async function getTeamByID(workspaceId: string) {
  try {
    const team = await TeamModel.find({ _id: new ObjectId(workspaceId) }).exec();
    return team;
  } catch (error) {
    console.error('Error retrieving team data:', error);
    throw error;
  }
}

export async function getTicketByID(ticketId: string) {
  try {
    const ticket = await TicketModel.findOne({ ticketId }).exec();
    return ticket;
  } catch (error) {
    console.error('Error retrieving ticket data:', error);
    throw error;
  }
}

/**
 * Returns a team data from database
 * @param channelId - Team's unique Identifier in database
 * @returns
 */
export async function getChannelByID(channelId: string) {
  try {
    const channel = await ChannelModel.findOne({ channelId: channelId }).exec();
    return channel;
  } catch (error) {
    console.error('Error retrieving channel data:', error);
    throw error;
  }
}

/**
 * Returns a ticket data from database
 * @param ticketId - Unique message thread Id
 * @returns
 */
export async function getTicketByTicketID(ticketId: string) {
  try {
    const tickets = await TicketModel.findOne({ ticketId }).exec();
    return tickets;
  } catch (error) {
    console.error('Error retrieving tickets by thread ID:', error);
    throw error;
  }
}

export async function getTicketByIDTemp(ticketId: string) {
  try {
    const getTickets = await TicketModel.findOne({ ticketId });
    return getTickets;
  } finally {
  }
}


/**
 * Updates record of a client's socket id for an open ticket
 * @param ticketId - Id of the ticket thread to be updated
 * @param socketId - Id od the client socket
 * @returns
 */
export async function updateClientSocketId(
  ticketId: string,
  socketId: string
): Promise<boolean> {
  try {
    const result = await TicketModel.updateOne(
      { ticketId },
      { $set: { socketId: socketId } }
    ).exec();

    return result.modifiedCount > 0; // Check if at least one document was modified
  } catch (error) {
    console.error('Error updating client socket ID:', error);
    throw error;
  }
}

/**
 * Updates a ticket's status
 * @param ticketId - Id of the ticket thread to be updated
 * @param isOpen - boolean
 * @returns
 */
export async function updateTicketStatus(
  ticketId: string,
  isOpen: boolean
): Promise<boolean> {
  try {
    const updatedTicket = await TicketModel.findOneAndUpdate(
      { ticketId },
      { $set: { isOpen: !isOpen } },
      { new: true }
    ).exec();

    return !!updatedTicket; // Check if a ticket was updated
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
}

export async function updateTicketStatusByTicketId(
  ticketId: string,
  isOpen: boolean
): Promise<boolean> {
  try {
    const updatedTicket = await TicketModel.findOneAndUpdate(
      {ticketId},
      { $set: { isOpen: isOpen } }
    );

    return !!updatedTicket; // Check if a ticket was updated
  } catch (error) {
    console.error('Error updating ticket status by ticketId:', error);
    throw error;
  }
}

export async function getAdapterCollection(): Promise<Collection<Document>> {
  // Create a collection if it's not already created;
  const _client: MongoClient = new MongoClient(uri);
  try {
    await _client.connect();
    const collection: Collection<Document> = _client
      .db(dbName)
      .collection("socket-adapter-events");
    return collection;
  } finally {
    // await _client.close();
  }
}

export async function incrementMessageCount(
  ticketId: string
): Promise<boolean> {
  try {
     // Assuming you have already connected to the MongoDB database elsewhere in your application

    // Find the ticket by its ID and update the messageCount field
    const result = await TicketModel.updateOne({ ticketId }, { $inc: { messageCount: 1 } });

    return result.modifiedCount > 0;
  } finally {
    // await client.close();
  }
}

export async function createMessage(message: MessageOptions): Promise<boolean> {
  try {
    // Assuming you have already connected to the MongoDB database elsewhere in your application

    // Use the .create method to create and insert the document
    const result = await MessageModel.create(message);

    return !!result; // Check if the result is truthy to determine if the insertion was successful
  } catch (error) {
    console.error('Error creating message:', error);
    return false;
  }
}

export async function createDashboardSocket(
  workspaceId: string,
  socketId: string
): Promise<boolean> {
  try {
    // Assuming you have already connected to the MongoDB database elsewhere in your application

    // Create a new document using the SocketModel
    await SocketModel.create({
      workspaceId: workspaceId,
      socketId: socketId
    });

    return true; // Return true to indicate success
  } catch (error) {
    console.error('Error creating dashboard socket:', error);
    return false; // Return false to indicate an error
  }
}

export async function removeDashboardSocket(socketId: string): Promise<any> {
  try {
    // Assuming you have already connected to the MongoDB database elsewhere in your application

    // Find and delete the document using the SocketModel
    const result = await SocketModel.updateMany({ socketId },{$set:{isDeleted:true}});

    return result;
  } catch (error) {
    console.error('Error removing dashboard socket:', error);
    return null; // Return null or handle the error as needed
  }
}

export async function getConnectedDashboardSockets(
  workspaceId: string
): Promise<any[]> {
  try {
    // Assuming you have already connected to the MongoDB database elsewhere in your application

    // Use the SocketModel to find documents with the specified workspaceId
    const docs = await SocketModel.find({ workspaceId: workspaceId, isDeleted:false });

    // Extract socketIds from the documents
    const socketIds = docs.map((doc) => doc.socketId.toString());

    return socketIds;
  } catch (error) {
    console.error('Error getting connected dashboard sockets:', error);
    return []; // Return an empty array or handle the error as needed
  }
}

export async function getMessagesByTicketID(ticketId: string) {
  try {
    // Assuming you have already connected to the MongoDB database elsewhere in your application

    // Use the TicketModel to find a ticket by its _id
    const ticket = await TicketModel.findOne({ticketId});

    if (!ticket) {
      return null; // Handle the case where the ticket is not found
    }

    // Use the MessageModel to find messages with the specified ticketId
    const messages = await MessageModel.find({ ticketId: ticket._id });

    // Convert ticket to JSON
    const ticketJSON:any = ticket.toJSON();

    // Add the messages to the ticket JSON
    ticketJSON.messages = messages;

    return ticketJSON;
  } catch (error) {
    console.error('Error getting messages by ticket ID:', error);
    return null; // Handle the error as needed
  }
}



/**
 * Returns a channel id from database
 * @param referenceCode - Unique channel reference code
 * @returns
 */
export async function getChannelIDByReferenceCode(
  referenceCode: string
): Promise<string | null> {
  try {
    const channel = await ChannelModel.findOne({ channelId: referenceCode }).exec();
    return channel?.channelId || null;
  } catch (error) {
    console.error('Error retrieving channel:', error);
    return null;
  }
}
