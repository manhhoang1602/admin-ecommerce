import { Baservices, IApiResponse } from '../../services/Basevices'
import { IPayloadPartnerRequest, IReqPartnerRequest, IResPartner } from './PartnerInterfaces'
import { IResBody } from '../../services/Interfaces'

export const getPartnerRequestApi = (payload: IPayloadPartnerRequest): Promise<IApiResponse<IResPartner>> => {
  return Baservices.getMethod(`/admin/shop-request/list-request`, payload)
}

export const putChangeStatusPartnerRequestApi = (
  id: number,
  reqData: IReqPartnerRequest
): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/shop-request/change-status/${id}`, reqData)
}
