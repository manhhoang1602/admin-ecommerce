import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IPayloadOrder {
  search?: string
  status?: number
  shop_id?: number
  page: number
  limit?: number
  startDate?: string
  endDate?: string
}

export interface IResDataOrder {
  id: number
  code: string
  status: number
  totalPrice: number
  createAt: string
  name: string
  phone: string
  totalQuantity: number
  customerAddress: {
    name: string
    phone: string
    address: string
    districtName: string
    wardName: string
    provinceName: string
  }
  shop?: { nameShop: string }
  orderItems: {
    mediaUrl: string
  }[]
}

export interface IResListOrder extends IResBody {
  data: IResDataOrder[]
  paging: IResPaging
}

export interface IResDataDetailOrder {
  id: number
  code: string
  status: number
  discountPrice: number
  discountProductPrice: number
  isDelivery: number
  totalPrice: number
  totalQuantity: number
  createAt: string
  customerAddress: {
    name: string
    phone: string
    districtName: string
    wardName: string
    provinceName: string
  }
  customer: {
    name: string
    phone: string
  }
  driver: { name: string; phone: string; address: string; wardName: string; districtName: string; provinceName: string }
  shop: { nameShop: string; phone: string; address: string }
  orderHistories: {
    id: number
    status: number
    createAt: string
  }[]
  orderItems: {
    id: number
    quantity: number
    product: {
      price: number
      comboId: number
      quantity: number
      mediaUrl: string
      sizeName: string
      comboName: string
      productId: number
      description: string
      productName: string
      toppingName: string
      attributeInfo: any
      promotionProductId: number
      promotionProductPrice: number
    }
  }[]
}

export interface IResDetailOrder extends IResBody {
  data: IResDataDetailOrder
}
