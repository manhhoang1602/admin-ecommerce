import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../modules/login/LoginSlice'

export const store = configureStore({
  reducer: {
    loginReducer: loginReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
