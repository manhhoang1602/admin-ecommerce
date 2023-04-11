import { Baservices, IApiResponse } from '../../services/Basevices'
import { IResLogin } from './Interfaces'
import { IResBody } from '../../services/Interfaces'

export const loginAPI = async (reqData: { phone: string; password: string }): Promise<IApiResponse<IResLogin>> => {
  return Baservices.putMethod(`/auth/login/web`, { ...reqData, device_id: '1602' })
}

export const logoutAPI = async (): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/auth/logout/web`)
}
