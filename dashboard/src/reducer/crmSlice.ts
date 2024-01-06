import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCompany } from "service/CRMService";

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

const getComapnyInfo = async (companyId: string) => {
  try {
    const res = await fetchCompany(companyId);
    return res.data
  } catch (error) {
    return {}
  }
}

export const initCompanyData = createAsyncThunk(
  "finance/init",
  async ({companyId}:{
      companyId: string;
  }) => {
    try {
      const response:any = await getComapnyInfo(companyId);
      return {
        ...response
      }
    } catch (error) {
      return await new Promise<any>((resolve, reject) => {
        resolve({ initialState });
      });
    }
  }
);


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
  extraReducers: (builder) => { 
    builder
    .addCase(initCompanyData.fulfilled, (state, action) => {
        // state.selectedCompanyPage = action.payload;
    })
    .addCase(initCompanyData.rejected, (state, action) => {
        
    })
    .addCase(initCompanyData.pending, (state, action) => {
        
    })
}
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
