import Config from '../../services/Config'
import { DEFINE_STATUS } from '../Constances'
import { Baservices, IApiResponse } from '../../services/Basevices'
import { IReqCombo, IResDetailCombo, IResListCombo } from './ComboProductInterface'
import { IResBody } from '../../services/Interfaces'

export const getListComboApi = (reqData: {
  page: number
  search: string
  status: number
  startDate: string
  endDate: string
  limit?: number
}): Promise<IApiResponse<IResListCombo>> => {
  let path: string = `/admin/combo/list?page=${reqData.page}&limit=${reqData.limit ? reqData.limit : Config._limit}`
  if (reqData.search.trim()) {
    path = path + `&search=${reqData.search.trim()}`
  }
  if (reqData.status === DEFINE_STATUS.INACTIVE || reqData.status === DEFINE_STATUS.ACTIVE) {
    path = path + `&status=${reqData.status}`
  }
  if (reqData.startDate) {
    path = path + `&startDate=${reqData.startDate}`
  }
  if (reqData.endDate) {
    path = path + `&endDate=${reqData.endDate}`
  }
  return Baservices.getMethod(path)
}

export const postComboApi = (reqData: IReqCombo): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/combo/create`, reqData)
}

export const putComboApi = (id: number, reqData: IReqCombo): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/combo/update/${id}`, reqData)
}

export const deleteComboApi = (id: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.deleteMethod(`/admin/combo/delete/${id}`)
}

export const putComboStatusApi = (id: number, status: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/combo/change-status/${id}`, { status: status })
}

export const getDetailComboApi = (id: number): Promise<IApiResponse<IResDetailCombo>> => {
  return Baservices.getMethod(`/admin/combo/detail/${id}`)
}
