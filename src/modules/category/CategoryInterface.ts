import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IResDataListCate {
  iconUrl: string
  id: number
  name: string
  description: string
  displayOrder: number
  status: number
  createAt: string
  iconPath: string
  updateAt: string
}

export interface IResListCate extends IResBody {
  data: IResDataListCate[]
  paging: IResPaging
}

export interface IReqCate {
  name: string
  display_order: number
  icon_url: string
  description: string
}
