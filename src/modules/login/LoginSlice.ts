import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IResLoginData } from './Interfaces'
import { loginAPI } from './LoginAPI'
import { Notification } from '../../commons/notification/Notification'
import { TOKEN_NAME } from '../../services/Basevices'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'

export interface IInitState {
  loading: { loadingLogin: boolean }
  resLogin?: IResLoginData
}

const initialState: IInitState = {
  resLogin: undefined,
  loading: { loadingLogin: false },
}

export const loginAction = createAsyncThunk(
  'login/loginAction',
  async (arg: { account: string; password: string }, thunkAPI) => {
    const res = await loginAPI({ phone: arg.account, password: arg.password })
    return res
  }
)

const loginSlice = createSlice({
  name: 'login',

  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginAction.pending, (state) => {
      state.loading = { ...state.loading, loadingLogin: true }
    })
    builder.addCase(loginAction.rejected, (state, action) => {
      state.loading = { ...state.loading, loadingLogin: false }
    })
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.loading = { ...state.loading, loadingLogin: false }
      state.resLogin = action.payload.body.data
      const storageLocalStorage = () => {
        localStorage.setItem(TOKEN_NAME, action.payload.body.data.token)
        localStorage.setItem('userInfo', JSON.stringify(action.payload.body.data))
      }
      storageLocalStorage()
      Notification.PushNotification('SUCCESS', 'Đăng nhập thành công')
      history.push(ADMIN_ROUTER.DASHBOARD.path)
    })
  },
})

const loginReducer = loginSlice.reducer

export default loginReducer
