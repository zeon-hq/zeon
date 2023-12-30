import express, { Express, Request, Response, Router } from "express"
import {
    createContact,
    deleteContact,
    updateContact,
    getAllContacts,
    getContact,
    addNoteToContact,
} from "../functions/contact"

export const createContactController = async (req: Request, res: Response) => {
    try {
        const contact = await createContact(req.body)
        return res.status(200).json({
            success: true,
            data: contact
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })

    }
}

// get all contacts from workspaceId
export const getAllContactsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { workspaceId } = req.params
    if (!workspaceId)
      throw {
        code: 500,
        message: "Invalid workspaceId",
        error: "Invalid workspaceId",
      }

    const contacts = await getAllContacts(workspaceId)
    return res.status(200).json({
      success: true,
      data: contacts,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error,
    })
  }
}

// get contact by contactId
export const getContactController = async (req: Request, res: Response) => {
  try {
    const { contactId } = req.params
    if (!contactId)
      throw {
        code: 500,
        message: "Invalid contactId",
        error: "Invalid contactId",
      }

    const contact = await getContact(contactId)
    return res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error,
    })
  }
}

// update contact by contactId
export const updateContactController = async (req: Request, res: Response) => {
  try {
    const { contactId, data } = req.body
    if (!contactId)
      throw {
        code: 500,
        message: "Invalid contactId",
        error: "Invalid contactId",
      }

    const contact = await updateContact(contactId, data)
    return res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error,
    })
  }
}

// delete contact by contactId
export const deleteContactController = async (req: Request, res: Response) => {
  try {
    const { contactId } = req.params
    if (!contactId)
      throw {
        code: 500,
        message: "Invalid contactId",
        error: "Invalid contactId",
      }

    const contact = await deleteContact(contactId)
    return res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error,
    })
  }
}

export const addNoteToContactController = async (req: Request, res: Response) => {
  try {
    const {  note } = req.body
    const { contactId } = req.params
    if (!contactId)
      throw {
        code: 500,
        message: "Invalid contactId",
        error: "Invalid contactId",
      }

    const contact = await addNoteToContact(contactId, note)
    return res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error,
    })
  }
}
