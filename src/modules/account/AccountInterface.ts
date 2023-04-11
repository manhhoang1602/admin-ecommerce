import { IResBody, IResPaging } from '../../services/Interfaces'

export interface IResDataListAccount {
  id: number
  name: string
  phone: string
  email: string
  profilePictureUrl: string
  profilePicturePath: string
  status: number
  role: number
  create_at: string
}

export interface IResListAccount extends IResBody {
  data: IResDataListAccount[]
  paging: IResPaging
}

export interface IReqPutAccount {
  status?: number
  role?: number
  email: string
  name: string
  profile_picture_url: string
}

export interface IReqPostAccount {
  password: string
  role: number
  email: string
  phone: string
  name: string
  profile_picture_url: string
}

export interface IReqChangePass {
  password_old: string
  password_new: string
}
