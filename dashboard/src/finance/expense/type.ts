export interface IExpense {
    title: string;
    status: "paid" | "unpaid" | "cancel"
    date: string;
    amount: number;
}