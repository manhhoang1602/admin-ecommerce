import { IResBody, IResPaging } from '../../../services/Interfaces'

export interface IResDataVoucherShop {
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
  type: number
  shopId: number
  status: number
  createAt: string
  nameShop: string
  url: string
  createdBy: string
}

export interface IResVoucherShopInterface extends IResBody {
  data: IResDataVoucherShop[]
  paging: IResPaging
}

export interface IPayloadVoucherShop {
  page: number
  limit?: number
  search?: string
  discount_type?: number
  shop_id?: number
  endDate?: string
  startDate?: string
}

export interface IResDetailVoucherShop extends IResBody {
  data: IResDataVoucherShop
}

export interface IReqVoucherShop {
  name: string
  code: string
  media_url?: string
  quantity: number
  description: string
  start_date: string
  end_date: string
  min_price_order: number
  discount_value: number
  discount_type: number
  shop_id?: number[]
}
