import { createSlice } from "@reduxjs/toolkit";

export interface ISelectedPage {
  type: "dashboard" | "contacts" | "companies";
  channelId?: string;
}

export interface ISelectedContactPage {
  type: "all" | "create" | "edit" | "view";
  contactData?: any;
  activeTab?: "interactions" | "notes" | "associated_lists";
}

export interface ISelectedCompanyPage {
  type: "all" | "create" | "edit" | "view";
  companyData?: any;
  activeTab?: "interactions" | "notes" | "associated_lists";
}

export interface ICRMState {
  selectedPage: ISelectedPage;
  selectedContactPage: ISelectedContactPage;
  selectedCompanyPage: ISelectedCompanyPage;
  loading: boolean;
  showNoteCreateModal: boolean;
  selectedNote: any;
  selectedResource: any;
}

const initialState: ICRMState = {
  selectedPage: {
    type: "dashboard",
  },
  selectedContactPage: {
    type: "all",
  },
  selectedCompanyPage: {
    type: "all",
  },
  loading: true,
  showNoteCreateModal: false,
  selectedNote: null,
  selectedResource: null,
};

export const crmSlice = createSlice({
  name: "crm",
  initialState,
  reducers: {
    setSelectedPage: (state, action) => {
      state.selectedPage = action.payload;
    },
    setSelectedContactPage: (state, action) => {
      state.selectedContactPage = action.payload;
    },
    setSelectedCompanyPage: (state, action) => {
      state.selectedCompanyPage = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setShowNoteCreateModal: (state, action) => {
      state.showNoteCreateModal = action.payload;
    },
    setSelectedNote: (state, action) => {
      state.selectedNote = action.payload;
    },
    setSelectedResource: (state, action) => {
      state.selectedResource = action.payload;
    },
  },
});

export const {
  setSelectedPage,
  setSelectedContactPage,
  setSelectedCompanyPage,
  setLoading,
  setShowNoteCreateModal,
  setSelectedNote,
  setSelectedResource,
} = crmSlice.actions;

export default crmSlice.reducer;
