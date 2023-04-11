import { Baservices, IApiResponse } from '../../services/Basevices'
import { IPayloadBanner, IReqBanner, IResBanner, IResDetailBanner } from './BannerInterface'
import { IResBody } from '../../services/Interfaces'

export const getBannerApi = (payload: IPayloadBanner): Promise<IApiResponse<IResBanner>> => {
  return Baservices.getMethod(`/admin/banner/list`, payload)
}

export const getDetailBannerApi = (id: number): Promise<IApiResponse<IResDetailBanner>> => {
  return Baservices.getMethod(`/admin/banner/detail/${id}`)
}

export const postBannerApi = (reqData: IReqBanner): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/banner/create`, reqData)
}

export const putBannerApi = (id: number, reqData: IReqBanner): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/banner/update/${id}`, reqData)
}

export const putChangeStatusBannerApi = (id: number, status: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/banner/change-status/${id}`, { status: status })
}

export const deleteBannerApi = (id: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.deleteMethod(`/admin/banner/delete/${id}`)
}
