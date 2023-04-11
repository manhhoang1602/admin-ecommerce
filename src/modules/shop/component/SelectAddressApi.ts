import { Baservices, IApiResponse } from '../../../services/Basevices'
import { IResDistrict, IResProvinces, IResWard } from './SelectAddressInterfaces'

export const getProvincesApi = (): Promise<IApiResponse<IResProvinces>> => {
  return Baservices.getMethod(`/address/list-province`)
}

export const getDistrictApi = (provinceId: number): Promise<IApiResponse<IResDistrict>> => {
  return Baservices.getMethod(`/address/list-district?province_id=${provinceId}`)
}

export const getWardApi = (districtId: number): Promise<IApiResponse<IResWard>> => {
  return Baservices.getMethod(`/address/list-ward?district_id=${districtId}`)
}
