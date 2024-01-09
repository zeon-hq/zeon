import axios, { AxiosRequestConfig } from "axios";
import { getConfig as Config } from "config/Config";
import { IInbox } from "reducer/slice";
import { getAuthToken } from "util/dashboardUtils";
import { ICreateContactDTO, ICreateNoteDTO } from "./type"


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




const crmAPIDomain = Config("CORE_API_DOMAIN")
const ticketDomainUrl = Config('TICKET_SERVICE');

export const createContact = async (data: ICreateContactDTO) => {
    try {
        const res = await axiosInstance.post(`${crmAPIDomain}/contacts`, data);
        return res.data;
    } catch (error) {
        return {};
    }
}

export const createNote = async (data: ICreateNoteDTO) => {
    try {
        const res = await axiosInstance.post(`${crmAPIDomain}/notes`, data);
        return res.data;
    } catch (error) {
        return {};
    }
}
