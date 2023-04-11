import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IResDataPartner {
  id: number
  customerId: number
  email: string
  phone: string
  name: string
  address: string
  note: string
  createAt: string
  status: number
  customer: {
    name: string
    email: string
    phone: string
  }
}

export interface IResPartner extends IResBody {
  data: IResDataPartner[]
  paging: IResPaging
}

export interface IPayloadPartnerRequest {
  page: number
  limit: number
  search?: string
  status?: number
  startDate?: string
  endDate?: string
}

export interface IReqPartnerRequest {
  reason?: string
  status: number
}
