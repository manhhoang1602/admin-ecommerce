import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IResDataNotification {
  id: number
  title: string
  content: string
  postStatus: number
  accountType: number
  createAt: string
}

export interface IResNotification extends IResBody {
  data: IResDataNotification[]
  paging: IResPaging
}

export interface IPayloadNotification {
  page: number
  limit?: number
  search?: string
  account_type?: number
  post_status?: number
  startDate?: string
  endDate?: string
}

export interface IReqNotification {
  title: string
  content: string
  account_type: number
  post_status: number
}

export interface IResGetCountNotification extends IResBody {
  data: {
    count: number
  }
}

export interface IResDataPushNotification {
  id: number
  title: string
  content: string
  type: number
  accountType: number
  isRead: number
  clickable: number
  isAdmin: number
  customerId: number
  shopId: number
  driverId: number
  orderId: number
  newsId: number
  voucherId: number
  reviewId: number
  createAt: string
}

export interface IResPushNotification extends IResBody {
  data: IResDataPushNotification[]
  paging: IResPaging
}
