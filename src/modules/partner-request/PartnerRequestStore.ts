import { makeAutoObservable } from 'mobx'
import { getPartnerRequestApi, putChangeStatusPartnerRequestApi } from './PartnerRequestApi'
import { IPayloadPartnerRequest, IReqPartnerRequest, IResDataPartner } from './PartnerInterfaces'
import { DEFAULT_PAGE } from '../Constances'
import Config from '../../services/Config'
import { Notification } from '../../commons/notification/Notification'

export interface IPartnerRequest extends IResDataPartner {
  STT: number
  key: number
}

export const DEFINE_SHOP_REQUEST_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  DENY: 2,
}

class PartnerRequestStore {
  loading = {
    getList: false,
  }
  payload: IPayloadPartnerRequest = {
    page: DEFAULT_PAGE,
    limit: Config._limit,
  }
  listPartnerRequest: IPartnerRequest[] = []
  total: number = 0

  constructor() {
    makeAutoObservable(this)
  }

  async getListPartner() {
    try {
      this.loading.getList = true
      const res = await getPartnerRequestApi({ ...this.payload, search: this.payload.search?.trim() })
      if (res.body.status) {
        this.listPartnerRequest = res.body.data.map((value, index) => {
          return {
            ...value,
            key: value.id,
            STT: Config.getIndexTable(this.payload.page, index),
          }
        })
        this.total = res.body.paging.totalItemCount
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading.getList = false
    }
  }

  async putChangeStatus(type: 'APPROVE' | 'REJECT', id: number, reqData: IReqPartnerRequest): Promise<boolean> {
    try {
      const res = await putChangeStatusPartnerRequestApi(id, reqData)
      if (res.body.status) {
        if (type === 'APPROVE') {
          Notification.PushNotification('SUCCESS', 'Phê duyệt đối tác thành công')
          this.getListPartner()
        }
        if (type === 'REJECT') {
          Notification.PushNotification('SUCCESS', 'Từ chối yêu cầu phê duyệt thành công.')
          this.getListPartner()
        }
        return new Promise((resolve) => resolve(true))
      }
      return new Promise((resolve) => resolve(false))
    } catch (e) {
      console.error(e)
      return new Promise((resolve) => resolve(false))
    }
  }
}

const store = new PartnerRequestStore()

export default store
