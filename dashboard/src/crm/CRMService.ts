import axios, { AxiosRequestConfig } from "axios";
import { getConfig as Config } from "config/Config";
import { getAuthToken } from "util/dashboardUtils";
import { ICreateNoteDTO, IDeleteNoteDTO } from "./type"


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

export const createNote = async (data: ICreateNoteDTO) => {
    try {
        const res = await axiosInstance.post(`${crmAPIDomain}/notes`, data);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const deleteNote = async (data: IDeleteNoteDTO) => {
    try {
        const res = await axiosInstance.delete(`${crmAPIDomain}/notes/${data.noteId}`,{
          data
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}
