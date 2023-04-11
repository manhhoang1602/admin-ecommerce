import { Baservices, IApiResponse } from '../../services/Basevices'
import {
  IReqPostProduct,
  IReqPutProduct,
  IResDetailProduct,
  IResListProduct,
  IResListSubProduct,
} from './ProductInterface'
import Config from '../../services/Config'
import { DEFINE_STATUS_PRODUCT } from './Product'
import { IResBody } from '../../services/Interfaces'

export const getListProductApi = (arg: {
  page: number
  search: string
  categoryId: number
  status: number
  startDate: string
  endDate: string
  isGetAll?: boolean
}): Promise<IApiResponse<IResListProduct>> => {
  let path: string = `/admin/product/list?page=${arg.page}`
  if (!arg.isGetAll) {
    path = path + `&limit=${Config._limit}`
  }
  if (arg.search.trim()) {
    path = path + `&search=${arg.search.trim()}`
  }
  if (arg.categoryId) {
    path = path + `&category_id=${arg.categoryId}`
  }
  if (arg.status !== DEFINE_STATUS_PRODUCT.ALL) {
    path = path + `&status=${arg.status}`
  }
  if (arg.startDate) {
    path = path + `&startDate=${arg.startDate}`
  }
  if (arg.endDate) {
    path = path + `&endDate=${arg.endDate}`
  }
  return Baservices.getMethod(path)
}

export const postProductApi = (reqData: IReqPostProduct): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/product/create`, reqData)
}

export const getListSubProductApi = (reqData: {
  page: number
  search: string
  categoryId: number
}): Promise<IApiResponse<IResListSubProduct>> => {
  let path: string = `/admin/product/list-sub-product?page=${reqData.page}&limit=${Config._limit}`
  if (reqData.search.trim()) {
    path = path + `&search=${reqData.search}`
  }
  if (reqData.categoryId) {
    path = path + `&category_id=${reqData.categoryId}`
  }
  return Baservices.getMethod(path)
}

export const getDetailProductApi = (id: number): Promise<IApiResponse<IResDetailProduct>> => {
  return Baservices.getMethod(`/admin/product/detail/${id}`)
}

export const changeStatusProductApi = (id: number, status: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/product/change-status/${id}`, { status: status })
}

export const deleteProductApi = (id: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.deleteMethod(`/admin/product/delete/${id}`)
}

export const putProductApi = (id: number, reqPutData: IReqPutProduct): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/product/update/${id}`, reqPutData)
}
