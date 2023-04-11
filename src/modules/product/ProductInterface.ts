import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IResDataProduct {
  productConfigId: number[]
  id: number
  code: string
  name: string
  price: number
  description: string
  displayOrder: number
  categoryId: number
  categoryName: string
  unitId: number
  status: number
  createAt: string
}

export interface IResListProduct extends IResBody {
  data: IResDataProduct[]
  paging: IResPaging
}

export interface IResDataSubProduct {
  id: number
  productSubId: number
  product: {
    id: number
    name: string
    price: number
    categoryName: string
    unitName: string
  }
  productSize?: {
    id: number
    name: string
    price: number
  }
}

export interface IResListSubProduct extends IResBody {
  data: IResDataSubProduct[]
  paging: IResPaging
}

export interface IReqPostProductInfo {
  code: string
  name: string
  price: number
  category_id: number
  unit_id: number
  description?: string | null
  display_order: number
  df_attribute_id?: number[] | null
}

export interface IReqPostProductImage {
  product_media: {
    media_url: string
    display_order: number
    type: number
    is_avatar: number
  }[]
}

export interface IReqPostProductSize {
  product_size?: {
    name: string
    price: number
    is_default: number
    status: number
  }[]
}

export interface IReqPostProduct extends IReqPostProductInfo, IReqPostProductImage, IReqPostProductSize {
  product_sub_id?: {
    child_product_id: number
    child_product_size_id: number | null
    status: number
  }[]
  topping_id?: { topping_id: number; display_order: number; status: number }[]
}

export interface IResParentProduct {
  id: number
  childProductId: number
  status: number
  subProduct: {
    id: number
    name: string
    price: number
    unitName: string
    sizePrice: number | null
    sizeName: string | null
    sizeId: number | null
    categoryName: string
  }
}

export interface IResDataDetailProduct {
  id: number
  code: string
  name: string
  price: number
  displayOrder: number
  description: string
  status: number
  createAt: string
  categoryId: number
  unitId: number
  dfAttributeId: number[]
  unitName: string
  categoryName: string
  productSizes: {
    id: number
    name: string
    price: number
    status: number
    isDefault: number
  }[]
  productToppings: {
    id: number
    code: string
    toppingId: number
    name: string
    price: number
    status: number
    displayOrder: number
  }[]
  productAttributes: {
    id: number
    name: string
  }[]
  parentProduct: IResParentProduct[]
  productMedia: {
    mediaUrl: string
    id: number
    productId: number
    displayOrder: number
    type: number
    isAvatar: number
    mediaPath: string
  }[]
}

export interface IResDetailProduct extends IResBody {
  data: IResDataDetailProduct
}

export interface IReqPutProduct {
  name: string
  price: number
  category_id: number
  unit_id: number
  description?: string
  display_order: number
  df_attribute_id?: number[] | null

  topping_id: {
    topping_id: number
    display_order: number
    status: number
  }[]
  update_topping_id: {
    topping_id: number
    status: number
  }[]
  delete_topping_id: number[]

  new_product_sub_id: {
    child_product_id: number
    status: number
  }[]
  update_product_sub_id: {
    id: number
    status: number
  }[]
  delete_product_sub_id: number[]

  product_media: {
    media_url: string
    display_order: number
    type: number
    is_avatar: number
  }[]

  new_product_size: {
    name: string
    price: number
    status: number
    is_default: number
  }[]
  update_product_size: {
    id: number
    name: string
    price: number
    status: number
    is_default: number
  }[]
  delete_product_size: number[]
}
