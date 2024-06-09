import {ReactNode} from 'react'


export type ISelectType = {
    value: string;
    label: string;
  };

export enum IChannelTabsName {
    APPEARENCE = "Appearance",
    INTEGRATIONS = "Integrations",
    BEHAVIORS = "Behaviour",
    IN_CHAT_WIDGETS = "In-Chat Widgets",
    CHAT_LOGS = "Chat Logs & Contacts",
    INVOICES = "Invoices",
    REFERRALS = "Referrals",
    CANNED_RESPONSES = "Canned Responses",
    USER = "Users",
    KNOWLEDGE = "Knowledge",
    DEPLOYMENT = "Overview",
    Overview = "Overview",
}

export enum IWorkSpaceSettings {
    PROFILE = "Profile",
    ORGANIZATION = "Organization",
    MODULES = "Modules",
    BILLING = "Billing",
    USERS = "Users",
}

export enum RightPanelSettingName {
    INVITE_USER = "Invite User",
    PROFILE_SETTINGS = "Profile Settings",
    WORKSPACE_SETTING = "Workspace Setting",
    ROADMAP = "Roadmap",
    SLACK_COMMUNITY = "Discord Community",
    READ_NEWS_AND_BLOGS = "Read News and Blog",
    X_LINK = "X/Twitter",
    BLOG = "Blog",
    LOGOUT = "Logout",
} 

export type TabInfo = {
    name: IChannelTabsName | IWorkSpaceSettings,
    icon: ReactNode,
    active:boolean
}

export enum FilterName {
    SHOW_ALL = "showAll",
    SHOW_OPENED = "showOpened",
    SHOW_CLOSED = "showClosed",
}

export enum SubFilterName {
    SHOW_ALL = "showAll",
    SHOW_UNASSIGNED = "showUnassigned",
    SHOW_ASSIGNED = "showAssigned",
}

export enum ChronologyName {
    RECENT = "Recent",
    OLDEST = "Oldest",
}

export type ICoreServiceUserProfileUpdatePayload = {
    name?: string;
    roleId?: string;
    phone?: string;
    email?: string;
    profilePic?: string;
  };

  export type IWorkspaceInfoUpdatePayload = {
    workspaceName?: string;
    primaryContactName?: string;
    primaryContactEmail?: string;
    timezone?: string;
    logo?: string; // Assuming 'logo' is a string, you may need to adjust the type if it's different
    modules?: string[]; // 'modules' as a string array
  };