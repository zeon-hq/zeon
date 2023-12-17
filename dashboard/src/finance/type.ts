export interface IFinance {
    expense: IExpense;
}

export interface IExpense {
    expenseList: IExpenseDTO[];
    selectedExpense: IExpenseDTO | null;
}

export interface IExpenseDTO {
    vendor: string;
    expenseId: string;
    amount: {
        currency: string;
        value: number;
    };
    invoiceDate: string;
    invoiceNumber: string;
    paymentDate: string;
    tax: {
        currency: string;
        value: number;
    };
    totalAmount: {
        currency: string;
        value: number;
    };
    tags : string[];
    categoryId: string;
    workspaceId: string;
    customerFields: [],
    status: string;
}