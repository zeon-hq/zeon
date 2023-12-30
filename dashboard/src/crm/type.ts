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