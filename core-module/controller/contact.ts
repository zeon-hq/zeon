import { Request, Response } from "express";
import {
  createContact,
  deleteContact,
  updateContact,
  getAllContacts,
  getContact,
} from "../functions/contact";
import { formatEmailAddress } from "../utils/formatter";
import { formatPhoneNumber } from "../utils/formatter";

export const createContactController = async (req: Request, res: Response) => {
  try {
    const contact = await createContact({
      ...req.body,
      emailAddress: formatEmailAddress(req.body?.emailAddress),
      phoneNumber: formatPhoneNumber(req.body?.phoneNumber),
    });
    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// get all contacts from workspaceId
export const getAllContactsController = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const { limit, offset } = req.query;

    if (!workspaceId)
      throw {
        code: 500,
        message: "Invalid workspaceId",
        error: "Invalid workspaceId",
      };

    const { contacts, total } = await getAllContacts(
      workspaceId,
      limit as string,
      offset as string
    );
    return res.status(200).json({
      success: true,
      data: {
        contacts,
        count: total,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// get contact by contactId
export const getContactController = async (req: Request, res: Response) => {
  try {
    const { contactId } = req.params;
    if (!contactId)
      throw {
        code: 500,
        message: "Invalid contactId",
        error: "Invalid contactId",
      };

    const contact = await getContact(contactId);
    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// update contact by contactId
export const updateContactController = async (req: Request, res: Response) => {
  try {
    const { contactId } = req.params;
    if (!contactId)
      throw {
        code: 500,
        message: "Invalid contactId",
        error: "Invalid contactId",
      };

    const contact = await updateContact(contactId, {
      ...req.body,
      emailAddress: formatEmailAddress(req.body?.emailAddress),
      phoneNumber: formatPhoneNumber(req.body?.phoneNumber),
    });
    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// delete contact by contactId
export const deleteContactController = async (req: Request, res: Response) => {
  try {
    const { contactId } = req.params;
    if (!contactId)
      throw {
        code: 500,
        message: "Invalid contactId",
        error: "Invalid contactId",
      };

    const contact = await deleteContact(contactId);
    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
