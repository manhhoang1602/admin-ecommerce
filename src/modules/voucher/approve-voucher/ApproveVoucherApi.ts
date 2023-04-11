import { IReqPayloadVoucherRequest, IResListVoucherRequest } from './ApproveVoucherInterfaces'
import { Baservices, IApiResponse } from '../../../services/Basevices'
import { IResBody } from '../../../services/Interfaces'

export const getListVoucherRequestApi = (
  payload: IReqPayloadVoucherRequest
): Promise<IApiResponse<IResListVoucherRequest>> => {
  return Baservices.getMethod(`/admin/voucher-request/list`, payload)
}

export const putChangeStatusVoucherRequestApi = (
  id: number,
  reqData: { status: number }
): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/voucher-request/change-status/${id}`, reqData)
}
