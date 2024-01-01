import express, { Express, Request, Response, Router } from "express";
import {
  createCompany,
  deleteCompany,
  editCompany,
  getAllCompanies,
  getAllCompaniesByPair,
  getCompany,
} from "../functions/company";
import { formatPhoneNumber } from "../utils/formatter";

export const createCompanyController = async (req: Request, res: Response) => {
  try {
    const company = await createCompany({
      ...req.body,
      phoneNumber: formatPhoneNumber(req.body?.phoneNumber),
    });
    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.log(error);
    throw {
      code: 500,
      message: error,
      error,
    };
  }
};

// get all companies from workspaceId
export const getAllCompaniesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { workspaceId } = req.params;
    const { limit, offset } = req.query;

    if (!workspaceId)
      throw {
        code: 500,
        message: "Invalid workspaceId",
        error: "Invalid workspaceId",
      };

    const { companies, total } = await getAllCompanies(
      workspaceId,
      limit as string,
      offset as string
    );
    return res.status(200).json({
      success: true,
      data: {
        companies,
        count: total,
      },
    });
  } catch (error) {
    console.log(error);
    throw {
      code: 500,
      message: error,
      error,
    };
  }
};

// get all companies with value label pair where value is companyId and label is companyName
export const getAllCompaniesValueLabelController = async (
  req: Request,
  res: Response
) => {

  try {
    const { workspaceId } = req.params;

    if (!workspaceId)
      throw {
        code: 500,
        message: "Invalid workspaceId",
        error: "Invalid workspaceId",
      };

    const companies = await getAllCompaniesByPair(workspaceId);

    return res.status(200).json({
      success: true,
      data: companies.map((company: any) => ({
        value: company.companyId,
        label: company.name,
      })),
    });
  } catch (error) {
    console.log(error);
    throw {
      code: 500,
      message: error,
      error,
    };
  }
};

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
    const { companyId } = req.params;
    if (!companyId)
      throw {
        code: 500,
        message: "Invalid companyId",
        error: "Invalid companyId",
      };

    const company = await getCompany(companyId);

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.log(error);
    throw {
      code: 500,
      message: error,
      error,
    };
  }
};

// edit company by companyId
export const editCompanyController = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!companyId)
      throw {
        code: 500,
        message: "Invalid companyId",
        error: "Invalid companyId",
      };

    const updatedCompany = await editCompany(companyId, {
      ...req.body,
      phoneNumber: formatPhoneNumber(req.body?.phoneNumber),
    });

    return res.status(200).json({
      success: true,
      data: updatedCompany,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

// delete company by companyId
export const deleteCompanyController = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    if (!companyId)
      throw {
        code: 500,
        message: "Invalid companyId",
        error: "Invalid companyId",
      };

    const company = await deleteCompany(companyId);
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    throw {
      code: 500,
      message: error,
      error,
    };
  }
};
// Bulk delete company by companyIs
export const bulkDeleteCompanyController = async (
  req: Request,
  res: Response
) => {};
