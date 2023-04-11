import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IResDataProductPromotion {
  id: number
  categoryId: number
  productId: number
  productPrice: number
  promotionPrice: number
  note: string
  fromTimeSale: string
  toTimeSale: string
  status: number
  createAt: string
  categoryName: string
  productName: string
  productCode: string
}

export interface IResListProductPromotion extends IResBody {
  data: IResDataProductPromotion[]
  paging: IResPaging
}

export interface IReqProductPromotion {
  category_id: number
  product_id: number
  promotion_price: number
  note: string
  from_time_sale: string
  to_time_sale: string
}

export interface IResDataDetailProductPromotion {
  id: number
  categoryId: number
  productId: number
  productPrice: number
  promotionPrice: number
  note: string
  fromTimeSale: string
  toTimeSale: string
  status: number
  createAt: string
  categoryName: string
  productName: string
  product: { productSizes: { id: number; name: string; price: number }[] }
}

export interface IResDetailProductPromotion extends IResBody {
  data: IResDataDetailProductPromotion
}
