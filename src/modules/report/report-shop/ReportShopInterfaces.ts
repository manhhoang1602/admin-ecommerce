import { IResBody, IResPaging } from '../../../services/Interfaces'

export interface IResDataReportShop {
  id: number
  nameShop: string
  phone: string
  name: string
  orderDone: number
  orderTotal: number
  moneyDone: number
  moneyTotal: number
  quantityDone: number
  quantityTotal: number
  percent: number
}

export interface IResReportShop extends IResBody {
  data: IResDataReportShop[]
  paging: IResPaging
}

export interface IPayloadReportShop {
  page: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
}
