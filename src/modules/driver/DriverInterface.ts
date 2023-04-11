import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IResDataDriver {
  id: number
  name: string
  phone: string
  email: string
  status: number
  createAt: number
  shop: {
    name: string
    id: number
    phone: string
  }
}

export interface IResDriver extends IResBody {
  data: IResDataDriver[]
  paging: IResPaging
}

export interface IPayloadDriver {
  page: number
  status?: number
  search?: string
  searchShop?: number
  startDate?: string
  endDate?: string
  limit?: number
}

export interface IResDataDetailDriver {
  id: number
  shopId: number
  name: string
  phone: string
  address: string
  email: string
  dateOfBirth: string
  profilePictureUrl: string
  status: number
  gender: number
  orders: {
    id: number
    code: string
    driverId: number
    deliveryTime: number
    totalPrice: number
    status: number
    updateAt: string
    createAt: string
  }[]
  shop: {
    id: number
    nameShop: string
  }
}

export interface IResDetailDriver extends IResBody {
  data: IResDataDetailDriver
}
