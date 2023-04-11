import { IResBody, IResPaging } from '../../../services/Interfaces'

export interface IPayLoadVoucherSystem {
  page: number
  limit?: number
  search?: string
  discount_type?: number
  endDate?: string
  startDate?: string
}

export interface IResDataVoucherSystem {
  id: number
  name: string
  code: string
  mediaUrl: string
  quantity: number
  remainQuantity: number
  description: string
  startDate: string
  endDate: string
  minPriceOrder: number
  discountValue: number
  discountType: number
  shopId: number
  status: number
  createdBy: string
  url: string
}

export interface IResListVoucherSystem extends IResBody {
  data: IResDataVoucherSystem[]
  paging: IResPaging
}

export interface IResDetailVoucherSystem extends IResBody {
  data: IResDataVoucherSystem
}

export interface IReqVoucherSystem {
  name: string
  code: string
  media_url: string
  quantity: number
  description: string
  start_date?: string | null
  end_date?: string | null
  min_price_order: number
  discount_value: number
  discount_type: number
}
