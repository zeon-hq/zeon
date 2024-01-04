import { Request, Response } from "express";
import { createDataModel, getDataModel } from "../functions/dataModel";

export const createDataModelController = async (req: Request, res: Response) => {
    try {
        const { resourceType, resourceId, fields, isDeleted } = req.body;
        const newDataModel = await createDataModel({
        resourceType,
        resourceId,
        fields,
        isDeleted,
        });
        return res.status(200).json({
        success: true,
        data: newDataModel,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
        success: false,
        message: error,
        });
    }
}

export const getDataModelController = async (req: Request, res: Response) => {
    try {
        const { resourceType, resourceId } = req.body;
        const newDataModel = await getDataModel({
        resourceType,
        resourceId,
        });
        return res.status(200).json({
        success: true,
        data: newDataModel,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
        success: false,
        message: error,
        });
    }
}