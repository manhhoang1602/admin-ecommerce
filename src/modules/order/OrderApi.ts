import { Baservices, IApiResponse } from '../../services/Basevices'
import { IPayloadOrder, IResDetailOrder, IResListOrder } from './OrderInterfaeces'

export const getListOrderApi = (payload: IPayloadOrder): Promise<IApiResponse<IResListOrder>> => {
  return Baservices.getMethod(`/admin/order/list`, payload)
}

export const getDetailOrderApi = (id: number): Promise<IApiResponse<IResDetailOrder>> => {
  return Baservices.getMethod(`/admin/order/detail/${id}`)
}
