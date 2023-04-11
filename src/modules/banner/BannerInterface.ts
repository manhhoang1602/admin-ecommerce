import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IResDataBanner {
  mediaUrl: string
  id: number
  type: number
  title: string
  content: string
  postStatus: number
  status: number
  pushNotify: number
  createAt: string
  mediaPath?: string
}

export interface IResBanner extends IResBody {
  data: IResDataBanner[]
  paging: IResPaging
}

export interface IPayloadBanner {
  page: number
  search?: string
  status?: number
  type?: number
  post_status?: number
  startDate?: string
  endDate?: string
  limit?: number
}

export interface IResDetailBanner extends IResBody {
  data: IResDataBanner
}

export interface IReqBanner {
  title: string
  type: number
  post_status: number
  push_notify: number
  media_url: string
  content: string
}
