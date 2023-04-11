import { Baservices, IApiResponse } from '../../services/Basevices'
import { IResDetailApprove, IResListApproveMenu } from './ApproveMenuInterfaces'
import Config from '../../services/Config'

export const getListApproveApi = (arg: {
  page: number
  search: string
  status: number | undefined
  startDate: string
  endDate: string
  isGetAll?: boolean
}): Promise<IApiResponse<IResListApproveMenu>> => {
  let path: string = `/admin/approve/list-approve?page=${arg.page}`

  if (!arg.isGetAll) {
    path = path + `&limit=${Config._limit}`
  }
  if (arg.search.trim()) {
    path = path + `&search=${arg.search}`
  }
  if (arg.status !== undefined) {
    path = path + `&status=${arg.status}`
  }

  if (arg.startDate && arg.endDate) {
    path = path + `&startDate=${arg.startDate}&endDate=${arg.endDate}`
  }

  return Baservices.getMethod(path)
}

export const getDetailApproveMenuApi = (id: number, page: number): Promise<IApiResponse<IResDetailApprove>> => {
  return Baservices.getMethod(`/admin/approve/detail-approve/${id}?page=${page}`)
}

export const putChangeStatusApproveMenuApi = (id: number, reqData: { status: number; note?: string }) => {
  return Baservices.putMethod(`/admin/approve/${id}`, reqData)
}
