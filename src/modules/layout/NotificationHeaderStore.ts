import { action, makeAutoObservable, observable } from 'mobx'
import {
  getCountNotificationApi,
  getNotificationHeaderApi,
  putReadAllNotificationApi,
  putReadNotificationApi,
} from '../notification/NotificationApi'
import Config from '../../services/Config'
import { DEFAULT_PAGE } from '../Constances'
import { IResDataPushNotification } from '../notification/NotificationInterfaces'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'

const DEFINE_TYPE_NOTIFICATION = {
  APPROVE_MENU: 3,
  VOUCHER: 2,
}

class NotificationHeaderStore {
  loading = {
    getList: false,
    readNotification: false,
  }
  listNotificationHeader: any[] = []
  payload = {
    limit: Config._limit,
    page: DEFAULT_PAGE,
  }
  countNotification: number = 0
  total: number = 0

  constructor() {
    makeAutoObservable(this, {
      loading: observable,
      listNotificationHeader: observable,
      countNotification: observable,
      payload: observable,
      total: observable,

      getListNotification: action,
      putReadNotification: action,
      getContNotification: action,
      loadMore: action,
      navigateNotification: action,
    })
  }

  async getListNotification(payload: { page: number; limit: number }) {
    try {
      this.loading.getList = true
      const res = await getNotificationHeaderApi(payload)
      this.getContNotification()
      if (res.body.status) {
        this.listNotificationHeader = res.body.data
        this.total = res.body.paging.totalItemCount
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading.getList = false
    }
  }

  async putReadNotification(type: 'SINGLE' | 'ALL', id?: number) {
    try {
      this.loading.readNotification = true
      if (type === 'SINGLE') {
        const res = await putReadNotificationApi(id as number)
        if (res.body.status) {
          this.getListNotification(this.payload)
        }
      }
      if (type === 'ALL') {
        const res = await putReadAllNotificationApi()
        if (res.body.status) {
          this.getListNotification(this.payload)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading.readNotification = false
    }
  }

  async getContNotification() {
    try {
      const res = await getCountNotificationApi()
      if (res.body.status) {
        this.countNotification = res.body.data.count
      }
    } catch (e) {
      console.error(e)
    }
  }

  async loadMore() {
    this.payload.limit = this.payload.limit + Config._limit
  }

  navigateNotification(data: IResDataPushNotification) {
    if (data.type === DEFINE_TYPE_NOTIFICATION.APPROVE_MENU) {
      history.push(ADMIN_ROUTER.APPROVE_MENU.path)
    } else if (data.type === DEFINE_TYPE_NOTIFICATION.VOUCHER) {
      history.push(ADMIN_ROUTER.VOUCHER_SHOP.path)
    } else {
      history.push(ADMIN_ROUTER.PARTNER_REQUEST.path)
    }
  }
}

const store = new NotificationHeaderStore()

export default store
