// create a finance slice using createSlice
// create a finance reducer using createReducer
import { getAllExpenses } from "../finance/FinanceService";
import {IExpense, IExpenseDTO, IFinance} from "../finance/type"
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState:IFinance = {
    expense: {
        expenseList: [],
        selectedExpense: null
    }
}

const getFirstLoadInfo = async (workspaceId: string) => {
    try {
        const response = await getAllExpenses(workspaceId);
        return response.expenses;
    } catch (error) {
        
    }
}

export const initFinance = createAsyncThunk(
    "finance/init",
    async ({workspaceId, selectedExpense=""}:{
        workspaceId: string;
        selectedExpense?: string;
    }) => {
      try {
        const response = await getFirstLoadInfo(workspaceId);
        if(selectedExpense) {
            return {
                expense : [...response],
                selectedExpense
            }
        }
        return {
            expense : [...response],
            selectedExpense: response[0]?.expenseId
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
        setSelectedExpense: (state, action: PayloadAction<IExpenseDTO>) => {
            state.expense.selectedExpense = action.payload;
        }
    },
    extraReducers: (builder) => { 
        builder
        .addCase(initFinance.fulfilled, (state, action) => {
            state.expense.expenseList = action.payload.expense;
            if(action.payload.selectedExpense) {
                // get the selected expense
                const selectedExpenseDetails = action.payload.expense.find((expense: IExpenseDTO) => expense.expenseId === action.payload.selectedExpense);
                state.expense.selectedExpense = selectedExpenseDetails || null;
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

export const { setExpenseList, setSelectedExpense } = financeSlice.actions;

export default financeSlice.reducer;
