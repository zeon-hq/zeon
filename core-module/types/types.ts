import { UserInterface } from "../schema/User";
import { Request } from "express";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  phone?: {
    countryCode: { type: String; required: false };
    num: { type: String; required: false };
  };
  roleId?: string;
  workspaceId?: string;
}

export interface CreateWorkspaceDTO {
  workspaceName: string;
  primaryContactName: string;
  primaryContactEmail: string;
  signupDetails: {
    signupMode: string;
    isVerified: boolean;
  };
  modules: ZeonModulesArray;
  legalCompanyName?: string;
  teamSize?: string;
  industry?: string;
}

export enum ZeonModules {
  CHAT = "CHAT",
  CRM = "CRM",
  FINANCE = "FINANCE",
  KNOWLEDGE_BASE = "KNOWLEDGE_BASE",
}

export type ZeonModulesArray = Array<
  (typeof ZeonModules)[keyof typeof ZeonModules]
>;

export interface CreateRoleDTO {
  name: string;
  description: string;
  workspaceId: string;
  roleId?: string;
}

export interface ZeonError {
  code: number;
  message: string;
  error: string;
}

export interface CreateInviteDTO {
  email: string;
  workspaceId: string;
  roleId: string;
}

export interface AcceptInviteDTO {
  inviteId: string;
  isAccepted: boolean;
}

/**
 * {
  "email": "test@example.com",
  "attributes": {
    "FNAME": "Ajay",
    "LNAME": "Mtest"
  },
  "emailBlacklisted": false,
  "smsBlacklisted": false,
  "listIds": [
    7
  ],
  "updateEnabled": false
}
 */

// convert this to interface
export interface ISignupBody {
  email: string;
  attributes: {
    FIRSTNAME: string;
    LASTNAME: string;
  };
  emailBlacklisted: boolean;
  smsBlacklisted: boolean;
  listIds: Array<number>;
  updateEnabled: boolean;
}

/**
 * {  
   "to":[  
      {  
         "email":"ajay@zorp.one",
         "name":"Ajay M"
      }
   ],
   "templateId":25,
   "params":{  
      "inviter":"John",
      "workspacename":"skynet",
      "invitelink":"zeonhq.com/io"
   }
}
 */

// export this to interface
export interface IForgetPasswordBody {
  to: [email: string, name: string];
  templateId: number;
  params: {
    inviter: string;
    workspaceName: string;
    inviteLink: string;
  };
}

/**
 * {  
   "to":[  
      {  
         "email":"ajay@zeonhq.com",
         "name":"Ajay M"
      }
   ],
   "templateId":23,
   "params":{  
      "firstname":"John",
      "resetlink":"zeonhq.com/ko"
   }
}
 */

// export this to interface
export interface IResetPasswordBody {
  to: [email: string, name: string];
  templateId: number;
  params: {
    firstname: string;
    resetLink: string;
  };
}

/**
 * {
  "email": "test@example.com",
  "attributes": {
    "FNAME": "Ajay",
    "LNAME": "Mtest"
  },
  "emailBlacklisted": false,
  "smsBlacklisted": false,
  "listIds": [
    7
  ],
  "updateEnabled": false
}
 */

// export this to interface
export interface IAddContactBody {
  email: string;
  attributes: {
    FIRSTNAME: string;
    LASTNAME: string;
  };
  emailBlacklisted: boolean;
  smsBlacklisted: boolean;
  listIds: Array<number>;
  updateEnabled: boolean;
}

export enum CRMResourceType {
  CONTACT = "CONTACT",
  COMPANY = "COMPANY",
}

export enum NoteType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export interface ICreateNoteDTO {
  content: string;
  resourceType: CRMResourceType;
  resourceId: string;
  noteType: NoteType;
  user: UserInterface;
  source: string;
}

export interface IUpdateNoteDTO {
  noteId: string;
  content: string;
  userId: string;
  resourceId: string;
  resourceType: CRMResourceType;
  
}

export interface IDeleteNoteDTO {
  noteId: string;
  userId: string;
  resourceId: string;
  resourceType: CRMResourceType;
}

export interface IGetNotesDTO {
  resourceId: string;
  resourceType: CRMResourceType;
  page: number;
  limit: number;
  userId: string;
}

/**
 * {
"content" : "This is a note",
 "created_at" : "2020-12-12T00:00:00.000Z",
  "source" : "comppany" | "contact" | "deal" | "lead" | "pipeline"
  "created_by" : "user_id"
 "noteId" : "note_id",
  "isDeleted" : false
  }
 */

export interface INote {
  content: string;
  createdAt: Date;
  source: string;
  createdBy: UserInterface;
  noteId: string;
  isDeleted: boolean;
  noteType: NoteType;
}

export interface IAdditionalDatafields {
    name : string;
    label: string;
    type: IDatafieldType
}

export enum IDatafieldType  {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  DATE = "DATE",
  BOOLEAN = "BOOLEAN",
  SINGLE_SELECT = "SINGLE_SELECT",
  MULTI_SELECT = "MULTI_SELECT",
  CURRENCY = "CURRENCY",
  EMAIL = "EMAIL",
  USER = "USER",
}

export interface IInviteUserBody {
  to: [{ email: string }];
  templateId: number;
  params: {
    inviter: string;
    workspacename: string;
    invitelink: string;
  };
}

export interface UserWorkspaceRelationDTO {
  userId: string;
  workspaceId: string;
  roleId: string;
  isActive: boolean;
  isDeleted: boolean;
}

export enum ZeonServices {
  CORE = "CORE",
  CRM = "CRM",
  FINANCE = "FINANCE",
  CHAT = "CHAT",
  TICKET = "TICKET",
}

export interface ZLoggerInput {
  service ?: ZeonServices;
  message: string;
  error ?: any;
  payload ?: any;
  type ?: "INFO" | "WARN" | "ERROR";
  user ?: UserInterface;
}
