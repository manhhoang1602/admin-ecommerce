import { IResBody, IResPaging } from '../../../services/Interfaces'

export interface IResDataProductReport {
  id: number
  shopId: number
  productId: number
  nameShop: string
  productName: string
  categoryId: number
  categoryName: string
  totalDoneOrder: number
  totalSoldProduct: number
  totalRevenue: number
}

export interface IResProductReport extends IResBody {
  data: IResDataProductReport[]
  paging: IResPaging
}

export interface IPayloadProductReport {
  page: number
  limit?: number
  search?: string
  shop_id?: number
  category_id?: number
  endDate?: string
  startDate?: string
}

export interface IResDataOrderProductReport {
  id: number
  code: string
  totalPrice: number
  status: number
  createAt: string
  name: string
  quantity: number
  price: number
}

export interface IResOrderProductReport extends IResBody {
  data: IResDataOrderProductReport[]
  paging: IResPaging
}

export interface IPayloadOrderProductReport {
  page: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
}
