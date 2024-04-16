import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  ICoreServiceUserProfileUpdatePayload,
  IWorkspaceInfoUpdatePayload,
} from "components/types";
import { getConfig as Config } from "config/Config";
import { getAuthToken } from "util/dashboardUtils";

const coreAPIDomain = Config("CORE_API_DOMAIN");
const ticketAPIDomain = Config("TICKET_SERVICE");

let axiosInstance = axios.create({
  /*...*/
  // add headers
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

axiosInstance.interceptors.request.use(function (
  config: AxiosRequestConfig
): AxiosRequestConfig {
  config.headers!.Authorization = `Bearer ${getAuthToken()}`;
  return config;
});

// if response is 401 try to refresh token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("at");
      window.location.href = "/login";
      return Promise.reject(error);
    }
  }
);

export async function fetchUserInfo(workspaceId: string) {
  try {
    const res: AxiosResponse = await axiosInstance.get(
      `${coreAPIDomain}/user/workspace/${workspaceId}`
    );
    return res.data;
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error?.response?.data?.error);
  }
}

export async function injestFile(injestPdfPayload: any) {
  
  try {
    const res: AxiosResponse = await axiosInstance.post(`${coreAPIDomain}/ai/injest-file`,injestPdfPayload);
    return res.data;
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error?.response?.data?.error);
  }
}

export const sendMessageAPI = async (data:any)=>{
  const res:any = await axios.post(`${ticketAPIDomain}/send/message`, data);
  return res
}

export const login = async (email: string, password: string) => {
  try {
    const loginPayload = { email, password };
    const res: AxiosResponse = await axios.post(
      `${coreAPIDomain}/auth/login`,
      loginPayload
    );

    localStorage.setItem("at", res.data.at);
    //@ts-ignore
    axiosInstance.defaults.headers.Authorization = `Bearer ${res.data.at}`;
    return res.data;
  } catch (error: any) {
    return Promise.reject(error?.response?.data?.error || error?.message);
  }
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  phone: {
    countryCode: string;
    num: string;
  }
) => {
  try {
    const res: AxiosResponse = await axiosInstance.post(
      `${coreAPIDomain}/auth/signup`,
      {
        name,
        email,
        password,
        phone,
      }
    );
    localStorage.setItem("at", res.data.at);
    //@ts-ignore
    axiosInstance.defaults.headers.Authorization = `Bearer ${res.data.at}`;
    return res.data;
  } catch (error: any) {
    return Promise.reject(error?.response?.data?.error);
  }
};

export const getWorkspaces = async () => {
  try {
    const res: AxiosResponse = await axiosInstance.get(
      `${coreAPIDomain}/workspaces`
    );
    return res.data;
  } catch (error: any) {
    return Promise.reject(error?.response?.data?.error);
  }
};

export const sendForgetPasswordEmail = async (email: string) => {
  try {
    const res: AxiosResponse = await axiosInstance.post(
      `${coreAPIDomain}/auth/forgot-password`,
      {
        email,
      }
    );
    return res.data;
  } catch (error: any) {
    return Promise.reject(error?.response?.data?.error);
  }
};

export const updatePassword = async ({
  password,
  token,
  email,
}: {
  password: string;
  token: string;
  email: string;
}) => {
  try {
    const res: AxiosResponse = await axiosInstance.post(
      `${coreAPIDomain}/auth/reset-password`,
      {
        password,
        token,
        email
      }
    );
    return res.data;
  } catch (error: any) {
    return Promise.reject(error?.response?.data?.error);
  }
};

export const createWorkspace = async ({
  workspaceName,
  modules,
  legalCompanyName,
  teamSize,
  industry,
}: {
  workspaceName: string;
  modules?: string[];
  legalCompanyName: string;
  teamSize: string;
  industry: string;
}) => {
  try {
    const res: AxiosResponse = await axiosInstance.post(
      `${coreAPIDomain}/workspaces`,
      {
        workspaceName,
        modules,
        legalCompanyName,
        teamSize,
        industry,
      }
    );
    return res.data;
  } catch (error: any) {
    return Promise.reject(error?.response?.data?.error);
  }
};

export async function inviteUserToWorkspace({
  email,
  workspaceId,
  roleId,
}: {
  email: string;
  workspaceId: string;
  roleId?: string;
}) {
  try {
    const res: AxiosResponse = await axiosInstance.post(
      `${coreAPIDomain}/user/invite`,
      {
        email,
        workspaceId,
        roleId,
      }
    );
    return res.data;
  } catch (error: any) {
    return Promise.reject(error?.response?.data?.error);
  }
}

export const changeUserRole = async (userId: string, role: string) => {
  try {
    const res: AxiosResponse = await axiosInstance.put(
      `${coreAPIDomain}/user/${userId}`,
      {
        roleId: role,
      }
    );
    return res.data;
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error?.response?.data?.error);
  }
};

export const getRolesForWorkspace = async (workspaceId: string) => {
  try {
    const res: AxiosResponse = await axiosInstance.get(
      `${coreAPIDomain}/workspaces/${workspaceId}/roles`
    );
    return res.data;
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error?.response?.data?.error);
  }
};

export const bulkInviteUserToWorkspace = async (invites: any[]) => {
  try {
    const res: AxiosResponse = await axiosInstance.post(
      `${coreAPIDomain}/user/invite/bulk`,
      {
        invites,
      }
    );
    return res;
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error?.response?.data?.error);
  }
};

export const getUserInvites = async () => {
  try {
    const res: AxiosResponse = await axiosInstance.get(
      `${coreAPIDomain}/user/invites`
    );
    return res.data;
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error?.response?.data?.error);
  }
};

export const changeUserInvitedStatus = async (inviteId: string) => {
  try {
    const res: AxiosResponse = await axiosInstance.put(
      `${coreAPIDomain}/user/invite/change`,
      {
        inviteId,
        isAccepted: false,
      }
    );
    return res;
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error?.response?.data?.error);
  }
};

export const changeInviteStatus = async (
  inviteId: string,
  isAccepted: boolean
) => {
  try {
    const res: AxiosResponse = await axiosInstance.put(
      `${coreAPIDomain}/user/invite/change`,
      {
        isAccepted,
        inviteId,
      }
    );
    return res.data;
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error?.response?.data?.error);
  }
};

export const updateUserWorkSpaceInformation = async (
  userInformationUploadApi: ICoreServiceUserProfileUpdatePayload,
  workSpaceId: string,
  userId: string
) => {
  try {
    const res: AxiosResponse = await axiosInstance.put(
      `${coreAPIDomain}/user/${userId}/workspace/${workSpaceId}`,
      userInformationUploadApi
    );
    return res.data;
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error?.response?.data?.error);
  }
};

export const updateWorkSpaceInformation = async (
  workSpaceInformationUploadApi: IWorkspaceInfoUpdatePayload,
  workSpaceId: string
) => {
  try {
    const res: AxiosResponse = await axiosInstance.put(
      `${coreAPIDomain}/workspaces/${workSpaceId}`,
      workSpaceInformationUploadApi
    );
    return res.data;
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error?.response?.data?.error);
  }
};

export const deleteWorkSpaceUser = async (
  userId: string,
  workSpaceId: string
): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axiosInstance.delete(
      `${coreAPIDomain}/user/${userId}/workspace/${workSpaceId}`
    );
    return res;
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error?.response?.data?.error);
  }
};

export const fetchAllInviteUsers = async (workspaceId: string) => {
  try {
    const res: AxiosResponse = await axiosInstance.get(
      `${coreAPIDomain}/workspaces/${workspaceId}/invites`
    );
    return res.data;
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error?.response?.data?.error);
  }
};

export const getCRMDetailsMinimal = async (workspaceId: string) => {
  try {
    const res = await axiosInstance.get(
      `${coreAPIDomain}/workspaces/${workspaceId}/minimal/crmDetails`
    );
    return res.data;
  } catch (error) {
    return {};
  }
}

export const getKnowledgeBaseList = async (workspaceId: string, channelId:string) => {
  try {
    const res = await axiosInstance.get(
      `${coreAPIDomain}/ai/get-uploaded-files/${channelId}/${workspaceId}`
    );
    return res.data;
  } catch (error) {
    return {};
  }
}

export const deleteKnowledgeBaseFile = async (fileId: string, workspaceId:string, channelId:string) => {
  try {
    const res = await axiosInstance.delete(
      `${coreAPIDomain}/ai/delete-file/${fileId}/${channelId}/${workspaceId}`
    );
    return res.data;
  } catch (error) {
    return {};
  }
}