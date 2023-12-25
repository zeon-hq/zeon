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


const financeApiDomain = 'http://localhost:4001';
const ticketDomainUrl = Config('TICKET_SERVICE');


export async function getAllCategories() {
  try {
    const res = await axiosInstance.get(`${financeApiDomain}/category`);
    return res.data;
  } catch (error) {
    return {};
  }
}

export async function createExpense(data: IExpenseDTO) {
  try {
    const res = await axiosInstance.post(`${financeApiDomain}/expense`, data);
    return res.data;
  } catch (error) {
    return {};
  }
}

export const getAllExpenses = async (workspaceId: string) => {
  try {
    const res = await axiosInstance.get(`${financeApiDomain}/expense/${workspaceId}`);
    return res.data;
  } catch (error) {
    return {};
  }
}

export const deleteExpense = async (expenseId: string) => {
  try {
    const res = await axiosInstance.delete(`${financeApiDomain}/expense/${expenseId}`);
    return res.data;
  } catch (error) {
    return {};
  }
}

export const getWorkspaceFinanceInfo = async (workspaceId: string) => {
  try {
    const res = await axiosInstance.get(`http://localhost:4001/${workspaceId}`);
    return res.data;
  } catch (error) {
    return {};
  }
}
