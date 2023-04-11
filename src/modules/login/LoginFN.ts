import { IResLoginData } from './Interfaces'
import { logoutAPI } from './LoginAPI'
import Config from '../../services/Config'

export const setTokenLocalStorage = (token: string) => {
  localStorage.setItem(process.env.REACT_APP_TOKEN_NAME as string, token)
}

export const getUserInfo = (): IResLoginData => {
  return JSON.parse(localStorage.getItem('userInfo') as string) as IResLoginData
}

export const logout = async () => {
  const res = await logoutAPI()
  if (res.body.status === Config._statusSuccessCallAPI) {
    localStorage.removeItem(process.env.REACT_APP_TOKEN_NAME as string)
    window.location.href = '/'
  }
}
