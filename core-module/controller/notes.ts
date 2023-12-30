import { Request, Response } from "express";
import { createNote, deleteNote, getNotes, updateNote } from "../functions/notes";
import { ICreateNoteDTO } from "../types/types";

export const addNoteController = async (req: Request, res: Response) => {
  try {
    const { note, noteType, source, resourceType, resourceId } =
      req.body as any;
    const user = req.user as any;

    // add note
    const payload: ICreateNoteDTO = {
      content: note,
      resourceId,
      resourceType,
      noteType,
      userId: user.userId,
      source,
    };
    const createdNote = await createNote(payload);
    return res.status(200).json({
      success: true,
      data: createdNote,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const updateNoteController = async (req: Request, res: Response) => {
  try {
    const { noteId, content, resourceId, resourceType } = req.body;
    const user = req.user as any;

    const updatedNote = await updateNote({
      noteId,
      content,
      userId: user.userId,
      resourceId,
      resourceType,
    });
    return res.status(200).json({
      success: true,
      data: updatedNote,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const deleteNoteController = async (req: Request, res: Response) => {
  try {
    const { noteId, resourceId, resourceType } = req.body;
    const user = req.user as any;

    const updatedNote = await deleteNote({
      noteId,
      userId: user.userId,
      resourceId,
      resourceType,
    });
    return res.status(200).json({
      success: true,
      data: updatedNote,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const getNotesController = async (req: Request, res: Response) => {
    try {
        const { resourceId, resourceType, page, limit } = req.query;
        const user = req.user as any;
    
        const notes = await getNotes({
        resourceId: resourceId as string,
        resourceType: resourceType as any,
        page: page as any,
        limit: limit as any,
        userId: user.userId,
        });
        return res.status(200).json({
        success: true,
        data: notes,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
        success: false,
        message: error,
        });
    }
}
