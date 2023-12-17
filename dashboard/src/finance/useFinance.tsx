import { useSelector } from "react-redux";
import { RootState } from "store";

type Props = {};

const useFinance = () => {
  const finance = useSelector((item: RootState) => item.finance);
  const expenseList = finance.expense.expenseList;
  const selectedExpense = finance.expense.selectedExpense;
  return {
    expenseList,
    selectedExpense,
  };
};

export default useFinance;
