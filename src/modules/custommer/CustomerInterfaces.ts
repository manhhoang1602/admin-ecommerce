import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IResDataCustomer {
  id: number
  name: string
  phone: string
  email: string
  status: number
  createAt: string
}

export interface IResCustomer extends IResBody {
  data: IResDataCustomer[]
  paging: IResPaging
}

export interface IPayloadCustomer {
  page: number
  limit?: number
  status?: number
  search?: string
  startDate?: string
  endDate?: string
}

export interface IResDataDetailCustomer {
  id: number
  name: string
  email: string
  dateOfBirth: string
  gender: number
  phone: string
  status: number
  createAt: string
  customerAddresses: {
    id: number
    name: string
    phone: string
    address: string
    createAt: string
    dFDistrict: {
      id: number
      value: string
      name: string
    }
    dFProvince: {
      id: number
      value: string
      name: string
    }
    dFWard: {
      id: number
      value: string
      name: string
    }
  }[]
}

export interface IResDetailCustomer extends IResBody {
  data: IResDataDetailCustomer
}

export interface IResDataOrderCustomer {
  id: number
  code: string
  totalPrice: number
  status: number
  receiveAddress: any
  createAt: string
}

export interface IResOrderCustomer extends IResBody {
  data: IResDataOrderCustomer[]
  paging: IResPaging
}

export interface IPayloadOrderCustomer {
  page: number
  limit: number
  startDate?: string
  endDate?: string
}
