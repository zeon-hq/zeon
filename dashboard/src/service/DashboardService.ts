import axios, { AxiosRequestConfig } from "axios";
import { IInbox } from "reducer/slice";
import { getConfig as Config } from "config/Config";
import { getAuthToken } from "util/dashboardUtils";
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


const apiDomainUrl = Config('API_DOMAIN');
const ticketDomainUrl = Config('TICKET_SERVICE');

export async function integrateSlack(code: string, workspaceId:string, channelId:string) {
  // use axios as you normally do
  try {
    const res = await axiosInstance.post(`${apiDomainUrl}/channel/channel/slack`, {
      code,
      workspaceId,
      channelId
    });
  } catch (error) {
    console.log(error);
  }
}

// Regex to match valid link
const linkRegex = new RegExp(/^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+)\.([a-zA-Z0-9]+)(\/[a-zA-Z0-9]+)*\/?$/i);

export async function updateChannel(channelId: string, updatedData: any) {
  // use axios as you normally do
  try {
    const res = await axiosInstance.put(
      `${apiDomainUrl}/channel/${channelId}`,
      { updatedData }
    );
  } catch (error) {
    console.log(error);
  }
}


export async function fetchUserWorkspaces() {
  try {
    const res = await axiosInstance.get(`${apiDomainUrl}/user/teams`);
    return res.data;
  } catch (error) {
    return {};
  }
}

export async function createWorkspaceAPICall(workspaceName: string) {
  try {
    const res = await axiosInstance.post(`${apiDomainUrl}/team`, {
      teamName: workspaceName,
    });
    return res.data;
  } catch (error) {}
}

export async function fetchDashboardInfo(workspaceId: string) {
  try {
    const res = await axiosInstance.get(
      `${apiDomainUrl}/team/${workspaceId}`
    );
    return res.data;
  } catch (error) {}
}


export async function inviteUserToTheTeam({
  email,
  workspaceId,
  channelId
}: {
  email: string;
  workspaceId ?: string;
  channelId ?: string;
}) {
  try {
    const res = await axiosInstance.put(
      `${apiDomainUrl}/team/invite`,
      {
        email,
        workspaceId,
        channelId
      }
    );
    return res.data;
  } catch (error) {
    return {};
  }
}

export async function getStripeCheckout({
  // lookupKey,
  workspaceId,
  dashboardId
}:{ workspaceId:string, dashboardId:string }) {
  
  try {
    const res = await axiosInstance.post(
      `${apiDomainUrl}/create-customer-portal-session`,
      {
        // lookupKey: lookupKey,
        workspaceId,
        dashboardId
      }
    );
    return res.data;
  } catch (error) {
    return {};
  }
} 

export const uploadFile = async (file: any) => {
  try {
    const res = await axiosInstance.put(
      `${apiDomainUrl}/team/asset/upload-logo`,
      file,
    );
    return res.data;
  } catch (error) {
    return {};
  }
}

export const getAnalytics = async (workspaceId: string) => {
  try {
    const res = await axiosInstance.get(
      `${apiDomainUrl}/ticket/analytics/${workspaceId}`
    );
    // commented by sathithya yogi
    // for v1 we are removing the analytics from the UI
    return res.data;
    // return {};
  } catch (error) {
    return {};
  }
}

export const getAllMessages = (workspaceId: string):IInbox[] => {
  try {
    const res:any = axiosInstance.get(`${apiDomainUrl}/ticket/messages/${workspaceId}`)
    return res as IInbox[]
  } catch (error) {
    console.log(error)
    return []
  }
  
}

export const createChannel = (workspaceId: string, name: string) => {
  try {
    const res:any = axiosInstance.post(`${apiDomainUrl}/channel`,{
      workspaceId,
      name
    })
    return res
  } catch (error) {
    console.log(error)
    return []
  }
}

export const markAsResolved = (ticketId:string, isOpen:boolean) => {
  try {
    const res:any = axiosInstance.post(`${ticketDomainUrl}/ticket/status`,{
      ticketId,
      isOpen
    })
    return res as IInbox[]
  } catch (error) {
    console.log(error)
    return []
  }
}


export const subscribe = async (workspaceId:string,lookupKey:string) => {
  try {
    const res = await axiosInstance.post(
      `${apiDomainUrl}/team/create-checkout-session`, {
        workspaceId,
        lookupKey
      }
    );
    return res.data;
  } catch (error) {
    return {};
  }
}


export const changeRole = (workspaceId:string, userId:string, role:string) => {
  try {
    const res:any = axiosInstance.put(`${apiDomainUrl}/team/role`,{
      workspaceId,
      userId,
      role
    })
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getSubscriptionDetails = async (workspaceId:string) => {
  try {
    const res = await axiosInstance.get(
      `${apiDomainUrl}/team/${workspaceId}`
    );
    return res.data;
  } catch (error) {
    return {};
  }
}

export const assignUser = async (ticketId:string, userId:string, unassign=false) => {
  try {
    const res:any = await axiosInstance.post(`${apiDomainUrl}/ticket/assign`,{
      ticketId,
      userId,
      unassign
    })
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}


export const createCannedResponse = async (channelId:string,title:string,message:string) => {
  try {
    const res:any = await axiosInstance.post(`${apiDomainUrl}/channel/canned`,{
      channelId,
      title,
      message
    })
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}

export const deleteCannedResponse = async (cannedId:string) => {
  try {
    const res:any = await axiosInstance.delete(`${apiDomainUrl}/channel/canned/${cannedId}`)
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}

export const updateCannedResponse = async (cannedId:string,title:string,message:string) => {
  try {
    const res:any = await axiosInstance.post(`${apiDomainUrl}/channel/canned/update`,{
      cannedId,
      title,
      message
    })
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}


export const getCannedResponseFromChannelId = async (channelId:string) => {
  try {
    const res:any = await axiosInstance.get(`${apiDomainUrl}/channel/canned/${channelId}`)
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}

export const addUsersToChannel = async (channelId:string, userIds:string[]) => {
  try {
    console.log(">>>>",channelId,userIds)
    const res:any = await axiosInstance.post(`${apiDomainUrl}/channel/addUser`,{
      channelId,
      userIds
    })
    return res
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getChannelUsers = async (channelId:string) => {
  try {
    const res:any = await axiosInstance.get(`${apiDomainUrl}/channel/user/${channelId}`)
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}

export const removeUserFromChannel = async (channelId:string, userIds:string[]) => {
  try {
    const res:any = await axiosInstance.post(`${apiDomainUrl}/channel/removeUser`,{
      channelId,
      userIds
    })
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}



