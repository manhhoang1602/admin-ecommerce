import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IResDataCombo {
  id: number
  code: string
  name: string
  price: number
  displayOrder: number
  description: string
  status: number
  createAt: string
  totalQuantityProduct: number
}

export interface IResListCombo extends IResBody {
  data: IResDataCombo[]
  paging: IResPaging
}

export interface IReqCombo {
  name: string
  code?: string
  display_order: number
  is_display_home: number
  price: number
  description: string | null
  combo_media: {
    media_url: string
    display_order: number
    type: number
    is_avatar: number
  }[]
  product_combo_item?: {
    by_product_id: number
    quantity: number
    topping_id: number[]
  }[]
  new_product_combo_item?: {
    by_product_id: number
    quantity: number
    topping_id: number[]
  }[]
  update_product_combo_item?: {
    id: number
    quantity: number
    topping_id: number[]
  }[]
  delete_product_combo_item?: number[]
}

export interface IResDataDetailCombo {
  id: number
  code: string
  name: string
  price: number
  displayOrder: number
  description: string
  isDisplayHome: number
  status: number
  createAt: string
  productCombos: {
    id: number
    quantity: number
    productComboToppings: {
      id: number
      toppingId: number
      name: string
      price: number
    }[]
    byProduct: {
      productId: number
      productSizeId: number
      name: string
      price: number
      unitName: string
      categoryName: string
      sizePrice: number
      sizeName: string
    }
  }[]
  comboMedia: {
    mediaUrl: string
    id: number
    comboId: number
    displayOrder: number
    isAvatar: number
    mediaPath: string
  }[]
}

export interface IResDetailCombo extends IResBody {
  data: IResDataDetailCombo
}
