import express, { Express, Request, Response, Router } from "express"
import {
  createCompany,
  deleteCompany,
  editCompany,
  getAllCompanies,
  getAllCompaniesByPair,
  getCompany,
} from "../functions/company"
import { formatPhoneNumber } from "../utils/formatter"
import { verifyDataAgainstDataModel } from "../functions/dataModel"
import { ContactsModel } from "../schema/Contact"
import { CRMResourceType } from "../types/types"
import { CompanyModel } from "../schema/Company"

export const createCompanyController = async (req: Request, res: Response) => {
  try {
    const company = await createCompany({
      ...req.body,
      phoneNumber: formatPhoneNumber(req.body?.phoneNumber),
    })
    return res.status(200).json({
      success: true,
      data: company,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message || error,
    })
  }
}

// get all companies from workspaceId
export const getAllCompaniesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { workspaceId } = req.params
    const { limit, offset } = req.query

    if (!workspaceId)
      return res.status(500).json({
        success: false,
        message: "Invalid workspaceId",
        error: "Invalid workspaceId",
      })

    const { companies, total } = await getAllCompanies(
      workspaceId,
      limit as string,
      offset as string
    )
    return res.status(200).json({
      success: true,
      data: {
        companies,
        count: total,
      },
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message || error,
    })
  }
}

// get all companies with value label pair where value is companyId and label is companyName
export const getAllCompaniesValueLabelController = async (
  req: Request,
  res: Response
) => {
  try {
    const { workspaceId } = req.params

    if (!workspaceId)
      return res.status(500).json({
        success: false,
        message: "Invalid workspaceId",
        error: "Invalid workspaceId",
      })

    const companies = await getAllCompaniesByPair(workspaceId)

    return res.status(200).json({
      success: true,
      data: companies.map((company: any) => ({
        value: company.companyId,
        label: company.name,
      })),
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message || error,
    })
  }
}

// get company by compnayId
/**
 *
 * @param req
 * @param res
 * @returns
 * write swagger docs
 *
 */
export const getCompanyController = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params
    if (!companyId)
      return res.status(500).json({
        success: false,
        message: "Invalid companyId",
        error: "Invalid companyId",
      })

    const company = await getCompany(companyId)

    return res.status(200).json({
      success: true,
      data: company,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message || error,
    })
  }
}

// edit company by companyId
export const editCompanyController = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params

    if (!companyId)
      return res.status(500).json({
        success: false,
        message: "Invalid companyId",
        error: "Invalid companyId",
      })

    const updatedCompany = await editCompany(companyId, {
      ...req.body,
      phoneNumber: formatPhoneNumber(req.body?.phoneNumber),
    })

    return res.status(200).json({
      success: true,
      data: updatedCompany,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message || error,
    })
  }
}

// delete company by companyId
export const deleteCompanyController = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params
    if (!companyId)
      return res.status(500).json({
        success: false,
        message: "Invalid companyId",
        error: "Invalid companyId",
      })

    const company = await deleteCompany(companyId)
    return res.status(200).json({
      success: true,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message || error,
    })
  }
}

export const updateAdditionalDatafieldController = async (
  req: Request,
  res: Response
) => {
  try {
    const { companyId } = req.params
    const { fields } = req.body
    if (!companyId)
      return res.status(500).json({
        success: false,
        message: "Invalid companyId", 
      })

    const isDataVerified = await verifyDataAgainstDataModel({
      resourceType: CRMResourceType.COMPANY,
      resourceId: companyId,
      fields,
    })

    const company = await CompanyModel.findOne({ companyId })
    const prevFields = company.additionalDatafields || {}
    const updatedFields = { ...prevFields, ...fields }

    if (isDataVerified) {
      // update contact
      await CompanyModel.findOneAndUpdate(
        { companyId },
        { $set: { additionalDatafields: updatedFields } },
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
      message: error.message || error,
    })
  }
}

// Bulk delete company by companyIs
export const bulkDeleteCompanyController = async (
  req: Request,
  res: Response
) => {}
