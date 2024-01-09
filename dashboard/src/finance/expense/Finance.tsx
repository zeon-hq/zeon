import React, { useEffect } from 'react'
import ExpenseListing from './ExpenseListing'
import ExpenseDetails from './ExpenseDetails'
import ExpenseDocument from './ExpenseDocument'
import { FinanceContainer } from 'finance/styles'
import useFinance from 'finance/useFinance'
import { useDispatch } from 'react-redux'
import { initFinance } from 'reducer/financeSlice'
import { useParams } from 'react-router'
import { AsyncThunkAction } from '@reduxjs/toolkit'
import useQuery from 'hooks/useQuery'

type Props = {}

//Entry component for finance module
const Finance = (props: Props) => {

    const dispatch = useDispatch()// Provide the correct type for dispatch
    const { workspaceId } = useParams<{ workspaceId?: string }>() // Make workspaceId optional
    const query = useQuery()
    const expenseId = query.get("expenseId")
    useEffect(() => {
      if (workspaceId) {
        if(expenseId) {
          //@ts-ignore
          dispatch(initFinance({workspaceId, selectedExpense: expenseId})) // Dispatch the initFinance action
        } else {
          //@ts-ignore
          dispatch(initFinance({workspaceId})) // Dispatch the initFinance action
        }
      }
    }, [dispatch, workspaceId]) // Add dependencies to the useEffect hook



  return (
   <FinanceContainer>
    <ExpenseListing />
    <ExpenseDetails/>
    <ExpenseDocument/>
   </FinanceContainer>
  )
}

export default Finance