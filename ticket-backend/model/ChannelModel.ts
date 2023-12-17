import { model, Schema, Model, Document } from "mongoose";
import mongoose from "mongoose";

export interface InChatWidgetInterface {
  topLogo: string;
  title: string;
  subTitle: string;
  link: string;
}

export interface IChannelsInfo {
  name: string[];
  appearance: {
    newConversationButton: {
      buttonColor: string;
      title: string;
      subTitle: string;
      textColor: "black" | "white";
    };
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
    miscellaneous: {
      showBranding: boolean;
    };
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
  workspaceId: string;
  slackChannelId:string;
  accessToken:string;
  members: string[];
  channelId: string;
  cannedResponses: string[];
}

const ChannelSchema: Schema = new Schema({
  name: { type: String, required: true },
  slackChannelId:{type:String},
  accessToken:{type:String},
  appearance: {
    newConversationButton: {
      buttonColor: { type: String, default: "#4C6EF5" },
      title: { type: String, default: "Start new Conversation" },
      textColor: { type: String, default: "white" },
      subTitle: {
        type: String,
        default:
          "We are here standing by to answer your queries. We reply within the hour.",
      },
    },
    widgetButtonSetting: {
      widgetButtonColor: { type: String, default: "#4C6EF5" },
      widgetLogo: { type: String, default: "" },
    },
    widgetHeaderSection: {
      topBannerColor: { type: String, default: "white" },
      topLogo: {
        type: String,
        default:
          "https://userstak-toplogo.fra1.digitaloceanspaces.com/logo.svg",
      },
      mainHeading: { type: String, default: "Hey There!" },
      subHeading: {
        type: String,
        default:
          "Ask us anything, or share your feedback. We’re here to help, no matter where you’re based in the world.",
      },
      textColor: { type: String, default: "black" },
      strokeColor: { type: String, default: "dark" },
    },
    miscellaneous: {
      showBranding: { type: Boolean, default: true },
    },
  },
  behavior: {
    widgetBehavior: {
      collectUserEmail: { type: Boolean, default: true },
      title: { type: String, default: "Start a New Conversation Right Now" },
      subTitle: {
        type: String,
        default:
          "Ask us anything, or share your feedback. We’re here to help, no matter where you’re based in the world.",
      },
      emailTitle: { type: String, default: "Enter your E-Mail" },
      emailSubTitle: {
        type: String,
        default:
          "Enter your e-mail so that you get a response both here and in your email in case you miss it.",
      },
      placeholderTextForEmailCapture: {
        type: String,
        default:
          "Enter your e-mail so that you get a response both here and in your email in case you miss it.",
      },
      placeholderTextForMessageCapture: {
        type: String,
        default: "Enter your Message here",
      },
      autoReply: {
        type: String,
        default: `You’ll get replies here and we might reach out to you via your e-mail:
        {useremail}`,
      },
      agentName: { type: String, default: "Agent" },
      agentProfilePic: { type: String, default: "" },
    },
    avatarSetting: {
      avatarType: { type: String, enum: ["team", "user"], default: "team" },
    },
    operatingHours: {
      enableOperatingHours: { type: Boolean, default: false },
      hideNewConversationButtonWhenOffline: { type: Boolean, default: false },
      hideWidgetWhenOffline: { type: Boolean, default: false },
      timezone: { type: String, default: "Asia/Kolkata" },
      operatingHours: {
        to: { type: Date, default: new Date() },
        from: { type: Date, default: new Date() },
      },
      autoReplyMessageWhenOffline: {
        type: String,
        default:
          "We are currently offline. Please leave a message and we will get back to you as soon as possible.",
      },
    },
  },
  inChatWidgets: [
    {
      topLogo: { type: String, default: "" },
      title: { type: String, default: "Title" },
      subTitle: { type: String, default: "This is the subtitle" },
      link: { type: String, default: "" },
    },
  ],
  workspaceId: { type:String, required: true },
  channelId: { type: String, required: true },
  cannedResponses: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CannedResponse", default:[] }
  ],
  members: [{ type: String, default: [] }],
});

export const ChannelModel: Model<any> = model("Channel", ChannelSchema);