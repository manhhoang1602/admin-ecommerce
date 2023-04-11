import { IPayloadBanner, IReqBanner, IResDataBanner } from './BannerInterface'
import { action, makeAutoObservable, observable } from 'mobx'
import {
  deleteBannerApi,
  getBannerApi,
  getDetailBannerApi,
  postBannerApi,
  putBannerApi,
  putChangeStatusBannerApi,
} from './BannerApi'
import Config from '../../services/Config'
import { Notification } from '../../commons/notification/Notification'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'

interface IDatasourceBanner extends IResDataBanner {
  STT: number
  key: number
  option: IResDataBanner
}

export const DEFINE_BANNER_TYPE = {
  BANNER: 1,
  NEWS: 2,
  POLICY: 3,
  PROMOTION: 4,
}

export const DEFINE_BANNER_STATUS = {
  DRAFT: 0,
  PUBLIC: 1,
}

class BannerStore {
  loading = {
    getListBanner: false,
    submit: false,
    detail: false,
  }

  listBanner: IDatasourceBanner[] = []
  total: number = 0

  detailBanner: IResDataBanner | null = null

  constructor() {
    makeAutoObservable(this, {
      listBanner: observable,
      total: observable,
      detailBanner: observable,
      getListBanner: action,
      deleteBanner: action,
    })
  }

  async getListBanner(payload: IPayloadBanner) {
    try {
      this.loading.getListBanner = true
      const res = await getBannerApi(payload)
      if (res.body.status) {
        this.listBanner = res.body.data.map((value, index) => {
          return { ...value, STT: Config.getIndexTable(payload.page, index), key: value.id, option: value }
        })
        this.total = res.body.paging.totalItemCount
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading.getListBanner = false
    }
  }

  async getDetailBanner(id: number) {
    try {
      this.loading.detail = true
      const res = await getDetailBannerApi(id)
      if (res.body.status) {
        this.detailBanner = res.body.data
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading.detail = false
    }
  }

  async postBanner(reqData: IReqBanner) {
    try {
      this.loading.submit = true
      const res = await postBannerApi(reqData)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Thêm mới banner thành công.')
        history.push(ADMIN_ROUTER.BANNER.path)
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading.submit = false
    }
  }

  async putBanner(id: number, reqData: IReqBanner): Promise<boolean> {
    try {
      this.loading.submit = true
      const res = await putBannerApi(id, reqData)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Cập nhật banner thành công.')
        return new Promise((resolve) => resolve(true))
      }
      return new Promise((resolve) => resolve(false))
    } catch (e) {
      console.error(e)
      return new Promise((resolve) => resolve(false))
    } finally {
      this.loading.submit = false
    }
  }

  async changeStatus(id: number, status: number): Promise<boolean> {
    try {
      const res = await putChangeStatusBannerApi(id, status)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Thay đổi trạng thái thành công')
        return new Promise((resolve) => resolve(true))
      }
      return new Promise((resolve) => resolve(false))
    } catch (e) {
      console.error(e)
      return new Promise((resolve) => resolve(false))
    }
  }

  async deleteBanner(id: number): Promise<boolean> {
    try {
      const res = await deleteBannerApi(id)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Xóa thành công banner')
        return new Promise((resolve) => resolve(true))
      }
      return new Promise((resolve) => resolve(false))
    } catch (e) {
      console.error(e)
      return new Promise((resolve) => resolve(false))
    }
  }
}

const store = new BannerStore()

export default store
