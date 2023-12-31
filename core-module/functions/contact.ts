import { generateId } from "../utils/utils";
import Contact, { ContactsModel } from "../schema/Contact";

export const createContact = async (params: Contact) => {
    try {
        if (!params)
        throw {
            code: 500,
            message: "Invalid params",
            error: "Invalid params",
        };
    
        if (!params.first_name)
        throw {
            code: 500,
            message: "Invalid name",
            error: "Invalid name",
        };
    
        if (!params.workspaceId)
        throw {
            code: 500,
            message: "Invalid workspaceId",
            error: "Invalid workspaceId",
        };
    
        const created_at = new Date();
        const updated_at = new Date();
        const contactId = generateId(10);
    
        params.created_at = created_at;
        params.updated_at = updated_at;
        params.contactId = contactId;
    
        const contact = await ContactsModel.create(params);
        return contact;
    } catch (error) {
        console.log(error);
        throw {
        code: 500,
        message: error,
        error,
        };
    }
}

export const getAllContacts = async (workspaceId: string) => {
    try {
        if (!workspaceId)
        throw {
            code: 500,
            message: "Invalid workspaceId",
            error: "Invalid workspaceId",
        };
    
        const contacts = await ContactsModel.find({ workspaceId, isDeleted: false });
        return contacts;
    } catch (error) {
        console.log(error);
        throw {
        code: 500,
        message: error,
        error,
        };
    }
}

export const getContact = async (contactId: string) => {
    try {
        if (!contactId)
        throw {
            code: 500,
            message: "Invalid contactId",
            error: "Invalid contactId",
        };
    
        const contact = await ContactsModel.findOne({ contactId, isDeleted: false });
        return contact;
    } catch (error) {
        console.log(error);
        throw {
        code: 500,
        message: error,
        error,
        };
    }
}

export const updateContact = async (contactId: string, params: Contact) => {
    try {
        if (!contactId)
        throw {
            code: 500,
            message: "Invalid contactId",
            error: "Invalid contactId",
        };
    
        if (!params)
        throw {
            code: 500,
            message: "Invalid params",
            error: "Invalid params",
        };
    
        if (!params.first_name)
        throw {
            code: 500,
            message: "Invalid name",
            error: "Invalid name",
        };
    
        const updated_at = new Date();
    
        params.updated_at = updated_at;
    
        const contact = await ContactsModel.findOneAndUpdate({ contactId }, params, { new: true });
        return contact;
    } catch (error) {
        console.log(error);
        throw {
        code: 500,
        message: error,
        error,
        };
    }
}

export const deleteContact = async (contactId: string) => {
    try {
        if (!contactId)
        throw {
            code: 500,
            message: "Invalid contactId",
            error: "Invalid contactId",
        };
    
        const contact = await ContactsModel.findOneAndUpdate({ contactId }, { isDeleted: true }, { new: true });
        return contact;
    } catch (error) {
        console.log(error);
        throw {
        code: 500,
        message: error,
        error,
        };
    }
}