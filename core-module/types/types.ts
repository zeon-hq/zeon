import { UserInterface } from "../schema/User"
import {Request} from "express"

export interface CreateUserDTO {
    name: string
    email: string
    password: string
    phone ?: {
        countryCode: { type: String, required: false },
        num: { type: String, required: false }
    }
    roleId ?: string
    workspaceId ?: string
}

export interface CreateWorkspaceDTO {
    workspaceName: string
    primaryContactName: string
    primaryContactEmail: string
    signupDetails : {
        signupMode: string
        isVerified: boolean
    }
    modules: ZeonModulesArray
    legalCompanyName ?: string
    teamSize ?: string
    industry ?: string

}

export enum ZeonModules {
    CHAT = "CHAT",
    CRM = "CRM",
    FINANCE = "FINANCE",
    KNOWLEDGE_BASE = "KNOWLEDGE_BASE"
}

export type ZeonModulesArray = Array<typeof ZeonModules[keyof typeof ZeonModules]>;

export interface CreateRoleDTO {
    name: string
    description: string
    workspaceId: string
    roleId ?: string
}

export interface ZeonError {
    code: number
    message: string
    error: string
}

export interface CreateInviteDTO {
    email: string
    workspaceId: string
    roleId: string
}

export interface AcceptInviteDTO {
    inviteId: string,
    isAccepted: boolean
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
    email: string,
    attributes: {
        FIRSTNAME: string,
        LASTNAME: string
    },
    emailBlacklisted: boolean,
    smsBlacklisted: boolean,
    listIds: Array<number>,
    updateEnabled: boolean
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
    to:[
        email : string,
        name: string
    ],
    templateId: number
    params: {
        inviter: string,
        workspaceName: string,
        inviteLink: string
    }
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
    to:[
        email : string,
        name: string
    ],
    templateId: number
    params: {
        firstname: string,
        resetLink: string
    }
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
    email: string,
    attributes: {
        FIRSTNAME: string,
        LASTNAME: string
    },
    emailBlacklisted: boolean,
    smsBlacklisted: boolean,
    listIds: Array<number>,
    updateEnabled: boolean
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

export interface IInviteUserBody {
    to:[
        {email : string}
    ],
    templateId: number
    params: {
        inviter: string,
        workspacename: string,
        invitelink: string
    }
}

export interface UserWorkspaceRelationDTO {
    userId: string
    workspaceId: string
    roleId: string
    isActive: boolean
    isDeleted: boolean
}

