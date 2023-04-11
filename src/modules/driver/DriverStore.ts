import { IPayloadDriver, IResDataDetailDriver, IResDataDriver } from './DriverInterface'
import { action, computed, makeAutoObservable, observable } from 'mobx'
import { getDetailDriverApi, getDriverApi } from './DriverApi'
import Config from '../../services/Config'

export const DEFINE_GENDER = {
  MALE: 1,
  FEMALE: 2,
}

export interface IDatasourceDriver extends IResDataDriver {
  STT: number
  key: number
}

export interface IDatasourceOrderDriver {
  id: number
  key: number
  STT: number
  code: string
  driverId: number
  deliveryTime: number
  totalPrice: number
  status: number
  option: { id: number }
}

class DriverStore {
  loading = {
    getList: false,
    getDetail: false,
  }
  listDriver: IDatasourceDriver[] = []
  total: number = 0

  detailDriver: IResDataDetailDriver | undefined = undefined

  constructor() {
    makeAutoObservable(this, {
      loading: observable,
      listDriver: observable,
      total: observable,
      detailDriver: observable,

      getDatasourceOrderDriver: computed,

      getListDriver: action,
      getDetailDriver: action,
    })
  }

  async getListDriver(payload: IPayloadDriver) {
    try {
      this.loading.getList = true
      const res = await getDriverApi(payload)
      if (res.body.status) {
        this.listDriver = res.body.data.map((value, index) => {
          return {
            ...value,
            STT: Config.getIndexTable(payload.page, index),
            key: value.id,
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

  async getDetailDriver(id: number) {
    try {
      this.loading.getDetail = true
      const res = await getDetailDriverApi(id)
      if (res.body.status) {
        this.detailDriver = res.body.data
        console.log(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading.getDetail = false
    }
  }

  get getDatasourceOrderDriver(): IDatasourceOrderDriver[] {
    try {
      return this.detailDriver!.orders.map((value, index) => {
        const itemOrder: IDatasourceOrderDriver = {
          id: value.id,
          option: { id: value.id },
          code: value.code,
          STT: index + 1,
          driverId: value.driverId,
          key: value.id,
          deliveryTime: value.deliveryTime,
          totalPrice: value.totalPrice,
          status: value.status,
        }

        return itemOrder
      })
    } catch (e) {
      console.error(e)
      return []
    }
  }
}

const store = new DriverStore()

export default store
