import { Baservices, IApiResponse } from '../../../services/Basevices'
import {
  IPayLoadVoucherSystem,
  IReqVoucherSystem,
  IResDetailVoucherSystem,
  IResListVoucherSystem,
} from './VoucherSystemInterfaces'
import { IResBody } from '../../../services/Interfaces'

export const getListVoucherSystemApi = (
  payload: IPayLoadVoucherSystem
): Promise<IApiResponse<IResListVoucherSystem>> => {
  return Baservices.getMethod('/admin/voucher/list', payload)
}

export const getDetailVoucherSystemApi = (id: number): Promise<IApiResponse<IResDetailVoucherSystem>> => {
  return Baservices.getMethod(`/admin/voucher/detail/${id}`)
}

export const postVoucherSystemApi = (reqData: IReqVoucherSystem): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/voucher/create`, reqData)
}

export const putVoucherSystemApi = (id: number, reqData: IReqVoucherSystem) => {
  return Baservices.putMethod(`/admin/voucher/update/${id}`, reqData)
}

export const putChangeStatusVoucherSystemApi = (id: number, status: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/voucher/change-status/${id}`, { status: status })
}

export const deleteVoucherSystemApi = (id: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.deleteMethod(`/admin/voucher/delete/${id}`)
}
