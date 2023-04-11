import Config from '../../services/Config'
import { Baservices, IApiResponse } from '../../services/Basevices'
import { IReqCate, IResListCate } from './CategoryInterface'
import { IResBody } from '../../services/Interfaces'
import { DEFINE_STATUS_ACCOUNT } from '../account/Account'

export const getListCateApi = (
  page: number,
  search: string,
  status: number,
  startDate: string,
  endDate: string,
  limit: number = Config._limit
): Promise<IApiResponse<IResListCate>> => {
  let path: string = `/admin/category/list?page=${page}&limit=${limit}`
  if (search.trim()) {
    path = path + `&search=${search.trim()}`
  }
  if (status !== DEFINE_STATUS_ACCOUNT.ALL) {
    path = path + `&status=${status}`
  }
  if (startDate) {
    path = path + `&startDate=${startDate}`
  }
  if (endDate) {
    path = path + `&endDate=${endDate}`
  }
  return Baservices.getMethod(path)
}

export const postCategoryApi = (reqData: IReqCate): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/category/create`, reqData)
}

export const putCategoryApi = (id: number, reqData: IReqCate): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/category/update/${id}`, reqData)
}

export const deleteCategoryApi = (id: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.deleteMethod(`/admin/category/delete/${id}`)
}

export const putStatusCategoryApi = (id: number, status: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/category/change-status/${id}`, { status: status })
}

export const getCateDropListApi = (): Promise<IApiResponse<IResListCate>> => {
  return Baservices.getMethod(`/admin/category/droplist`)
}
