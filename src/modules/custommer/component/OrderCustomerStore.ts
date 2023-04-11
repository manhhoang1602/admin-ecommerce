import { IPayloadOrderCustomer, IResDataOrderCustomer } from '../CustomerInterfaces'
import { makeAutoObservable } from 'mobx'
import { DEFAULT_PAGE } from '../../Constances'
import Config from '../../../services/Config'
import { getListOrderApi } from '../CustomerApi'

export interface IOrderCustomer extends IResDataOrderCustomer {
  STT: number
  key: number
  detail: IResDataOrderCustomer
}

class OrderCustomerStore {
  loading: boolean = false
  payload: IPayloadOrderCustomer = {
    page: DEFAULT_PAGE,
    limit: Config._limit,
  }
  listOrderCustomer: IOrderCustomer[] = []
  total: number = 0

  constructor() {
    makeAutoObservable(this)
  }

  async getListOrderCustomer(id: number) {
    try {
      this.loading = true
      const res = await getListOrderApi(id, this.payload)
      if (res.body.status) {
        this.listOrderCustomer = res.body.data.map((value, index) => {
          return {
            ...value,
            STT: Config.getIndexTable(this.payload.page, index),
            detail: value,
            key: value.id,
          }
        })
        this.total = res.body.paging.totalItemCount
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }
}

const store = new OrderCustomerStore()

export default store
