import { generateId } from "../utils/utils"
import Company, { CompanyModel } from "../schema/Company"

export const createCompany = async (params: Company) => {
  try {
    if (!params)
      throw {
        code: 500,
        message: "Invalid params",
        error: "Invalid params",
      }

    if (!params.name)
      throw {
        code: 500,
        message: "Invalid name",
        error: "Invalid name",
      }

    if (!params.workspaceId)
      throw {
        code: 500,
        message: "Invalid workspaceId",
        error: "Invalid workspaceId",
      }

    const created_at = new Date()
    const updated_at = new Date()
    const companyId = generateId(10)

    params.created_at = created_at
    params.updated_at = updated_at
    params.companyId = companyId

    const company = await CompanyModel.create(params)
    return company
  } catch (error) {
    console.log(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const getAllCompanies = async (workspaceId: string) => {
  try {
    if (!workspaceId)
      throw {
        code: 500,
        message: "Invalid workspaceId",
        error: "Invalid workspaceId",
      }

    const companies = await CompanyModel.find({ workspaceId, isDeleted: false })
    return companies
  } catch (error) {
    console.log(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const getCompany = async (companyId: string) => {
  try {
    if (!companyId)
      throw {
        code: 500,
        message: "Invalid companyId",
        error: "Invalid companyId",
      }

    const company = await CompanyModel.findOne({ companyId, isDeleted: false })
    return company
  } catch (error) {
    console.log(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const editCompany = async (companyId: string, params: Company) => {
  try {
    if (!companyId)
      throw {
        code: 500,
        message: "Invalid companyId",
        error: "Invalid companyId",
      }

    if (!params)
      throw {
        code: 500,
        message: "Invalid params",
        error: "Invalid params",
      }

    const updated_at = new Date()

    params.updated_at = updated_at

    const company = await CompanyModel.findOneAndUpdate({ companyId, isDeleted: false }, params, {
      new: true,
    })
    return company
  } catch (error) {
    console.log(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}

export const deleteCompany = async (companyId: string) => {
  try {
    if (!companyId)
      throw {
        code: 500,
        message: "Invalid companyId",
        error: "Invalid companyId",
      }

    // mark isDeleted as true
    const company = await CompanyModel.findOne({ companyId })
    if (!company) {
      throw {
        code: 500,
        message: "Invalid companyId",
        error: "Invalid companyId",
      }
    }

    company.isDeleted = true

    const updated_at = new Date()

    company.updated_at = updated_at

    await company.save()

    return company
  } catch (error) {
    console.log(error)
    throw {
      code: 500,
      message: error,
      error,
    }
  }
}
