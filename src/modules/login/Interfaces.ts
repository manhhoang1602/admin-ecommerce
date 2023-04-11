import { IResBody } from '../../services/Interfaces'

export interface IResLoginData {
  profilePictureUrl: string
  id: number
  userId: number
  name: string
  token: string
  role: number
  phone: string
  email: string
  status: number
  profilePicturePath: string
}

export interface IResLogin extends IResBody {
  data: IResLoginData
}
