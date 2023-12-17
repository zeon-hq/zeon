import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from "reducer/slice"
import financeReducer from "reducer/financeSlice"


export const store = configureStore({
  reducer:{
    dashboard:dashboardReducer,
    finance:financeReducer
  } 
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch