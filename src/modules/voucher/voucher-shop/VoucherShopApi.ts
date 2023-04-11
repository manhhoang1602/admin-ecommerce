import { Baservices, IApiResponse } from '../../../services/Basevices'
import {
  IPayloadVoucherShop,
  IReqVoucherShop,
  IResDetailVoucherShop,
  IResVoucherShopInterface,
} from './VoucherShopInterface'
import { IResBody } from '../../../services/Interfaces'

export const getListVoucherShopApi = (
  payload: IPayloadVoucherShop
): Promise<IApiResponse<IResVoucherShopInterface>> => {
  return Baservices.getMethod(`/admin/voucher-shop/list`, payload)
}

export const getDetailVoucherShopApi = (id: number): Promise<IApiResponse<IResDetailVoucherShop>> => {
  return Baservices.getMethod(`/admin/voucher-shop/detail/${id}`)
}

export const postVoucherShopApi = (reqData: IReqVoucherShop): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/voucher-shop/create`, reqData)
}

export const putVoucherShopApi = (id: number, reqData: IReqVoucherShop): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/voucher-shop/update/${id}`, reqData)
}

export const putChangeStatusApi = (id: number, status: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/voucher-shop/change-status/${id}`, { status: status })
}

export const deleteVoucherShopApi = (id: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.deleteMethod(`/admin/voucher-shop/delete/${id}`)
}
