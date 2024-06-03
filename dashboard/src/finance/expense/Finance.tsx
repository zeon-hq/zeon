import { useEffect } from 'react'
import ExpenseListing from './ExpenseListing'
import ExpenseDetails from './ExpenseDetails'
import { FinanceContainer } from 'finance/styles'
import { useDispatch } from 'react-redux'
import { initFinance } from 'reducer/financeSlice'
import { useLocation, useNavigate, useParams } from 'react-router'
import useQuery from 'hooks/useQuery'

//Entry component for finance module
const Finance = () => {

    const dispatch = useDispatch()// Provide the correct type for dispatch
    const { workspaceId } = useParams<{ workspaceId?: string }>() // Make workspaceId optional
    const query = useQuery()
    const expenseId = query.get("expenseId")
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
      // if url has no searchParams filter, set filter to all
      if(!query.get("filter")) {
        query.set("filter", "all")
      }

       // Navigate to the new URL with the updated query parameters
        navigate({
          pathname: location.pathname,
          search: '?' + query.toString()
        });
      
    },[]) //eslint-disable-line

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
    }, [dispatch, workspaceId]) //eslint-disable-line



  return (
   <FinanceContainer>
    <ExpenseListing />
    <ExpenseDetails/>
    {/* <ExpenseDocument/> */}
   </FinanceContainer>
  )
}

export default Finance