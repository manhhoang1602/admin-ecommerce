import { Baservices, IApiResponse } from '../../services/Basevices'
import { IPayloadDriver, IResDetailDriver, IResDriver } from './DriverInterface'

export const getDriverApi = (payload: IPayloadDriver): Promise<IApiResponse<IResDriver>> => {
  return Baservices.getMethod(`/admin/driver/list`, payload)
}

export const getDetailDriverApi = (id: number): Promise<IApiResponse<IResDetailDriver>> => {
  return Baservices.getMethod(`/admin/driver/list/${id}`)
}
