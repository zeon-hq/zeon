import axios, { AxiosRequestConfig } from "axios";
import { getConfig as Config } from "config/Config";
import { IInbox } from "reducer/slice";
import { getAuthToken } from "util/dashboardUtils";
import { IExpenseDTO } from "./type";

let axiosInstance = axios.create({
  /*...*/
  // add header Authoriation with Bearer and token
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.request.use(function (config: AxiosRequestConfig) : AxiosRequestConfig {
  config.headers!.Authorization =  `Bearer ${getAuthToken()}`;
  return config;
});


const financeApiDomain = Config("FINANCE_API_DOMAIN")
const ticketDomainUrl = Config('TICKET_SERVICE');


export async function getAllCategories() {
  try {
    const res = await axiosInstance.get(`${financeApiDomain}/category`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createExpense(data: IExpenseDTO) {
  try {
    const res = await axiosInstance.post(`${financeApiDomain}/expense`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateExpense({data, expenseId}:{data: IExpenseDTO, expenseId: string}) {
  try {
    const res = await axiosInstance.put(`${financeApiDomain}/expense/${expenseId}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const getAllExpenses = async (workspaceId: string) => {
  try {
    const res = await axiosInstance.get(`${financeApiDomain}/expense/${workspaceId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const deleteExpense = async (expenseId: string) => {
  try {
    const res = await axiosInstance.delete(`${financeApiDomain}/expense/${expenseId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const getWorkspaceFinanceInfo = async (workspaceId: string) => {
  try {
    const res = await axiosInstance.get(`${financeApiDomain}/${workspaceId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
