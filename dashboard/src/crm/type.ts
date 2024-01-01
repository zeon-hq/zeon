export interface ICreateContactDTO {
  first_nae: string;
  workspaceId: string;
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
  source: string;
}

export enum CompanySize {
  // 1-10
  MICRO = "micro",
  // 11-50
  SMALL = "small",
  // 51-200
  MEDIUM = "medium",
  // 201-500
  LARGE = "large",
  // 501-1000
  XLARGE = "xlarge",
  // 1001-5000
  XXLARGE = "xxlarge",
  // 5001-10000
  XXXLARGE = "xxxlarge",
  // 10000+
  SUPER = "super",
}

export enum CompanyWorth {
  // 0-1M
  MICRO = "micro",
  // 1M-10M
  SMALL = "small",
  // 10M-50M
  MEDIUM = "medium",
  // 50M-100M
  LARGE = "large",
  // 100M-500M
  XLARGE = "xlarge",
  // 500M-1B
  XXLARGE = "xxlarge",
  // 1B-5B
  XXXLARGE = "xxxlarge",
  // 5B-10B
  SUPER = "super",
  // 10B+
  MEGA = "mega",
}

export interface ContactEmail {
  em_id: number;
  email_id: string;
  is_primary: boolean;
}

export interface FormattedPhoneNumber {
  e164: string;
  national: string;
  international: string;
  country: string;
  countryCode: string;
  phone: string;
}

export interface ContactPhoneNumbers {
  pn_id: number;
  phone_number: FormattedPhoneNumber;
  is_primary: boolean;
}

export default interface Contacts {
  firstName: string;
  lastName: string;
  jobPosition?: string;
  linkedInUrl?: string;
  emailAddress?: ContactEmail[];
  phoneNumber?: ContactPhoneNumbers[];
  created_at: Date;
  updated_at: Date;
  workspaceId: string;
  isDeleted: boolean;
  notes?: INote[];
}

export interface INote {
  content: string;
  createdAt: Date;
  source: string;
  createdBy: string;
  noteId: string;
  isDeleted: boolean;
  noteType: NoteType;
}
