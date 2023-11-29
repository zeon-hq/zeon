import { configureStore } from '@reduxjs/toolkit'
import widgetReducer from "redux/slice"

export const store = configureStore({
  reducer:{
    widget:widgetReducer
  } 
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch