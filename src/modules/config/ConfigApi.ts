import { Baservices, IApiResponse } from '../../services/Basevices'
import Config from '../../services/Config'
import {
  IReqAttribute,
  IReqConfigSystem,
  IReqPackageProduct,
  IReqTopping,
  IResAttributeDropList,
  IResAttributeList,
  IResConfigSystem,
  IResDetailPackageProduct,
  IResListPackageProduct,
  IResListProductAddPackage,
  IResListTopping,
  IResListToppingByProductId,
  IResListUnit,
  IResProvince,
  IResUnitDropList,
} from './ConfigInterface'
import { IResBody } from '../../services/Interfaces'

export const getListToppingApi = (
  page: number,
  search: string,
  status?: number,
  limit: number = Config._limit
): Promise<IApiResponse<IResListTopping>> => {
  let path: string = `/admin/topping/list?page=${page}&limit=${limit}`
  if (search) {
    path = path + `&search=${search}`
  }
  if (status) {
    path = path + `&status=${status}`
  }
  return Baservices.getMethod(path)
}

export const postToppingApi = (reqTopping: IReqTopping): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/topping/create`, reqTopping)
}

export const putToppingApi = (id: number, reqData: IReqTopping): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/topping/update/${id}`, reqData)
}

export const deleteToppingApi = (id: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.deleteMethod(`/admin/topping/delete/${id}`)
}

export const putChangeStatusToppingApi = (id: number, status: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/topping/change-status/${id}`, { status: status })
}

export const getListUnitApi = (page: number, limit: number = Config._limit): Promise<IApiResponse<IResListUnit>> => {
  return Baservices.getMethod(`/admin/unit/list?page=${page}&limit=${limit}`)
}

export const getUnitDropListApi = (): Promise<IApiResponse<IResUnitDropList>> => {
  return Baservices.getMethod(`/admin/unit/droplist`)
}

export const postUnitApi = (data: { name: string }): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/unit/create`, { name: data.name })
}

export const deleteUnitApi = (id: number) => {
  return Baservices.deleteMethod(`/admin/unit/delete/${id}`)
}

export const getListAttributeApi = (
  page: number,
  limit: number = Config._limit
): Promise<IApiResponse<IResAttributeList>> => {
  return Baservices.getMethod(`/admin/attribute/list?page=${page}&limit=${limit}`)
}

export const postAttributeApi = (reqData: IReqAttribute): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/attribute/create`, reqData)
}

export const putAttributeApi = (id: number, reqData: IReqAttribute): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/attribute/update/${id}`, reqData)
}

export const deleteAttributeApi = (id: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.deleteMethod(`/admin/attribute/delete/${id}`)
}

export const getAttributeDropListApi = (): Promise<IApiResponse<IResAttributeDropList>> => {
  return Baservices.getMethod(`/admin/attribute/droplist`)
}

export const getListToppingByProductIdApi = (productId: number): Promise<IApiResponse<IResListToppingByProductId>> => {
  return Baservices.getMethod(`/admin/topping/list-topping-by-product/${productId}`)
}

export const getListPackageProductApi = (arg: {
  page: number
  search?: string
  startDate?: string
  endDate?: string
  isGetAll?: boolean
}): Promise<IApiResponse<IResListPackageProduct>> => {
  let path: string = `/admin/packet/list-packet?page=${arg.page}`
  if (!arg.isGetAll) {
    path = path + `&limit=${Config._limit}`
  }
  if (arg.startDate) {
    path = path + `&start_date=${arg.startDate}`
  }
  if (arg.endDate) {
    path = path + `&end_date=${arg.endDate}`
  }
  return Baservices.getMethod(path)
}

export const deletePackageApi = (id: number): Promise<IApiResponse<IApiResponse<IResBody>>> => {
  return Baservices.deleteMethod(`/admin/packet/delete-packet/${id}`)
}

export const getListProductAddPackageApi = (arg: {
  page: number
  categoryId: number
  search: string
}): Promise<IApiResponse<IResListProductAddPackage>> => {
  let path: string = `/admin/packet/list-product?page=${arg.page}&limit=${Config._limit}`

  if (arg.search.trim()) {
    path = path + `&search=${arg.search}`
  }
  if (arg.categoryId) {
    path = path + `&category_id=${arg.categoryId}`
  }

  return Baservices.getMethod(path)
}

export const postPackageProductApi = (reqData: IReqPackageProduct): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/packet/create`, reqData)
}

export const putPackageProductApi = (id: number, reqData: IReqPackageProduct): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/packet/update-packet/${id}`, reqData)
}

export const getDetailPackageProductApi = (id: number): Promise<IApiResponse<IResDetailPackageProduct>> => {
  return Baservices.getMethod(`/admin/packet/detail-packet/${id}`)
}

export const getConfigSystemApi = (): Promise<IApiResponse<IResConfigSystem>> => {
  return Baservices.getMethod(`/admin/config/list-config`)
}

export const putConfigSystemApi = (reqData: IReqConfigSystem[]): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/config/update-config`, reqData)
}

export const putConfigSystemMediaApi = (reqData: IReqConfigSystem): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/config/add-picture`, reqData)
}

export const deleteConfigSystemMediaApi = (reqData: IReqConfigSystem): Promise<IApiResponse<IResBody>> => {
  return Baservices.deleteMethod(`/admin/config/delete-picture`, reqData)
}

export const getListProvinceApi = (payload: { page: number; limit: number }): Promise<IApiResponse<IResProvince>> => {
  return Baservices.getMethod(`/admin/config/list-available-city`, payload)
}

export const deleteProvincesApi = (ids: number[]): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/config/delete-available-city`, { id: ids })
}

export const postProvinceApi = (reqData: { province_id: number[] }): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/config/add-available-city`, reqData)
}
