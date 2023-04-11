import { Baservices, IApiResponse } from '../../services/Basevices'
import Config from '../../services/Config'
import { DEFINE_STATUS_SHOP } from './Shop'
import {
  IPayloadOrderShop,
  IReqShop,
  IResDetailPackageProduct,
  IResDetailShop,
  IResListPackageProduct,
  IResListShop,
  IResOrderShop,
  IResProductInShop,
  IResProductOfShop,
} from './ShopInterfaces'
import { IResBody } from '../../services/Interfaces'
import { DEFINE_STATUS } from '../Constances'

export const getListShopApi = (
  page: number,
  status: number,
  search: string,
  startDate: string,
  endDate: string,
  limit: number = Config._limit
): Promise<IApiResponse<IResListShop>> => {
  let path: string = `/admin/shop/list?page=${page}&limit=${limit}`
  if (status !== DEFINE_STATUS_SHOP.ALL) {
    path = path + `&status=${status}`
  }
  if (search.trim()) {
    path = path + `&search=${search.trim()}`
  }
  if (startDate) {
    path = path + `&startDate=${startDate}`
  }
  if (endDate) {
    path = path + `&endDate=${endDate}`
  }
  return Baservices.getMethod(path)
}

export const postShopApi = (reqData: IReqShop): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/shop/register`, reqData)
}

export const putShopApi = (id: number, reqData: IReqShop): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/shop/update/shop/${id}`, reqData)
}

export const deleteShopApi = (id: number) => {
  return Baservices.deleteMethod(`/admin/shop/delete/${id}`)
}

export const getDetailShopApi = (
  id: number,
  page: number,
  limit: number = Config._limit
): Promise<IApiResponse<IResDetailShop>> => {
  return Baservices.getMethod(`/admin/shop/detail/${id}?limit=${limit}&page=${page}`)
}

export const putStatusShopApi = (id: number, status: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/shop/update/shop/${id}`, { status: status })
}

export const getListProductNotInShopApi = (id: number): Promise<IApiResponse<IResProductOfShop>> => {
  return Baservices.getMethod(`/admin/shop/list-product-not-menu/${id}`)
}

export const getListProductInShopApi = (id: number): Promise<IApiResponse<IResProductInShop>> => {
  return Baservices.getMethod(`/admin/shop/list-product-menu/${id}`)
}

export const postProductInShopApi = (reqData: {
  list_id: { id: number; type: number; uiud: any }[]
  shop_id: number
}): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/shop/create-menu`, reqData)
}

export const getListProductInShopDetailPageApi = (
  id: number,
  arg: {
    page: number
    search: string
    categoryId: number
    status: number
  }
): Promise<IApiResponse<IResProductInShop>> => {
  let path: string = `/admin/shop/list-menu/${id}?page=${arg.page}&limit=${Config._limit}`

  if (arg.search.trim()) {
    path = path + `&search=${arg.search.trim()}`
  }

  if (arg.categoryId) {
    path = path + `&category_id=${arg.categoryId}`
  }

  if (arg.status === DEFINE_STATUS.ACTIVE || arg.status === DEFINE_STATUS.INACTIVE) {
    path = path + `&status=${arg.status}`
  }

  return Baservices.getMethod(path)
}

export const deleteProductOfShopApi = (id: number, reqData: number[]): Promise<IApiResponse<IResBody>> => {
  return Baservices.deleteMethod(`/admin/shop/delete-menu/${id}`, { ids: reqData })
}

export const getListPackageProductApi = (): Promise<IApiResponse<IResListPackageProduct>> => {
  return Baservices.getMethod(`/admin/shop/list-packet`)
}

export const getDetailPackageProductApi = (id: number): Promise<IApiResponse<IResDetailPackageProduct>> => {
  return Baservices.getMethod(`/admin/shop/detail-packet/${id}`)
}

export const getListOrderShopApi = async (
  id: number,
  payload: IPayloadOrderShop
): Promise<IApiResponse<IResOrderShop>> => {
  return Baservices.getMethod(`/admin/shop/list-order/${id}`, payload)
}
