import { IReqConfigSystem, IResDataConfigSystem, IResItemConfigSystemMedia } from '../ConfigInterface'
import { action, computed, makeAutoObservable, observable } from 'mobx'
import {
  deleteConfigSystemMediaApi,
  getConfigSystemApi,
  putConfigSystemApi,
  putConfigSystemMediaApi,
} from '../ConfigApi'
import { Moment } from '../../../services/Moment'
import { Notification } from '../../../commons/notification/Notification'
import { IFile } from '../../../commons/upload/UploadFileComponent'

export class ConfigSystemStore {
  loading = {
    getDetail: false,
    infoContact: false,
    minPriceOrder: false,
    timePendingOrder: false,
  }
  detailConfigSystem: IResDataConfigSystem | undefined = undefined

  constructor() {
    makeAutoObservable(this, {
      detailConfigSystem: observable,
      loading: observable,

      dataFormContactInfo: computed,
      dataFormMinPriceOrder: computed,
      dataFormTimePendingOrder: computed,

      getDetailConfigSystem: action,
      putConfigSystem: action,
      putConfigSystemMedia: action,
    })
  }

  async getDetailConfigSystem() {
    try {
      this.loading.getDetail = true
      const res = await getConfigSystemApi()
      if (res.body.status) {
        this.detailConfigSystem = res.body.data
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading.getDetail = false
    }
  }

  async putConfigSystem(type: 'INFO_CONTACT' | 'MIN_PRICE_ORDER' | 'TIME_PENDING_ORDER', reqData: IReqConfigSystem[]) {
    try {
      if (type === 'INFO_CONTACT') {
        this.loading.infoContact = true
      }
      if (type === 'MIN_PRICE_ORDER') {
        this.loading.minPriceOrder = true
      }
      if (type === 'TIME_PENDING_ORDER') {
        this.loading.timePendingOrder = true
      }

      const res = await putConfigSystemApi(reqData)
      if (res.body.status) {
        if (type === 'TIME_PENDING_ORDER') {
          Notification.PushNotification('SUCCESS', 'Câp nhật thời gian chờ nhận đơn hàng thành công.')
        }
        if (type === 'MIN_PRICE_ORDER') {
          Notification.PushNotification('SUCCESS', 'Câp nhật giá trị tối thiểu đơn hàng thành công.')
        }
        if (type === 'INFO_CONTACT') {
          Notification.PushNotification('SUCCESS', 'Câp nhật thông tin liên hệ thành công.')
        }
        this.getDetailConfigSystem()
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading.timePendingOrder = false
      this.loading.infoContact = false
      this.loading.minPriceOrder = false
    }
  }

  async putConfigSystemMedia(reqData: IReqConfigSystem) {
    try {
      const res = await putConfigSystemMediaApi(reqData)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Cập nhật ảnh thành công.')
        this.getDetailConfigSystem()
      } else {
        window.location.reload()
      }
    } catch (e) {
      console.error(e)
    }
  }

  async deleteConfigSystemMedia(reqData: IReqConfigSystem) {
    try {
      const res = await deleteConfigSystemMediaApi(reqData)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Xóa ảnh thành công.')
        this.getDetailConfigSystem()
      }
    } catch (e) {
      console.error(e)
    }
  }

  getDataFile(data: IResItemConfigSystemMedia): IFile[] | undefined {
    try {
      if (data.mediaUrl) {
        return [
          {
            uid: data.id,
            status: 'done',
            name: data.mediaUrl as string,
            url: data.mediaUrl as string,
            response: { data: { url: data.mediaUrl as string, filename: data.mediaUrl as string } },
          },
        ]
      }
      return []
    } catch (e) {
      console.error(e)
      return undefined
    }
  }

  get dataFormContactInfo() {
    try {
      const result: { [key: string]: any } = {}
      this.detailConfigSystem &&
        this.detailConfigSystem.contactInfo.forEach((value) => {
          result[value.key] = value.value
        })
      result['survey_link'] = this.detailConfigSystem?.surveyLink.value
      return result
    } catch (e) {
      console.error(e)
      return {}
    }
  }

  get dataFormMinPriceOrder(): { min_price_order: number } {
    try {
      return { min_price_order: this.detailConfigSystem?.minPriceOrder.value as number }
    } catch (e) {
      console.error(e)
      return { min_price_order: 0 }
    }
  }

  get dataFormTimePendingOrder(): { time_out: number } {
    try {
      return { time_out: Moment.getHMS(Number(this.detailConfigSystem!.timeOut.value)).M }
    } catch (e) {
      console.error(e)
      return { time_out: 0 }
    }
  }
}

const store = new ConfigSystemStore()

export default store
