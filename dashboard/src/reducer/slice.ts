import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IMessage } from "components/details/inbox/inbox.types";
import { ChronologyName, FilterName, IWorkSpaceSettings, SubFilterName } from "components/types";
import { fetchUserInfo } from "service/CoreService";
import {
  fetchDashboardInfo,
  getAllMessages
} from "service/DashboardService";

/**
 * The idea is : On the initial load of the website, we will load the initial state in the reducer and
 * along with it make an call to backend to fetch all the data of the user and its workspace.
 * The format in the which data should come can be found from initialState.
 *x
 * Corresponding Interfaces should be refereed while sending the payload.
 */

export type InChatWidgetInterfaceKeys =
  | "topLogo"
  | "title"
  | "subTitle"
  | "link";

export interface InChatWidgetInterface {
  topLogo: string;
  title: string;
  subTitle: string;
  link: string;
  enabled: boolean;
}

export enum MessageType {
    SENT = "sent",
    RECEIVED = "received",
    NOTE = "NOTE"
}

/**
 * here, key is the channel name.
 * Info related to all the channel should come as an object. For ex. if there are three channels:
 * namely : support, sales, general, then the response should come as :
 *
 * channelsInfo : {
 *  support : { ...allInfo},
 *  sales: {...allInfo},
 *  general: {...allInfo}
 * }
 */

export interface ChannelsInfo {
  [key: string]: {
    integration: {
      script: string;
    };
    appearance: {
      widgetButtonSetting: {
        widgetButtonColor: string;
        widgetLogo: string;
      };
      widgetHeaderSection: {
        topBannerColor: string;
        topLogo: string;
        mainHeading: string;
        subHeading: string;
        textColor: "black" | "white";
        strokeColor: "light" | "dark" | "none";
      };
      newConversationButton: {
        buttonColor: string;
        title: string;
        subTitle: string;
        textColor: "black" | "white";
      };
      miscellaneous: {
        showBranding: boolean;

      };
      userAvatars: {
        enableUserAvatars: boolean;
        userAvatarsLinks: {
          link: string, 
          enabled: boolean
        }[];
        additonalUserAvatars: string
      }
    };
    behavior: {
      widgetBehavior: {
        collectUserEmail: boolean;
        title: string;
        subTitle: string;
        emailTitle: string;
        emailSubTitle: string;
        placeholderTextForEmailCapture: string;
        placeholderTextForMessageCapture: string;
        autoReply: string;
        agentName: string;
        agentProfilePic: string;
      };
      avatarSetting: {
        avatarType: "team" | "user";
      };
      operatingHours: {
        enableOperatingHours: boolean;
        hideNewConversationButtonWhenOffline: boolean;
        hideWidgetWhenOffline: boolean;
        timezone: string;
        operatingHours: {
          to: Date;
          from: Date;
        };
        autoReplyMessageWhenOffline: string;
      };
    };
    inChatWidgets: InChatWidgetInterface[];
    name: string;
    channelId: string;
    slackChannelId?: string;
    isAIEnabled?: boolean;
    accessToken?: string;
    members: string[];
    emailNewTicketNotification?: boolean;
  };
}

export interface IUpdateDashboardAction {
  value: string | boolean | { to: Date; from: Date };
  type: "appearance" | "behavior";
  subType:
    | "widgetButtonSetting"
    | "widgetHeaderSection"
    | "newConversationButton"
    | "widgetBehavior"
    | "avatarSetting"
    | "inChatWidgets"
    | "miscellaneous"
    | "operatingHours"
    | "userAvatars";
  key:
    | "widgetButtonColor"
    | "widgetLogo"
    | "mainHeading"
    | "subHeading"
    | "topBannerColor"
    | "topLogo"
    | "buttonColor"
    | "title"
    | "subTitle"
    | "collectUserEmail"
    | "emailTitle"
    | "emailSubTitle"
    | "placeholderTextForEmailCapture"
    | "autoReply"
    | "avatarType"
    | "textColor"
    | "strokeColor"
    | "showBranding"
    | "agentName"
    | "agentProfilePic"
    | "enableOperatingHours"
    | "hideNewConversationButtonWhenOffline"
    | "hideWidgetWhenOffline"
    | "timezone"
    | "operatingHours"
    | "autoReplyMessageWhenOffline"
    | "enableUserAvatars"
    | "userAvatarsLinks";
}

export interface ICannedResponse {
  title: string,
  message: string,
  _id: string
}

export interface Invoice {
  date: string;
  status: "paid" | "unpaid";
  link: string;
}

export interface Admin {
  name: string;
  email: string;
}

export interface ISelectedPage {
  type: "detail" | "channel" | "loading";
  name: string;
  channelId?:string;
}

/**
 * "_id": "652ed482a84f55c5cb1b738f",
            "email": "kaushalendra@zorp.one",
            "workspaceId": "yurrfi",
            "roleId": "admin",
            "inviteId": "dh6qq5",
            "isRejected": false,
            "isAccepted": false,
            "__v": 0,
            "workspaceName": "gfg",
            "roleName": "Admin"
 */

            export interface IInviteRes {
              _id: string,
              email: string,
              workspace: IWorkspace,
              roleId: string,
              inviteId: string,
              isRejected: boolean,
              isAccepted: boolean,
              __v: number,
              workspaceName: string,
              roleName: string
            }

export interface IWorkspace {
  
    signupDetails: {
      "signupMode": string,
      "isVerified": boolean
    },
    _id: string,
    workspaceId: string,
    workspaceName: string,
    primaryContactName: string,
    primaryContactEmail: string,
    isDeleted: boolean;
    subscriptionInfo: any
  
}

export interface IUser {
  email: string;
  name: string;
  workspaceId: string;
  userId: string;
  roleId?: string | undefined;
  status?: string;  
  module?: string;  
  profilePic?:string;
  role?:string;
}

export interface ITicket {
  messages: any[];
  _id: string;
  workspaceId: string;
  channelId: string;
  customerEmail: string;
  createdAt: number;
  updatedAt: number;
  text: string;
  isOpen: boolean;
  type: string;
  socketId: string;
}

export interface IInbox {
  messages: any[];
  _id: string;
  workspaceId: string;
  channelId: string;
  customerEmail: string;
  createdAt: number;
  updatedAt: number;
  text: string;
  ticketId:string;
  isOpen: boolean;
  type: string;
  socketId: string;
  assignedUser: string;
  assignedUserInfo: IUser | undefined;
  source : string;
  hasNewMessage : number;
}

export interface IChannel {
  name: string;
  channelId: string;
}


export type DashboardInterface = {
  channel: IChannel[];
  channelsInfo: ChannelsInfo;
  invoices: Invoice[];
  admins: Admin[];
  referralLink: string;
  editedChannelsInfo: ChannelsInfo;
  selectedPage: ISelectedPage;
  defaultWorkSpaceSettingTab: IWorkSpaceSettings;
  loading: boolean;
  workspaces: IWorkspace[];
  user: IUser;
  workspaceInfo: IWorkspaceInfo;
  showSidebar:boolean;
  inbox: {
    allConversations: IInbox[];
    selectedFilter: FilterName; // show all, open, close
    selectedSubFilter: SubFilterName; // show all, assign, un-assign
    selectedChronology: ChronologyName; // recent, oldest
    ticketFilterText: string;
  };
  activeChat: IInbox | null;
};

export interface IWorkspaceInfo {
  owner: any;
  admins: any[];
  members: any[];
  stripeCustomerId?: string;
  workspaceId: string;
  logo?:string;
  timezone?:string;
  workspaceName: string;
  subscriptionStatus: string;
  openTickets: number;
  closedTickets: number;
  months: any[];
  workspaceConfig?:any;
  subscriptionEndDate: number | undefined;
  subscriptionStartDate: number | undefined;
  subscriptionInfo: any;
  trialSubscriptionStartDate: number | undefined;
trialSubscriptionEndDate : number | undefined;
allUsers : any[];
}

const initialState: DashboardInterface = {
  channel: [],
  showSidebar:true,
  inbox: {
    allConversations: [],
    selectedFilter: FilterName.SHOW_ALL,
    selectedSubFilter: SubFilterName.SHOW_ALL,
    selectedChronology: ChronologyName.RECENT,
    ticketFilterText: ''
  },
  channelsInfo: {},
  invoices: [],
  admins: [],
  referralLink: "",
  editedChannelsInfo: {},
  selectedPage: {
    type: "detail",
    name: "inbox",
  },
  defaultWorkSpaceSettingTab: IWorkSpaceSettings.PROFILE,
  loading: false,
  workspaces: [],
  user: {
    userId:"",
    email: "",
    name: "",
    workspaceId: "",
    roleId: ""
  },
  workspaceInfo: {
    owner: {},
    admins: [],
    members: [],
    workspaceId: "",
    workspaceName: "",
    subscriptionStatus: "",
    subscriptionEndDate: undefined,
    subscriptionStartDate: undefined,
    trialSubscriptionStartDate: undefined,
    trialSubscriptionEndDate : undefined,
    openTickets: 0,
    closedTickets: 0,
    months: [],
    subscriptionInfo: {},
    allUsers : []
  },
  activeChat: null
};

const getFirstLoadInfo = async (workspaceId: string) => {
  try {
    let response = {};
    // Run all promises concurrently
    const [dashboardInfo, userInfo, allConversations]:any[] = await Promise.all([
      fetchDashboardInfo(workspaceId),
      fetchUserInfo(workspaceId),
      getAllMessages(workspaceId)
    ]);

    let workspaceInfo =
      userInfo.payload?.user?.teams?.filter(
        (team: any) => team._id === workspaceId
      )[0] || {};

    workspaceInfo.openTickets = 0;
    workspaceInfo.closedTickets = 0;

    const monthsPayload = Object.keys({}).map(
      (month: string) => ({
        label: month,
        value: 0,
      })
    );

    workspaceInfo.months = monthsPayload;
    workspaceInfo.subscriptionInfo = {};

    response = { ...dashboardInfo.payload,workspaceInfo:{...workspaceInfo, ...dashboardInfo.payload}, user:{...userInfo.user},conversations:allConversations?.data?.tickets || [] };
    return response;
  } catch (error) {
    return { ...initialState };
  }
};

export const initDashboard = createAsyncThunk(
  "dashboard/init",
  async (workspaceId: string) => {
    try {
      const response = await getFirstLoadInfo(workspaceId);
      return response;
    } catch (error) {
      return await new Promise<any>((resolve, reject) => {
        resolve({ initialState });
      });
    }
  }
);

export const updateInbox = createAsyncThunk(
  "dashboard/updateInbox",
  async (workspaceId: string) => {
    try {
      const response:any = await getAllMessages(workspaceId);
      return response.data.tickets;
    } catch (error) {
      return await new Promise<any>((resolve, reject) => {
        resolve([]);
      });
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedPage: (state, action: PayloadAction<ISelectedPage>) => {
      state.selectedPage = { ...action.payload };
    },
    updateDashboardSetting: (
      state,
      action: PayloadAction<IUpdateDashboardAction>
    ) => {
      // TODO: Find a better way to do it.
      //@ts-ignore
      state.channelsInfo[state.selectedPage.name][action.payload.type][
        action.payload.subType
      ][action.payload.key] = action.payload.value;
    },
    updateUserAvatarsVisibility: (
      state,
      action: PayloadAction<{ index:number, value: boolean }>
    ) => {
      state.channelsInfo[state.selectedPage.name].appearance.userAvatars.userAvatarsLinks[action.payload.index].enabled = action.payload.value;
    },
    updateEmailTicketCreateNotification: (
      state,
      action: PayloadAction<{ emailNewTicketNotification: boolean }>
    ) => {
      state.channelsInfo[state.selectedPage.name].emailNewTicketNotification = action.payload.emailNewTicketNotification;
    },
    updateIsAIEnabled: (
      state,
      action: PayloadAction<{ isAIEnabled: boolean, channelId:string }>
    ) => {
      state.channelsInfo[action.payload.channelId].isAIEnabled = action.payload.isAIEnabled;
    },
    updateSlackTicketNotification: (
      state,
      action: PayloadAction<{ slackChannelId: string, accessToken:string }>
    ) => {
      state.channelsInfo[state.selectedPage.name].slackChannelId = action.payload.slackChannelId;
      state.channelsInfo[state.selectedPage.name].accessToken = action.payload.accessToken;
    },
    addInChatWidget: (state, action: PayloadAction<InChatWidgetInterface>) => {
      state.channelsInfo[state.selectedPage.name].inChatWidgets.push(
        action.payload
      );
    },
    enableInChatWidget: (state, action: PayloadAction<{ index: number,value:boolean }>) => {
      state.channelsInfo[state.selectedPage.name].inChatWidgets[action.payload.index].enabled = action.payload.value;
    },
    updateSingleInChatWidget: (state, action: PayloadAction<{ index: number,value:string,key:string }>) => {
      // @ts-ignore
      state.channelsInfo[state.selectedPage.name].inChatWidgets[action.payload.index][action.payload.key] = action.payload.value;
    },
    updateInChatWidget: (
      state,
      action: PayloadAction<{
        data: string;
        property: InChatWidgetInterfaceKeys;
        index: number;
      }>
    ) => {
      state.channelsInfo[state.selectedPage.name].inChatWidgets[
        action.payload.index
      ][action.payload.property] = action.payload.data;
    },
    deleteInChatWidget: (state, action: PayloadAction<{ index: number }>) => {
      state.channelsInfo[state.selectedPage.name].inChatWidgets.splice(
        action.payload.index,
        1
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setShowSidebar: (state, action: PayloadAction<boolean>) =>{
      state.showSidebar = action.payload;
    },
    setWorkspaces: (state, action: PayloadAction<IWorkspace[]>) => {
      state.workspaces = action.payload;
    },
    setSelectedFilter: (state, action: PayloadAction<FilterName>) => {
      state.inbox.selectedFilter = action.payload;
    },
    setSelectedSubFilter: (state, action: PayloadAction<SubFilterName>) => {
      state.inbox.selectedSubFilter = action.payload;
    },
    setSelectedChronology: (state, action: PayloadAction<ChronologyName>) => {
      state.inbox.selectedChronology = action.payload;
    },
    setTicketFilterText: (state, action: PayloadAction<ChronologyName>) => {
      state.inbox.ticketFilterText = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<IInbox | null>) => {
      state.activeChat = action.payload;
    },
    setDefaultWorkSpaceSettingTab: (state, action:PayloadAction<IWorkSpaceSettings>) => {
      state.defaultWorkSpaceSettingTab = action.payload;
    },
    setNewConversation:(state, action: PayloadAction<IInbox>) => {
      state.inbox.allConversations.push(action.payload)
    },
    updateConversation:(state, action: PayloadAction<{data:IMessage, type:MessageType}>) => {
      const conversation = state.inbox.allConversations.find((conversation) => conversation?.ticketId === action.payload.data.ticketId)
      if(conversation){
        if(action.payload.type ===  MessageType.SENT) conversation.hasNewMessage = conversation.hasNewMessage ? conversation.hasNewMessage + 1 : 1
        conversation.messages.push({...action.payload.data, type: action.payload.type})
      }

      // check if active chat is the same as the conversation, if yes update that as well
      if (state.activeChat?.ticketId === action.payload.data.ticketId) { 
        state.activeChat.messages.push({...action.payload.data, type: action.payload.type})
      }
    },
    setNewMessageToFalse:(state, action: PayloadAction<string>) => {
      const conversation = state.inbox.allConversations.find((conversation) => conversation.ticketId === action.payload)
      if (conversation) {
        conversation.hasNewMessage = 0
      }
    },
    updateAssignedUser: (state, action: PayloadAction<{ticketId:string, assignedUser:string, assignedUserInfo:IUser|undefined}>) => {
      const conversation = state.inbox.allConversations.find((conversation) => conversation.ticketId === action.payload.ticketId)
      if (conversation) {
        conversation.assignedUser = action.payload.assignedUser
        conversation.assignedUserInfo = action.payload.assignedUserInfo
      }

      // check if active chat is the same as the conversation, if yes update that as well
      if(state.activeChat?.ticketId === action.payload.ticketId) {
        state.activeChat.assignedUser = action.payload.assignedUser
        state.activeChat.assignedUserInfo = action.payload.assignedUserInfo
      }
    
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(initDashboard.fulfilled, (state, action) => {
        state.channel = action.payload.channelsInfo.channels;
        state.channelsInfo = action.payload.channelsInfo;
        state.invoices = action.payload.invoice;
        state.admins = action.payload.admins;
        state.referralLink = action.payload.referralLink;
        state.user = action.payload.user;
        state.workspaceInfo = action.payload.workspaceInfo;
        state.loading = false;
        state.inbox.allConversations = [...action.payload.conversations.reverse()]
        const allUsers = action.payload.allUsers
        state.workspaceInfo.allUsers = allUsers
      })
      .addCase(updateInbox.pending, () => {

      })
      .addCase(updateInbox.fulfilled, (state, action) => {
        state.inbox.allConversations = [...action.payload.reverse()]
      })
  },
});

// Action creators are generated for each case reducer function
export const {
  setWorkspaces,
  setSelectedPage,
  updateDashboardSetting,
  addInChatWidget,
  updateInChatWidget,
  deleteInChatWidget,
  setLoading,
  setSelectedFilter,
  setSelectedSubFilter,
  setSelectedChronology,
  setActiveChat,
  setNewMessageToFalse,
  setNewConversation,
  updateConversation,
  updateAssignedUser,
  setTicketFilterText,
  setShowSidebar,
  updateEmailTicketCreateNotification,
  updateIsAIEnabled,
  setDefaultWorkSpaceSettingTab,
  updateSlackTicketNotification,
  updateUserAvatarsVisibility,
  enableInChatWidget,
  updateSingleInChatWidget
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
