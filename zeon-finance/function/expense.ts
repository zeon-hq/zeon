import Expense from "../schema/expense";

export const getAllExpenses = async ({
    workspaceId
}:{
    workspaceId: string
}) => {
    try {
        const expenses = await Expense.find({ workspaceId, isDeleted: false })
        return expenses;
    }
    catch (error) {
        console.error("Error getting expenses by workspace ID:", error);
        throw error;
    }
}