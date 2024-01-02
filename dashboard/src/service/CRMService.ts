import axios, { AxiosRequestConfig } from "axios";
import { getConfig as Config } from "config/Config";
import { getAuthToken } from "util/dashboardUtils";
let axiosInstance = axios.create({
  /*...*/
  // add header Authoriation with Bearer and token
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(function (
  config: AxiosRequestConfig
): AxiosRequestConfig {
  config.headers!.Authorization = `Bearer ${getAuthToken()}`;
  return config;
});

// const apiDomainUrl = Config('CORE_API_DOMAIN');
const apiDomainUrl = "http://localhost:3005";

export async function fetchCompanies(
  workspaceId: string,
  limit?: string,
  offset?: string
) {
  try {
    let _limit = limit || "100";
    let _offset = offset || "0";

    const res = await axiosInstance.get(
      `${apiDomainUrl}/workspaces/${workspaceId}/companies?limit=${_limit}&offset=${_offset}`
    );
    return res.data;
  } catch (error) {
    console.log(`[fetchCompanies] error: ${error}`);
    return {};
  }
}

export async function deleteCompany(companyId: string) {
  try {
    const res = await axiosInstance.delete(
      `${apiDomainUrl}/companies/${companyId}`
    );
    return res.data;
  } catch (error) {
    console.log(`[deleteCompany] error: ${error}`);
    return {};
  }
}

export async function createCompany(data: any) {
  try {
    const res = await axiosInstance.post(`${apiDomainUrl}/companies`, data);
    return res.data;
  } catch (error) {
    console.log(`[createCompany] error: ${error}`);
    return {};
  }
}

export async function editCompany(companyId: string, data: any) {
  try {
    const res = await axiosInstance.put(
      `${apiDomainUrl}/companies/${companyId}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log(`[editCompany] error: ${error}`);
    return {};
  }
}

export async function fetchAllCompaniesPair(workspaceId: string) {
  try {
    const res = await axiosInstance.get(
      `${apiDomainUrl}/companies/${workspaceId}/all`
    );
    return res.data;
  } catch (error) {
    console.log(`[fetchAllCompaniesPair] error: ${error}`);
    return {};
  }
}

export async function fetchContacts(
  workspaceId: string,
  limit?: string,
  offset?: string
) {
  try {
    let _limit = limit || "100";
    let _offset = offset || "0";

    const res = await axiosInstance.get(
      `${apiDomainUrl}/workspaces/${workspaceId}/contacts?limit=${_limit}&offset=${_offset}`
    );
    return res.data;
  } catch (error) {
    console.log(`[fetchContacts] error: ${error}`);
    return {};
  }
}

export async function createContact(data: any) {
  try {
    const res = await axiosInstance.post(`${apiDomainUrl}/contacts`, data);
    return res.data;
  } catch (error) {
    console.log(`[createContact] error: ${error}`);
    return {};
  }
}

export async function editContact(contactId: string, data: any) {
  try {
    const res = await axiosInstance.put(
      `${apiDomainUrl}/contacts/${contactId}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log(`[editContact] error: ${error}`);
    return {};
  }
}

export async function deleteContact(contactId: string) {
  try {
    const res = await axiosInstance.delete(
      `${apiDomainUrl}/contacts/${contactId}`
    );
    return res.data;
  } catch (error) {
    console.log(`[deleteContact] error: ${error}`);
    return {};
  }
}