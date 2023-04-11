import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IResDataTopping {
  thumbnailUrl: string
  id: number
  toppingId: number
  name: string
  price: number
  status: number
  displayOrder: number
  code: string
  createAt: string
  thumbnailPath: string
  updateAt: string
}

export interface IResListTopping extends IResBody {
  data: IResDataTopping[]
  paging: IResPaging
}

export interface IReqTopping {
  name: string
  code: string
  display_order: number
  price: number
  thumbnail_url: string
}

export interface IResDataUnit {
  id: number
  name: string
  status: number
  createAt: string
  updateAt: string
}

export interface IResListUnit extends IResBody {
  data: IResDataUnit[]
  paging: IResPaging
}

export interface IReqAttribute {
  name: string
  update: {
    id: number
    value: string
    price: number
    display_order: number
  }[]
  new: {
    value: string
    price?: number
    display_order: number
  }[]
  delete: number[]
}

export interface IResUnitDropList extends IResBody {
  data: { id: number; name: string }[]
}

export interface IResAttributeDropList extends IResBody {
  data: { id: number; name: string }[]
}

export interface IResDataAttributeList {
  id: number
  name: string
  createAt: string
  updateAt: string
  status: number
  attributeOptions: {
    id: number
    attributeId: number
    value: string
    price: number
    displayOrder: number
  }[]
}

export interface IResAttributeList extends IResBody {
  data: IResDataAttributeList[]
  paging: IResPaging
}

export interface IResListToppingByProductId extends IResBody {
  data: { id: number; toppingId: number; name: string; price: number }[]
}

export interface IResDataPackageProduct {
  id: number
  name: string
  createAt: string
  count: number
}

export interface IResListPackageProduct extends IResBody {
  data: IResDataPackageProduct[]
  paging: IResPaging
}

export interface IResDataProductAddPackage {
  id: number
  name: string
  price: number
  categoryId: number
  categoryName: string
  unitId: number
  unit: string
  type: number
  uiud: string
}

export interface IResListProductAddPackage extends IResBody {
  data: IResDataProductAddPackage[]
  paging: IResPaging
}

export interface IReqPackageProduct {
  name: string
  node: string
  list_id: {
    id: number
    type: number
    uiud: string
  }[]
}

export interface IResDataDetailPackageProduct {
  id: number
  name: string
  node: string
  packetProducts: {
    id: number
    productId: number
    packetId: number
    comboId: number
    product: {
      id: number
      name: string
      price: number
      uiud: string
      type: number
      category: {
        id: number
        name: string
      }
      unit: {
        id: number
        name: string
      }
    }
  }[]
}

export interface IResDetailPackageProduct extends IResBody {
  data: IResDataDetailPackageProduct
}

export interface IResItemConfigSystem {
  id: number
  key: string
  value: string | number
}

export interface IResItemConfigSystemMedia extends IResItemConfigSystem {
  mediaUrl: string
}

export interface IResDataConfigSystem {
  contactInfo: IResItemConfigSystem[]
  minPriceOrder: IResItemConfigSystem
  surveyLink: IResItemConfigSystem
  timeOut: IResItemConfigSystem
  introducePictureUrl: IResItemConfigSystemMedia[]
  partnerRegisterPictureUrl: IResItemConfigSystemMedia[]
}

export interface IResConfigSystem extends IResBody {
  data: IResDataConfigSystem
}

export interface IReqConfigSystem {
  value?: string
  id: number
  key: string
}

export interface IResDataProvinces {
  id: number
  provinceId: number
  provinceName: string
  createAt: string
}

export interface IResProvince extends IResBody {
  data: IResDataProvinces[]
  paging: IResPaging
}
