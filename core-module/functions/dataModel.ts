import { CRMResourceType } from "../types/types"
import DataModel from "../schema/DataModel"

export interface ICreateDataModelDTO {
  resourceType: CRMResourceType
  resourceId: string
  fields: any
  isDeleted: boolean
}

export interface IUpdateDataModelDTO {
    resourceType: CRMResourceType
    resourceId: string
    fields: any
}

export interface IGetDataModelDTO {
    resourceType: CRMResourceType
    resourceId: string
}

export interface IVerifyDataAgainstDataModelDTO {
    resourceType: CRMResourceType
    resourceId: string
    fields: any
}

export const createDataModel = async ({
  resourceType,
  resourceId,
  fields,
  isDeleted,
}: ICreateDataModelDTO) => {
  try {
    // check if the resourceId is present
    if (!resourceId) {
      throw new Error("resourceId is required")
    }
    // check if the resourceType is present
    if (!resourceType) {
      throw new Error("resourceType is required")
    }
    // resourceType should be one in CRMResourceType
    if (!Object.values(CRMResourceType).includes(resourceType)) {
      throw new Error("Invalid resourceType")
    }

    // create data model
    const dataModel = {
      resourceType,
      resourceId,
      fields,
      isDeleted,
    }
    // save data model
    const newDataModel = await DataModel.findOneAndUpdate({resourceType, resourceId},{
        ...dataModel
    }, {upsert: true})
    return dataModel
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateDataModel = async ({
    resourceType,
    resourceId,
    fields,
  }: IUpdateDataModelDTO) => {
    try {
      // check if the resourceId is present
      if (!resourceId) {
        throw new Error("resourceId is required")
      }
      // check if the resourceType is present
      if (!resourceType) {
        throw new Error("resourceType is required")
      }
      // resourceType should be one in CRMResourceType
      if (!Object.values(CRMResourceType).includes(resourceType)) {
        throw new Error("Invalid resourceType")
      }
  
      // update data model
      const dataModel = {
        resourceType,
        resourceId,
        fields,
      }
      // save data model
      const updatedDataModel = await DataModel.updateOne({resourceType, resourceId}, dataModel)
      return updatedDataModel
    } catch (error) {
      console.log(error)
      throw error
    }
}

export const getDataModel = async ({
    resourceType,
    resourceId,
  }: IGetDataModelDTO) => {
    try {
      // check if the resourceId is present
      if (!resourceId) {
        throw new Error("resourceId is required")
      }
      // check if the resourceType is present
      if (!resourceType) {
        throw new Error("resourceType is required")
      }
      // resourceType should be one in CRMResourceType
      if (!Object.values(CRMResourceType).includes(resourceType)) {
        throw new Error("Invalid resourceType")
      }
  
      // update data model
      const dataModel = {
        resourceType,
        resourceId,
      }
      // save data model
      const dataModelData = await DataModel.findOne({resourceType, resourceId})
      return dataModelData
    } catch (error) {
      console.log(error)
      throw error
    }
}

export const verifyDataAgainstDataModel = async ({
    resourceType,
    resourceId,
    fields,
  }: IVerifyDataAgainstDataModelDTO) => {
    try {
      // check if the resourceId is present
      if (!resourceId) {
        throw new Error("resourceId is required")
      }
      // check if the resourceType is present
      if (!resourceType) {
        throw new Error("resourceType is required")
      }
      const dataModel = await getDataModel({resourceType, resourceId})
      if(!dataModel) {
          throw new Error("Data model not found")
      }
      /**
       * data will be an object
       * check if there is no extra field in data
       */
     const dataKeys = Object.keys(fields)
     const dataModelKeys = dataModel.fields.map(field => field.name)

     const extraKeys = dataKeys.filter(key => !dataModelKeys.includes(key))
     if(extraKeys.length > 0) {
        throw new Error(`Extra fields found: ${extraKeys.join(", ")}`)
     }
     return true

    } catch (error) {
      console.log(error)
      throw error
    }
}



