// create a finance slice using createSlice
// create a finance reducer using createReducer
import { getWorkspaceFinanceInfo } from "../finance/FinanceService";
import {ICreateModeExpense, IExpenseDTO, IFinance} from "../finance/type"
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState:IFinance = {
    expense: {
        expenseList: [],
        selectedExpense: null,
        createMode: null,
        inCreateMode: false,
        
    },
    categories: [],
    tags: [],
    vendorInfo: null
}

const getFirstLoadInfo = async (workspaceId: string) => {
    try {
        const expenseResponse = await getWorkspaceFinanceInfo(workspaceId);
        return expenseResponse;
    } catch (error) {
        
    }
}

export const initFinance = createAsyncThunk(
    "finance/init",
    async ({workspaceId, selectedExpense="",inCreateMode=true}:{
        workspaceId: string;
        selectedExpense?: string;
        inCreateMode?: boolean;
    }) => {
      try {
        const response = await getFirstLoadInfo(workspaceId);
        if(selectedExpense) {
            return {
                ...response,
                selectedExpense,
                inCreateMode
            }
        }
        return {
            ...response,
            selectedExpense: response[0]?.expenseId,
            inCreateMode
        }
      } catch (error) {
        return await new Promise<any>((resolve, reject) => {
          resolve({ initialState });
        });
      }
    }
);

export const financeSlice = createSlice({
    name: 'finance',
    initialState,
    reducers: {
        setExpenseList: (state, action: PayloadAction<IExpenseDTO[]>) => {
            state.expense.expenseList= action.payload;
            state.expense.selectedExpense = action.payload[0] || null;
        },
        setSelectedExpense: (state, action: PayloadAction<IExpenseDTO | null>) => {
            state.expense.selectedExpense = action.payload;
        },
        setCreateMode: (state, action: PayloadAction<ICreateModeExpense>) => {
            state.expense.createMode = action.payload;
            state.expense.inCreateMode = true;
        },
        updatedSelectedExpense: (state, action: PayloadAction<{
            key: string;
            value: any;
        }>) => {
            // @ts-ignore
            state.expense.selectedExpense[action.payload.key] = action.payload.value;
        }
    },
    extraReducers: (builder) => { 
        builder
        .addCase(initFinance.fulfilled, (state, action) => {
            state.expense.expenseList = action.payload.expenses;
            state.categories = action.payload.categories;
            state.tags = action.payload.tags;
            state.vendorInfo = action.payload.vendorInfo
            if(action.payload.selectedExpense) {
                // get the selected expense
                const selectedExpenseDetails = action.payload.expenses.find((expense: IExpenseDTO) => expense.expenseId === action.payload.selectedExpense);
                state.expense.selectedExpense = selectedExpenseDetails || null;
            } else {
                state.expense.createMode = {
                    attachedDocuments: []
                }
                state.expense.inCreateMode = action.payload.inCreateMode;
            }
        })
        .addCase(initFinance.rejected, (state, action) => {
            state.expense.expenseList = []
        })
        .addCase(initFinance.pending, (state, action) => {
            state.expense.expenseList = []
        })
    }
})

export const { setExpenseList, setSelectedExpense,updatedSelectedExpense,setCreateMode } = financeSlice.actions;
export default financeSlice.reducer;

