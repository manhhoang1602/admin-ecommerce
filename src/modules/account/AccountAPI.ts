import { Baservices, IApiResponse } from '../../services/Basevices'
import Config from '../../services/Config'
import { IReqChangePass, IReqPostAccount, IReqPutAccount, IResListAccount } from './AccountInterface'
import { DEFINE_STATUS_ACCOUNT } from './Account'
import { IResBody } from '../../services/Interfaces'

export const getListAccountApi = (
  page: number,
  role: number,
  status: number,
  search: string,
  limit: number = Config._limit
): Promise<IApiResponse<IResListAccount>> => {
  let path: string = `/admin/user/list?page=${page}&limit=${limit}`
  if (role) {
    path = path + `&role=${role}`
  }
  if (status !== DEFINE_STATUS_ACCOUNT.ALL) {
    path = path + `&status=${status}`
  }
  if (search.trim()) {
    path = path + `&search=${search.trim()}`
  }
  return Baservices.getMethod(path)
}

export const deleteAccountApi = (id: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.deleteMethod(`/admin/user/delete/${id}`)
}

export const putResetAccountApi = (id: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/user/reset-pass/${id}`)
}

export const putStatusAccountApi = (id: number, status: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/user/update/${id}`, { status: status })
}

export const putAccountApi = (id: number, reqData: IReqPutAccount): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/user/update/${id}`, reqData)
}

export const postAccountApi = (reqData: IReqPostAccount): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/user/register`, reqData)
}

export const putChangePassAPI = (reqData: IReqChangePass): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/auth/change-password`, reqData)
}
