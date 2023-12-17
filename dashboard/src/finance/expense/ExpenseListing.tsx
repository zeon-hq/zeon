import { getReadableDate } from "components/utils/utilFunctions";
import {
  ExpenseItem,
  ExpenseListingContainer,
  FlexBox,
  Status,
} from "finance/styles";
import { IExpenseDTO } from "finance/type";
import useFinance from "finance/useFinance";
import React from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { setSelectedExpense } from "reducer/financeSlice";

type Props = {};

const ExpenseListing = (props: Props) => {
  const { expenseList, selectedExpense } = useFinance();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const onExpenseItemClick = (expense: IExpenseDTO) => {
    dispatch(setSelectedExpense(expense));
    navigate(`/finance/${workspaceId}?expenseId=${expense.expenseId}`);
  };

  return (
    <ExpenseListingContainer>
      {expenseList?.map((item: IExpenseDTO) => {
        return (
          <ExpenseItem
            onClick={() => onExpenseItemClick(item)}
            selected={selectedExpense?.expenseId === item.expenseId}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Status status={item.status} />
              <FlexBox
                style={{
                  width: "100%"
                }} 
              >
                <p> {item.vendor} </p>
                <p>
                  {" "}
                  {item.totalAmount.currency} {item.totalAmount.value}
                </p>
              </FlexBox>
            </div>

            <p> {getReadableDate(item.paymentDate)}</p>
          </ExpenseItem>
        );
      })}
    </ExpenseListingContainer>
  );
};

export default ExpenseListing;
