import { IPayloadNotification, IReqNotification, IResDataNotification } from './NotificationInterfaces'
import { action, makeAutoObservable, observable } from 'mobx'
import {
  deleteNotificationApi,
  getAdminNotificationApi,
  postNotificationApi,
  putNotificationApi,
} from './NotificationApi'
import Config from '../../services/Config'
import { Notification } from '../../commons/notification/Notification'

export interface INotification extends IResDataNotification {
  key: number
  STT: number
}

export const DEFINE_NOTIFICATION_STATUS = {
  DRAFT: 0,
  PUBLIC: 1,
}

class NotificationStore {
  loading = {
    getListNotification: false,
    submitForm: false,
  }
  listNotification: INotification[] = []
  totalNotification: number = 0

  constructor() {
    makeAutoObservable(this, {
      listNotification: observable,
      loading: observable,
      totalNotification: observable,

      getListNotification: action,
      deleteNotification: action,
      postNotification: action,
      putNotification: action,
    })
  }

  async getListNotification(payload: IPayloadNotification) {
    try {
      this.loading.getListNotification = true
      const res = await getAdminNotificationApi(payload)
      if (res.body.status) {
        this.listNotification = res.body.data.map((value, index) => {
          return {
            ...value,
            STT: Config.getIndexTable(payload.page, index),
            key: value.id,
          }
        })
        this.totalNotification = res.body.paging.totalItemCount
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading.getListNotification = false
    }
  }

  async deleteNotification(id: number, payload: IPayloadNotification) {
    try {
      const res = await deleteNotificationApi(id)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Xóa thành công thông báo ra khỏi hệ thống.')
        this.getListNotification(payload)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async postNotification(reqData: IReqNotification): Promise<boolean> {
    try {
      this.loading.submitForm = true
      const res = await postNotificationApi(reqData)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Thêm mới thành công thông báo.')
        this.getListNotification({ page: 1, limit: Config._limit })
        return new Promise((resolve) => resolve(true))
      } else {
        return new Promise((resolve) => resolve(false))
      }
    } catch (e) {
      console.error(e)
      return new Promise((resolve) => resolve(false))
    } finally {
      this.loading.submitForm = false
    }
  }

  async putNotification(id: number, reqData: IReqNotification, payload: IPayloadNotification): Promise<boolean> {
    try {
      this.loading.submitForm = true
      const res = await putNotificationApi(id, reqData)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Cập nhật thành công thông báo')
        this.getListNotification(payload)
        return new Promise((resolve) => resolve(true))
      } else {
        return new Promise((resolve) => resolve(false))
      }
    } catch (e) {
      console.error(e)
      return new Promise((resolve) => resolve(false))
    } finally {
      this.loading.submitForm = false
    }
  }
}

const store = new NotificationStore()

export default store
