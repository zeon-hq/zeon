import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from "reducer/slice"
import financeReducer from "reducer/financeSlice"
import crmReducer from "reducer/crmSlice"

export const store = configureStore({
  reducer:{
    dashboard:dashboardReducer,
    finance:financeReducer,
    crm: crmReducer,
  } 
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch