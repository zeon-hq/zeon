import express, { Express, Request, Response, Router } from "express"
import {
    createCompany,
  deleteCompany,
  editCompany,
  getAllCompanies,
  getCompany,
} from "../functions/company"

export const createCompanyController = async (req: Request, res: Response) => {
    try {
        const company = await createCompany(req.body)
        return res.status(200).json({
            success: true,
            data: company
        })
    } catch (error) {
        console.log(error)
        throw {
            code: 500,
            message: error,
            error
        }
    }
}

// get all companies from workspaceId
export const getAllCompaniesController = async (
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

    const companies = await getAllCompanies(workspaceId)
    return res.status(200).json({
      success: true,
      data: companies,
    })
  } catch (error) {
    console.log(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

// get company by compnayId
export const getCompanyController = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params
    if (!companyId)
      throw {
        code: 500,
        message: "Invalid companyId",
        error: "Invalid companyId",
      }

    const company = await getCompany(companyId)

    return res.status(200).json({
      success: true,
      data: company,
    })
  } catch (error) {
    console.log(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

// edit company by companyId
export const editCompanyController = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body
    const { params } = req.body

    if (!companyId)
      throw {
        code: 500,
        message: "Invalid companyId",
        error: "Invalid companyId",
      }

    const updatedCompany = await editCompany(companyId, params)

    return res.status(200).json({
      success: true,
      data: updatedCompany,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error
    })
  }
}

// delete company by companyId
export const deleteCompanyController = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params
    if (!companyId)
      throw {
        code: 500,
        message: "Invalid companyId",
        error: "Invalid companyId",
      }

    const company = await deleteCompany(companyId)
    return res.status(200).json({
      success: true,
    })
  } catch (error) {
    console.log(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

// Bulk delete company by companyIs
export const bulkDeleteCompanyController = async (
  req: Request,
  res: Response
) => {}
