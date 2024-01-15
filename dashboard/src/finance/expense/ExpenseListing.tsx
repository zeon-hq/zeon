import { Button, Menu, Select, rem } from "@mantine/core"
import {
  capitalizeFirstLetter,
  getReadableDate,
} from "components/utils/utilFunctions"
import PanelLabel from "components/widget/PanelLabel"
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
} from "finance/styles"
import { IExpenseDTO } from "finance/type"
import useFinance from "finance/useFinance"
import React, { useEffect, useState } from "react"
import { FiDelete } from "react-icons/fi"
import { useDispatch } from "react-redux"
import { useParams, useNavigate, useLocation } from "react-router"
import { setCreateMode, setSelectedExpense } from "reducer/financeSlice"
import { Settings, SignLeft } from "tabler-icons-react"
import channelCreate from "assets/channelCreate.svg"
import { IoIosArrowDown } from "react-icons/io"
import { camelCase } from "lodash"
import { LuArrowDownUp } from "react-icons/lu"
import useQuery from "hooks/useQuery"
import Loader from "components/ui-components/Loader"
import NotFound from "components/ui-components/NotFound"

type Props = {}

const ExpenseListing = (props: Props) => {
  const { expenseList, selectedExpense, paidAmount, unpaidAmount, vendorInfo } =
    useFinance()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sort, setSort] = React.useState("asc") // Add the correct type for sort
  // const query = useQuery()
  // const currFilter = query.get("filter") || ""
  // const [filter, setFilter] = React.useState(() => {
  //   if(query.get("filter")) {
  //     const curFilter = query.get("filter") || ""
  //     if(["paid", "unpaid"].includes(curFilter)) {
  //       return curFilter
  //     } else {
  //       return "all"
  //     }
  //   } else {
  //     return "all"
  //   }
  // }); // Add the correct type for filter
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const filterParam = query.get("filter")
  const initialFilter = filterParam ? filterParam : "all"
  const [filter, setFilter] = useState(initialFilter)
  const { workspaceId } = useParams<{ workspaceId: string }>()

  const onExpenseItemClick = (expense: IExpenseDTO) => {
    dispatch(setSelectedExpense(expense))
    dispatch(
      setCreateMode({
        attachedDocuments: [],
      })
    )
    navigate(
      `/finance/${workspaceId}?expenseId=${expense.expenseId}&filter=${
        filter || "all"
      }`
    )
  }

  const onFilterChange = (filter: string) => {
    // Create a URL object with the current URL
    const url = new URL(window.location.href)

    // Get the current query parameters
    const params = new URLSearchParams(url.search)

    // Set the 'filter' parameter
    params.set("filter", filter)

    // Update the URL with the new query parameters
    url.search = params.toString()

    // Use the 'history' object to navigate to the new URL
    navigate(url.pathname + url.search)

    console.log(filter)
    setFilter(filter)
  }

  useEffect(() => {
    console.log(filter)
  }, [filter])

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    setFilter(query.get("filter") || "all")
  }, [location.search])

  useEffect(() => {
    // if url has no searchParams filter, set filter to all
    if (!query.get("filter")) {
      navigate(`/finance/${workspaceId}?filter=all`, { replace: true })
    }
  }, [])

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
                  onFilterChange("all")
                  // add filter to query params
                }}
              >
                All
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  onFilterChange("paid")
                }}
              >
                Paid
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  onFilterChange("unpaid")
                }}
              >
                Unpaid
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <LuArrowDownUp
            onClick={() => {
              setSort(sort === "asc" ? "desc" : "asc")
            }}
            color="#3054b9"
          />
        </FlexBox>
      </ExpenseFilterContainer>
      <SingleExpenseContainer>
        {expenseList?.length === 0 ? (
          <NotFound message="No expenses found" />
        ) : (
          <>
            {expenseList
              ?.filter((item: IExpenseDTO) => {
                if (filter === "all") {
                  return true
                } else {
                  return item.status === filter
                }
              })
              ?.sort((a: IExpenseDTO, b: IExpenseDTO) => {
                if (sort === "asc") {
                  return a.paymentDate > b.paymentDate ? 1 : -1
                } else {
                  return a.paymentDate < b.paymentDate ? 1 : -1
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
                          {
                            vendorInfo[item.vendor] ? (
                              <p> {vendorInfo[item.vendor]?.name || `${vendorInfo[item.vendor]?.firstName} ${vendorInfo[item.vendor]?.lastName}`  || item.vendor} </p>
                            ) : (
                              <p> {item.vendor} </p>
                            )
                          }
                          
                          <p>
                            {" "}
                            {item.totalAmount.currency} {item.totalAmount.value}
                          </p>
                        </FlexBox>
                      </div>

                      <p> {getReadableDate(item.paymentDate)}</p>
                    </ExpenseItem>
                  </>
                )
              })}
          </>
        )}
      </SingleExpenseContainer>
      <ExpenseListFooter>
        <ExpenseListFooterText
          style={{
            borderRight: "1px solid #e0e0e0",
            flex: 1,
            color: "green"
          }}
        >
          Paid: {paidAmount} <br />
        </ExpenseListFooterText>
        <ExpenseListFooterText
          style={{
            flex: 1,
            color: "red"
          }}
        >
          Unpaid: {unpaidAmount} <br />
        </ExpenseListFooterText>
      </ExpenseListFooter>
    </ExpenseListingContainer>
  )
}

export default ExpenseListing
