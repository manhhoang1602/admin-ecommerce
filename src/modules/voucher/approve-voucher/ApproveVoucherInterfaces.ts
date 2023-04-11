import { IResBody, IResPaging } from '../../../services/Interfaces'

export interface IReqPayloadVoucherRequest {
  page: number
  search: string | null
  shop_id: number | undefined
  discount_type: number | undefined
  startDate: string | null
  endDate: string | null
  limit?: number
}

export interface IResDataVoucherRequest {
  id: number
  name: string
  code: string
  mediaUrl: string
  quantity: number
  description: string
  startDate: string
  endDate: string
  minPriceOrder: number
  discountValue: number
  discountType: number
  shopId: number
  status: number
  createAt: string
  nameShop: string
  email: string
  phone: string
  url: string
}

export interface IResListVoucherRequest extends IResBody {
  data: IResDataVoucherRequest[]
  paging: IResPaging
}
