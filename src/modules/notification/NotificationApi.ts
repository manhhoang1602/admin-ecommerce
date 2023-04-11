import { Baservices, IApiResponse } from '../../services/Basevices'
import {
  IPayloadNotification,
  IReqNotification,
  IResGetCountNotification,
  IResNotification,
  IResPushNotification,
} from './NotificationInterfaces'
import { IResBody } from '../../services/Interfaces'

export const getAdminNotificationApi = (payload: IPayloadNotification): Promise<IApiResponse<IResNotification>> => {
  return Baservices.getMethod(`/admin/notification/list`, payload)
}

export const deleteNotificationApi = (id: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.deleteMethod(`/admin/notification/delete/${id}`)
}

export const postNotificationApi = (reqData: IReqNotification): Promise<IApiResponse<IResBody>> => {
  return Baservices.postMethod(`/admin/notification/create`, reqData)
}

export const putNotificationApi = (id: number, reqData: IReqNotification): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/notification/update/${id}`, reqData)
}

export const getNotificationHeaderApi = (payload: {
  page: number
  limit: number
}): Promise<IApiResponse<IResPushNotification>> => {
  return Baservices.getMethod(`/admin/notification/list-push-notification`, payload)
}

export const getCountNotificationApi = (): Promise<IApiResponse<IResGetCountNotification>> => {
  return Baservices.getMethod(`/admin/notification/count`)
}

export const putReadNotificationApi = (id: number): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/notification/read-noti/${id}`)
}

export const putReadAllNotificationApi = (): Promise<IApiResponse<IResBody>> => {
  return Baservices.putMethod(`/admin/notification/read-all`)
}
