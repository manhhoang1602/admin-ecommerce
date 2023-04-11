import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IReqShop {
  name_shop: string
  name: string
  tax_code: string
  password?: string
  phone?: string
  email: string
  address: string
  lat?: number
  long?: number
  status?: number
  province_id: number
  district_id: number
  ward_id: number
  address_google: string
}

export interface IResDataListShop {
  id: number
  name: string
  nameShop: string
  phone: string
  email: string
  taxCode: string
  status: number
  createAt: string
}

export interface IResListShop extends IResBody {
  data: IResDataListShop[]
  paging: IResPaging
}

export interface IResDataReviewShop {
  id: number
  star: number
  comment: string
  note: string
  status: number
  createAt: string
  reviewMedia: {
    id: number
    mediaUrl: string
    type: number
    status: number
    url: string
  }[]
  customer: {
    id: number
    name: string
    phone: string
    email: string
  }
}

export interface IResDataDetailShop {
  id: number
  name: string
  phone: string
  address: string
  email: string
  nameShop: string
  taxCode: string
  addressGoogle: string
  status: number
  reviews: IResDataReviewShop[]
  star: number
  reviewTotal: number
  provinceId: number
  districtId: number
  wardId: number
  lat: number
  long: number
}

export interface IResDetailShop extends IResBody {
  data: IResDataDetailShop
}

export interface IResDataProductOfShop {
  id: number
  price: number
  productId: number
  name: string
  categoryId: number
  uiud: string
  categoryName: string
  type: number
}

export interface IResProductOfShop extends IResBody {
  data: IResDataProductOfShop[]
}

export interface IResDataProductInShop {
  id: number
  shopId: number
  productId: number
  type: number
  product: {
    id: number
    code: string
    name: string
    price: number
    uiud: string
    type: number
    status: number
    category: {
      id: number
      name: string
    }
  }
  combo: {
    id: number
    uiud: string
    name: string
    price: number
    type: number
    categoryId: number
    categoryName: string
  }
}

export interface IResProductInShop extends IResBody {
  data: IResDataProductInShop[]
  paging: IResPaging
}

export interface IResDataPackageProduct {
  id: number
  name: string
  packetProducts: {
    id: number
    product_id: number
    uiud: string
    type: number
  }[]
}

export interface IResListPackageProduct extends IResBody {
  data: IResDataPackageProduct[]
}

export interface IResDataDetailPackageProduct {
  id: number
  price: number
  productId: number
  name: string
  categoryId: number
  uiud: string
  categoryName: string
  type: number
}

export interface IResDetailPackageProduct extends IResBody {
  data: IResDataDetailPackageProduct[]
}

export interface IResDataOrderShop {
  id: number
  code: string
  status: number
  createAt: string
  totalPrice: number
  discountPrice: number
  discountProductPrice: number
  customerId: number
  customerPhone: string
  customerName: string
  countProduct: number
  countCombo: number
}

export interface IResOrderShop extends IResBody {
  data: IResDataOrderShop[]
  paging: IResPaging
}

export interface IPayloadOrderShop {
  page: number
  limit: number
  status?: number
  search?: string
  startDate?: string
  endDate?: string
}
