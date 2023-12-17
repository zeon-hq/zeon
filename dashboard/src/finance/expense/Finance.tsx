import React from 'react'
import ExpenseListing from './ExpenseListing'
import ExpenseDetails from './ExpenseDetails'
import ExpenseDocument from './ExpenseDocument'
import { FinanceContainer } from 'finance/styles'

type Props = {}

//Entry component for finance module
const Finance = (props: Props) => {
  return (
   <FinanceContainer>
    <ExpenseListing />
    <ExpenseDetails/>
    <ExpenseDocument/>
   </FinanceContainer>
  )
}

export default Finance