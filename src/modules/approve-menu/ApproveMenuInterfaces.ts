import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IResDataApproveMenu {
  id: number
  code: string
  status: number
  createAt: string
  countProduct: number
  countCombo: number
  shop: {
    id: number
    nameShop: string
    phone: string
    email: string
  }
}

export interface IResListApproveMenu extends IResBody {
  data: IResDataApproveMenu[]
  paging: IResPaging
}

export interface IResDataDetailApproveMenu {
  id: number
  code: string
  status: number
  createAt: string
  count: number
  shop: {
    id: number
    name: string
    phone: string
    address: string
    email: string
    taxCode: string
    addressGoogle: string
    nameShop: string
    star: string
  }
  approveItems: {
    id: number
    productId: number
    approveId: number
    comboId: number
    uuid: string
    type: number
    combo: {
      id: number
      code: string
      name: string
      price: number
      url: string
    }
    product: {
      id: number
      code: string
      name: string
      price: number
      categoryId: number
      category: {
        id: number
        name: string
      }
    }
  }[]
}

export interface IResDetailApprove extends IResBody {
  data: IResDataDetailApproveMenu
}
