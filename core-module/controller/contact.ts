import { Request, Response } from "express"
import {
  createContact,
  deleteContact,
  updateContact,
  getAllContacts,
  getContact,
} from "../functions/contact"
import { formatEmailAddress } from "../utils/formatter"
import { formatPhoneNumber } from "../utils/formatter"
import { verifyDataAgainstDataModel } from "../functions/dataModel"
import { CRMResourceType } from "../types/types"
import { ContactsModel } from "../schema/Contact"
import { CompanyModel } from "../schema/Company"

export const createContactController = async (req: Request, res: Response) => {
  try {
    const contact = await createContact({
      ...req.body,
      emailAddress: formatEmailAddress(req.body?.emailAddress),
      phoneNumber: req.body?.phoneNumber ? formatPhoneNumber(req.body?.phoneNumber) : undefined,
    })
    return res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message || error
    })
  }
}
// get all contacts from workspaceId
export const getAllContactsController = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params
    const { limit, offset } = req.query

    if (!workspaceId)
      return res.status(500).json({
        success: false,
        message: "Invalid workspaceId",
        error: "Invalid workspaceId",
      })

    const { contacts, total } = await getAllContacts(
      workspaceId,
      limit as string,
      offset as string
    )
    return res.status(200).json({
      success: true,
      data: {
        contacts,
        count: total,
      },
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message || error
    })
  }
}
// get contact by contactId
export const getContactController = async (req: Request, res: Response) => {
  try {
    const { contactId } = req.params
    if (!contactId)
      return res.status(500).json({
        success: false,
        message: "Invalid contactId",
        error: "Invalid contactId",
      })

    const contact = await getContact(contactId)
    return res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message || error
    })
  }
}
// update contact by contactId
export const updateContactController = async (req: Request, res: Response) => {
  try {
    const { contactId } = req.params
    if (!contactId)
      return res.status(500).json({
        success: false,
        message: "Invalid contactId",
        error: "Invalid contactId",
      })

    const contact = await updateContact(contactId, {
      ...req.body,
      emailAddress: formatEmailAddress(req.body?.emailAddress),
      phoneNumber: req.body?.phoneNumber ? formatPhoneNumber(req.body?.phoneNumber) : undefined,
    })
    return res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message || error
    })
  }
}
// delete contact by contactId
export const deleteContactController = async (req: Request, res: Response) => {
  try {
    const { contactId } = req.params
    if (!contactId)
      return res.status(500).json({
        success: false,
        message: "Invalid contactId",
        error: "Invalid contactId",
      })

    const contact = await deleteContact(contactId)
    return res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message || error
    })
  }
}

export const updateAdditionalDatafieldController = async (
  req: Request,
  res: Response
) => {
  try {
    const { contactId } = req.params
    const { fields } = req.body
    if (!contactId)
      return res.status(500).json({
        success: false,
        message: "Invalid contactId",
        error: "Invalid contactId",
      })

    const isDataVerified = await verifyDataAgainstDataModel({
      resourceType: CRMResourceType.CONTACT,
      resourceId: contactId,
      fields,
    })

    const contact = await ContactsModel.findOne({ contactId })
    const prevFields = contact.additionalDatafields || {}
    const newFields = { ...prevFields, ...fields }
    if (isDataVerified) {
      // update contact
      await ContactsModel.findOneAndUpdate(
        { contactId },
        { $set: { additionalDatafields: newFields } },
        { new: true }
      )
      return res.status(200).json({
        success: true,
        data: fields,
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message || error
    })
  }
}

export const getCRMDetailsController = async (req: Request, res: Response) => {
  const { workspaceId } = req.params
  // fetch all contacts
  const contacts = await ContactsModel.find({ workspaceId, isDeleted: false }).select(
    "firstName lastName contactId"
  )
  // fetch all companies
  const companies = await   CompanyModel.find({ workspaceId, isDeleted: false }).select(
    "name companyId"
  )

  return res.status(200).json({
    success: true,
    data: {
      contacts: contacts || [],
      companies: companies || []
    }
  })


}
