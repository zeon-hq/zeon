import { Button, Menu, Select, rem } from "@mantine/core";
import {
  capitalizeFirstLetter,
  getReadableDate,
} from "components/utils/utilFunctions";
import PanelLabel from "components/widget/PanelLabel";
import {
  ActionText,
  ExpenseFilterContainer,
  ExpenseItem,
  ExpenseListFooter,
  ExpenseListFooterText,
  ExpenseListingContainer,
  FlexBox,
  SingleExpenseContainer,
  Status,
} from "finance/styles";
import { IExpenseDTO } from "finance/type";
import useFinance from "finance/useFinance";
import React, { useEffect } from "react";
import { FiDelete } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { setCreateMode, setSelectedExpense } from "reducer/financeSlice";
import { Settings, SignLeft } from "tabler-icons-react";
import channelCreate from "assets/channelCreate.svg";
import { IoIosArrowDown } from "react-icons/io";
import { camelCase } from "lodash";
import { LuArrowDownUp } from "react-icons/lu";

type Props = {};

const ExpenseListing = (props: Props) => {
  const { expenseList, selectedExpense, paidAmount, unpaidAmount } =
    useFinance();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sort, setSort] = React.useState("asc"); // Add the correct type for sort
  const [filter, setFilter] = React.useState("all"); // Add the correct type for filter
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const onExpenseItemClick = (expense: IExpenseDTO) => {
    dispatch(setSelectedExpense(expense));
    dispatch(setCreateMode({
      attachedDocuments: [],
    }));
    navigate(`/finance/${workspaceId}?expenseId=${expense.expenseId}`);
  };

  const onFilterChange = (e: any) => {
    console.log(e);
    setFilter(e);
  };
  useEffect(() => {
    console.log(filter);
  }, [filter]);

  return (
    <ExpenseListingContainer>
      <ExpenseFilterContainer>
        <PanelLabel
          labelTitle="Expenses"
          icon={channelCreate}
          iconOnClick={() => {}}
          hideRightImage
        />
        <FlexBox
          style={{
            gap: "8px",
          }}
        >
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionText>
                Status: {capitalizeFirstLetter(filter)} <IoIosArrowDown />
              </ActionText>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                onClick={() => {
                  onFilterChange("all");
                }}
              >
                All
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  onFilterChange("paid");
                }}
              >
                Paid
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  onFilterChange("unpaid");
                }}
              >
                Unpaid
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <LuArrowDownUp
            onClick={() => {
              setSort(sort === "asc" ? "desc" : "asc");
            }}
            color="#3054b9"
          />
        </FlexBox>
      </ExpenseFilterContainer>
      <SingleExpenseContainer>
        {expenseList
          ?.filter((item: IExpenseDTO) => {
            if (filter === "all") {
              return true;
            } else {
              return item.status === filter;
            }
          })
          ?.sort((a: IExpenseDTO, b: IExpenseDTO) => {
            if (sort === "asc") {
              return a.paymentDate > b.paymentDate ? 1 : -1;
            } else {
              return a.paymentDate < b.paymentDate ? 1 : -1;
            }
          })
          ?.map((item: IExpenseDTO) => {
            return (
              <>
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
                        width: "100%",
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
              </>
            );
          })}
      </SingleExpenseContainer>
      <ExpenseListFooter>
        <ExpenseListFooterText
          style={{
            borderRight: "1px solid #e0e0e0",
            flex: 1,
          }}
        >
          Paid: {paidAmount} <br />
        </ExpenseListFooterText>
        <ExpenseListFooterText
          style={{
            flex: 1,
          }}
        >
          Unpaid: {unpaidAmount} <br />
        </ExpenseListFooterText>
      </ExpenseListFooter>
    </ExpenseListingContainer>
  );
};

export default ExpenseListing;
