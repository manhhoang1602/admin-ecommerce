import Axios from 'axios'
import humps from 'humps'
import { Notification } from '../commons/notification/Notification'

export interface IApiResponse<T> {
  status: number
  body: T
}

const DEFINE_CODE_ERROR = {
  AUTH: 403,
  JWT: 401,
}

// CONFIG SERVICE
export const TOKEN_NAME: string = process.env.REACT_APP_TOKEN_NAME as string
export const BASE_URL: string = process.env.REACT_APP_BASE_URL as string

export const getToken = (): string | null => localStorage.getItem(TOKEN_NAME)

// METHODS CALL API
export const apiCall = async (
  url: string,
  method: 'GET' | 'PUT' | 'POST' | 'DELETE',
  data: { [key: string]: any } | undefined,
  isToken: boolean = true,
  token?: string,
  isDeleteBaseUrl?: boolean
): Promise<IApiResponse<any>> => {
  let headers: { [key: string]: string } = {}
  headers['Content-Type'] = 'application/json'

  if (token) {
    headers[TOKEN_NAME] = token
  } else {
    if (isToken) headers[TOKEN_NAME] = getToken() || ''
  }

  return new Promise<any>((resolve, reject) => {
    Axios({
      url: (isDeleteBaseUrl ? '' : BASE_URL) + url,
      method: method,
      headers: headers,
      params: method === 'GET' && data,
      data: data && method !== 'GET' ? JSON.stringify(data) : undefined,
    })
      .then((next) => {
        // check and log error
        if (next.data.code === DEFINE_CODE_ERROR.AUTH || next.data.code === DEFINE_CODE_ERROR.JWT) {
          setTimeout(() => {
            window.location.href = '/'
            localStorage.removeItem(TOKEN_NAME)
          }, 500)
        }
        if (next.data.status === 1 || next.data.status === 'OK') {
          // end
          resolve({
            body: humps.camelizeKeys(next.data),
            status: next.status,
          })
        } else {
          reject({
            body: humps.camelizeKeys(next.data),
            status: next.status,
          })
          Notification.PushNotification('ERROR', next.data.message)
        }
      })
      .catch((error) => {
        try {
          reject({
            body: humps.camelizeKeys(error.response.data),
            status: error.response.error,
          })
        } catch (e) {
          reject({
            body: e,
            status: 500,
          })
        }
        Notification.PushNotification('ERROR', 'Đã có lỗi xảy ra vui lòng thao tác lại.')
      })
  })
}

export class Baservices {
  public static async getMethod(
    _url: string,
    _payload?: any,
    _isToken: boolean = true,
    _token?: string,
    _isDeleteBaseUrl?: boolean
  ): Promise<IApiResponse<any>> {
    return apiCall(_url, 'GET', _payload, _isToken, undefined, _isDeleteBaseUrl)
  }

  public static async postMethod(
    _url: string,
    _data?: any,
    _isToken: boolean = true,
    _token?: string
  ): Promise<IApiResponse<any>> {
    return apiCall(_url, 'POST', _data, _isToken, _token)
  }

  public static async putMethod(
    _url: string,
    _data?: any,
    _isToken: boolean = true,
    _token?: string
  ): Promise<IApiResponse<any>> {
    return apiCall(_url, 'PUT', _data, _isToken, _token)
  }

  public static async deleteMethod(
    _url: string,
    _data?: any,
    _isToken: boolean = true,
    _token?: string
  ): Promise<IApiResponse<any>> {
    return apiCall(_url, 'DELETE', _data, _isToken, _token)
  }
}
