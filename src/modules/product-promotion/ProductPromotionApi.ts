import { Baservices, IApiResponse } from '../../services/Basevices'
import Config from '../../services/Config'
import { DEFINE_STATUS } from '../Constances'
import { IResBody } from '../../services/Interfaces'
import {
  IReqProductPromotion,
  IResDetailProductPromotion,
  IResListProductPromotion,
} from './ProductPromotionInterfaces'

export const getListProductPromotionApi = (arg: {
  page: number
  search: string
  status: number
  category: number
  startDate: string
  endDate: string
  limit?: number
}): Promise<IApiResponse<IResListProductPromotion>> => {
  let path: string = `/admin/promotion/list?page=${arg.page}&limit=${arg.limit ? arg.limit : Config._limit}`
  if (arg.search.trim()) {
    path = path + `&search=${arg.search.trim()}`
  }
  if (arg.status === DEFINE_STATUS.ACTIVE || arg.status === DEFINE_STATUS.INACTIVE) {
    path = path + `&status=${arg.status}`
  }
  if (arg.category) {
    path = path + `&category_id=${arg.category}`
  }
  if (arg.startDate) {
    path = path + `&start_date=${arg.startDate}`
  }
  if (arg.endDate) {
    path = path + `&end_date=${arg.endDate}`
  }
  return Baservices.getMethod(path)
}

export const getDetailProductPromotionApi = (id: number): Promise<IApiResponse<IResDetailProductPromotion>> => {
  return Baservices.getMethod(`/admin/promotion/detail/${id}`)
}

export const postProductPromotionApi = (reqData: IReqProductPromotion): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/promotion/create`, reqData)
}

export const putProductPromotionApi = (id: number, reqData: IReqProductPromotion): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/promotion/update/${id}`, reqData)
}

export const deleteProductPromotionApi = (id: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.deleteMethod(`/admin/promotion/delete/${id}`)
}
