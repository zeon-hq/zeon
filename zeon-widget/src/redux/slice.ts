import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { MessageType } from "components/chat/Chat.types";
import { isEqual } from "lodash";

export enum IUIStepType  {
  INITIAL = "initial",
  FORM  = "FORM",
  CHAT = "CHAT"
}

export enum IMessageSource {
  DASHBOARD = "dashboard",
  BOTH = "both",
  WIDGET = "widget"
}

export interface Message {
  message: string;
  type: MessageType;
  time?: string;
}

/**
 * allOpenCoversation will be an object with key as an unique id and value as an array of messages
 */

export interface IAllOpenConversations {
  // [key: string]: Message[];
  [key: string]: any;
}

export type WidgetInterface = {
  step: IUIStepType;
  email: String;
  messages: Array<Message> | [];
  showWidget: boolean;
  formSubmitButtonLoading: boolean;
  typing: boolean;
  widgetDetails: IWidgetDetails,
  allOpenConversations: IAllOpenConversations[]
};

export interface InChatWidgetInterface {
  topLogo: string;
  title: string;
  subTitle: string;
  link: string;

}

export interface IWidgetDetails  {
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
      textColor:"black" | "white";
    };
    miscellaneous: {
      showBranding: boolean;
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
      },
      autoReplyMessageWhenOffline: string;

    }
    
  };
  inChatWidgets: InChatWidgetInterface[];
  channelId: string;
  typing:boolean;
  workspaceId: string
  _id: string;
}

const initialState: WidgetInterface = {
  step: IUIStepType.INITIAL,
  email: "",
  messages: [],
  showWidget: false,
  formSubmitButtonLoading: false,
  //@ts-ignore
  widgetDetails: {},
  typing:false,
  allOpenConversations: []
};

export const widgetSlice = createSlice({
  name: "widget",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<IUIStepType>) => {
      state.step = action.payload;
    },
    setEmail: (state, action: PayloadAction<String>) => {
      state.email = action.payload;
    },
    setMessage: (state, action: PayloadAction<any>) => {
      if (!isEqual(action.payload, state.messages)) {
        if (Array.isArray(action.payload)) {
          if (action.payload.length === 0){
            state.messages = [];
          } else {
            state.messages = [...state.messages, ...action.payload];
          }
        } else {
          state.messages = [...state.messages, action.payload];
        }
      }
    },
    clearPrevChat: (state) => {
      state.messages = []
    },
    setShowWidget: (state, action: PayloadAction<boolean>) => {
      state.showWidget = action.payload;
    },
    setFormSubmitButtonLoadingState: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.formSubmitButtonLoading = action.payload;
    },
    setWidgetDetails: (state, action: PayloadAction<IWidgetDetails>) => {
      state.widgetDetails = action.payload;
    },
    setAllOpenConversations: (state, action: PayloadAction<any>) => {
      state.allOpenConversations = action.payload;
    },    
    setTyping: (state, action: PayloadAction<any>) => {
      state.typing = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  setStep,
  setEmail,
  setMessage,
  setShowWidget,
  setFormSubmitButtonLoadingState,
  setWidgetDetails,
  setAllOpenConversations,
  clearPrevChat,
  setTyping
} = widgetSlice.actions;

export default widgetSlice.reducer;
