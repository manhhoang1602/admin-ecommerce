import { IResBody } from '../../../services/Interfaces'

export interface IResDataProvinces {
  id: number
  name: string
}

export interface IResProvinces extends IResBody {
  data: IResDataProvinces[]
}

export interface IResDataDistrict {
  id: number
  name: string
  provinceId: number
}

export interface IResDistrict extends IResBody {
  data: IResDataDistrict[]
}

export interface IResDataWard {
  id: number
  name: string
  districtId: number
}

export interface IResWard extends IResBody {}
