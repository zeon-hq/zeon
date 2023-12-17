export interface IExpense {
    title: string;
    status: "paid" | "unpaid" | "cancel"
    date: string;
    amount: number;
}

export interface IExpenseDTO {
    workspaceId: string;
    vendor: string;
    invoiceNumber: string;
    invoiceDate: Date;
    paymentDate: Date;
    amount: {
        currency: string;
        value: number;
    };
    tax: {
        currency: string;
        value: number;
    };
    category: string;
    tags: string[];
    categoryId: string;
    }