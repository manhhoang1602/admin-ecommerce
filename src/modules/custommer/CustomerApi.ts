import {
  IPayloadCustomer,
  IPayloadOrderCustomer,
  IResCustomer,
  IResDetailCustomer,
  IResOrderCustomer,
} from './CustomerInterfaces'
import { Baservices, IApiResponse } from '../../services/Basevices'
import { IResBody } from '../../services/Interfaces'

export const getListCustomerApi = (payload: IPayloadCustomer): Promise<IApiResponse<IResCustomer>> => {
  return Baservices.getMethod(`/admin/customer/list`, payload)
}

export const getDetailCustomerApi = (id: number): Promise<IApiResponse<IResDetailCustomer>> => {
  return Baservices.getMethod(`/admin/customer/detail/${id}`)
}

export const putChangeStatusCustomerApi = (id: number, status: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/customer/${id}`, { status: status })
}

export const getListOrderApi = (
  id: number,
  payload: IPayloadOrderCustomer
): Promise<IApiResponse<IResOrderCustomer>> => {
  return Baservices.getMethod(`/admin/customer/detail/order/${id}`, payload)
}
