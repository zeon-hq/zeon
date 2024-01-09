import { generateId } from "../utils/utils";
import {
  ICreateNoteDTO,
  CRMResourceType,
  IGetNotesDTO,
  IUpdateNoteDTO,
  IDeleteNoteDTO,
} from "../types/types";
import { getContact } from "./contact";
import { getCompany } from "./company";

export const createNote = async (param: ICreateNoteDTO) => {
  try {
    if (!param) throw new Error("param is required");
    if (!param.content) throw new Error("content is required");
    if (!param.resourceId) throw new Error("resourceId is required");
    if (!param.resourceType) throw new Error("resourceType is required");
    if (!param.noteType) throw new Error("noteType is required");
    if (!param.userId) throw new Error("userId is required");
    if (!param.source) throw new Error("source is required");

    const { content, resourceId, resourceType, noteType, userId } = param;

    if (
      ![CRMResourceType.CONTACT, CRMResourceType.COMPANY].includes(resourceType)
    )
      throw new Error("Invalid resourceType");
    if (!["PRIVATE", "PUBLIC"].includes(noteType))
      throw new Error("Invalid noteType");
    const noteId = generateId(10);
    // create note
    const note = {
      content,
      resourceType,
      resourceId,
      noteType,
      createdAt: new Date(),
      isDeleted: false,
      createdBy: userId,
      noteId,
      source: param.source,
    };

    // if resourceType is CONTACT, add note to contact
    // if resourceType is COMPANY, add note to company

    if (resourceType === CRMResourceType.CONTACT) {
      // add note to contact
      // GET THE CONTACT
      const contact = await getContact(resourceId);
      if (!contact) throw new Error("Contact not found");
      // add note to contact
      contact.notes.push(note);
      // save contact
      await contact.save();
      return note;
    }

    if (resourceType === CRMResourceType.COMPANY) {
      // add note to company
      // GET THE COMPANY
      const company = await getCompany(resourceId);
      if (!company) throw new Error("Company not found");
      // add note to company
      company.notes.push(note);
      // save company
      await company.save();
      return note;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateNote = async (param: IUpdateNoteDTO) => {
  try {
    if (!param) throw new Error("param is required");
    if (!param.noteId) throw new Error("noteId is required");
    if (!param.content) throw new Error("content is required");
    if (!param.userId) throw new Error("userId is required");
    if (!param.resourceId) throw new Error("resourceId is required");
    if (!param.resourceType) throw new Error("resourceType is required");

    const { content, noteId, resourceId, resourceType } = param;

    if (
      ![CRMResourceType.CONTACT, CRMResourceType.COMPANY].includes(resourceType)
    )
      throw new Error("Invalid resourceType");

    // if resourceType is CONTACT, add note to contact
    // if resourceType is COMPANY, add note to company

    if (resourceType === CRMResourceType.CONTACT) {
      // add note to contact
      // GET THE CONTACT
      const contact = await getContact(resourceId);
      if (!contact) throw new Error("Contact not found");
      // add note to contact
      const noteIndex = contact.notes.findIndex(
        (note) => note.noteId === noteId
      );
      if (noteIndex === -1) throw new Error("Note not found");
      contact.notes[noteIndex].content = content;
      // save contact
      await contact.save();
      return contact.notes[noteIndex];
    }

    if (resourceType === CRMResourceType.COMPANY) {
      // add note to company
      // GET THE COMPANY
      const company = await getCompany(resourceId);
      if (!company) throw new Error("Company not found");
      // add note to company
      const noteIndex = company.notes.findIndex(
        (note) => note.noteId === noteId
      );
      if (noteIndex === -1) throw new Error("Note not found");
      company.notes[noteIndex].content = content;
      // save company
      await company.save();
      return company.notes[noteIndex];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteNote = async (param: IDeleteNoteDTO) => {
  try {
    if (!param) throw new Error("param is required");
    if (!param.noteId) throw new Error("noteId is required");
    if (!param.userId) throw new Error("userId is required");
    if (!param.resourceId) throw new Error("resourceId is required");
    if (!param.resourceType) throw new Error("resourceType is required");

    const { noteId, resourceId, resourceType } = param;

    if (
      ![CRMResourceType.CONTACT, CRMResourceType.COMPANY].includes(resourceType)
    )
      throw new Error("Invalid resourceType");

    // if resourceType is CONTACT, add note to contact
    // if resourceType is COMPANY, add note to company

    if (resourceType === CRMResourceType.CONTACT) {
      // add note to contact
      // GET THE CONTACT
      const contact = await getContact(resourceId);
      if (!contact) throw new Error("Contact not found");
      // add note to contact
      const noteIndex = contact.notes.findIndex(
        (note) => note.noteId === noteId
      );
      if (noteIndex === -1) throw new Error("Note not found");
      // remove the note completely
      contact.notes.splice(noteIndex, 1);
      // save contact
      await contact.save();

      return contact.notes[noteIndex];
    }

    if (resourceType === CRMResourceType.COMPANY) {
      // add note to company
      // GET THE COMPANY
      const company = await getCompany(resourceId);
      if (!company) throw new Error("Company not found");
      // add note to company
      const noteIndex = company.notes.findIndex(
        (note) => note.noteId === noteId
      );
      if (noteIndex === -1) throw new Error("Note not found");
      // remove the note completely
      company.notes.splice(noteIndex, 1);
      // save company
      await company.save();
      return company.notes[noteIndex];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getNotes = async (param: IGetNotesDTO) => {
  try {
    if (!param) throw new Error("param is required");
    if (!param.resourceId) throw new Error("resourceId is required");
    if (!param.resourceType) throw new Error("resourceType is required");
    if (!param.page) throw new Error("page is required");
    if (!param.limit) throw new Error("limit is required");
    if (!param.userId) throw new Error("userId is required");

    const { resourceId, resourceType, page, limit } = param;

    if (
      ![CRMResourceType.CONTACT, CRMResourceType.COMPANY].includes(resourceType)
    )
      throw new Error("Invalid resourceType");

    // if resourceType is CONTACT, add note to contact
    // if resourceType is COMPANY, add note to company

    if (resourceType === CRMResourceType.CONTACT) {
      // add note to contact
      // GET THE CONTACT
      const contact = await getContact(resourceId);
      if (!contact) throw new Error("Contact not found");
      // add note to contact
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      // get private notes only if userId is same as createdBy
      const allNotes = contact.notes.filter(
        (note) =>
          note.noteType === "PUBLIC" ||
          (note.noteType === "PRIVATE" && note.createdBy === param.userId)
      );
      const paginatedNotes = allNotes.slice(startIndex, endIndex);
      const total = contact.notes.length;
      return {
        total,
        page,
        limit,
        notes: paginatedNotes,
      };
    }

    if (resourceType === CRMResourceType.COMPANY) {
      // add note to company
      // GET THE COMPANY
      const company = await getCompany(resourceId);
      if (!company) throw new Error("Company not found");
      // add note to company
      const notes = company.notes.filter((note) => !note.isDeleted);
      const total = notes.length;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedNotes = notes.slice(startIndex, endIndex);
      return {
        total,
        page,
        limit,
        notes: paginatedNotes,
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
