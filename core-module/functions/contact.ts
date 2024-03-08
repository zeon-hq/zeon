import { generateId } from "../utils/utils"
import Contact, { ContactsModel } from "../schema/Contact"
import Logger from "./logger"
import { ZeonServices } from "../types/types"

const logger = new Logger(ZeonServices.CORE)
export const createContact = async (params: Contact) => {
  try {
    if (!params)
      throw {
        code: 500,
        message: "Invalid params",
        error: "Invalid params",
      }

    if (!params.firstName)
      throw {
        code: 500,
        message: "Invalid name",
        error: "Invalid name",
      }

    if (!params.workspaceId)
      throw {
        code: 500,
        message: "Invalid workspaceId",
        error: "Invalid workspaceId",
      }

    const created_at = new Date()
    const updated_at = new Date()
    const contactId = generateId(10)

    params.created_at = created_at
    params.updated_at = updated_at
    params.contactId = contactId

    const contact = await ContactsModel.create(params)
    logger.info({
      message: `Contact created`,
      payload: contact,
    })
    return contact
  } catch (error) {
    console.log(error)
    logger.error({
      message: `Error creating contact`,
      error: error,
    })
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const getAllContacts = async (
  workspaceId: string,
  limit: string,
  offset: string
) => {
  try {
    if (!workspaceId)
      throw {
        code: 500,
        message: "Invalid workspaceId",
        error: "Invalid workspaceId",
      }

    if (!limit || parseInt(limit) > 100) limit = "100"
    if (!offset) offset = "0"

    const contacts = await ContactsModel.find({ workspaceId, isDeleted: false })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ created_at: -1 })

    const total = await ContactsModel.countDocuments({
      workspaceId,
      isDeleted: false,
    })

    return {
      contacts,
      total,
    }
  } catch (error) {
    console.log(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const getContact = async (contactId: string) => {
  try {
    if (!contactId)
      throw {
        code: 500,
        message: "Invalid contactId",
        error: "Invalid contactId",
      }

    const contact = await ContactsModel.findOne({
      contactId,
      isDeleted: false,
    })
    return contact
  } catch (error) {
    console.log(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const updateContact = async (contactId: string, params: Contact) => {
  try {
    if (!contactId)
      throw {
        code: 500,
        message: "Invalid contactId",
        error: "Invalid contactId",
      }

    if (!params)
      throw {
        code: 500,
        message: "Invalid params",
        error: "Invalid params",
      }

    if (!params.firstName)
      throw {
        code: 500,
        message: "Invalid name",
        error: "Invalid name",
      }

    const updated_at = new Date()

    params.updated_at = updated_at

    const contact = await ContactsModel.findOneAndUpdate(
      { contactId },
      params,
      { new: true }
    )
    return contact
  } catch (error) {
    console.log(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const deleteContact = async (contactId: string) => {
  try {
    if (!contactId)
      throw {
        code: 500,
        message: "Invalid contactId",
        error: "Invalid contactId",
      }

    const contact = await ContactsModel.findOneAndUpdate(
      { contactId },
      { isDeleted: true },
      { new: true }
    )
    return contact
  } catch (error) {
    console.log(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const addNoteToContact = async (contactId: string, note: string) => {
  try {
    if (!contactId)
      throw {
        code: 500,
        message: "Invalid contactId",
        error: "Invalid contactId",
      }

    if (!note)
      throw {
        code: 500,
        message: "Invalid note",
        error: "Invalid note",
      }

    const contact = await ContactsModel.findOneAndUpdate(
      { contactId },
      { $push: { notes: note } },
      { new: true }
    )
    return contact
  } catch (error) {
    console.log(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}
