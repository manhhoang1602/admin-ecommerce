import { makeAutoObservable } from 'mobx'
import { IPayloadCustomer, IResDataCustomer, IResDataDetailCustomer } from './CustomerInterfaces'
import { DEFAULT_PAGE } from '../Constances'
import Config from '../../services/Config'
import { getDetailCustomerApi, getListCustomerApi, putChangeStatusCustomerApi } from './CustomerApi'
import { Modal } from 'antd'
import { Notification } from '../../commons/notification/Notification'

export interface ICustomer extends IResDataCustomer {
  STT: number
  key: number
}

export interface IDataSourceAddress {
  key: number
  STT: number
  name: string
  phone: string
  province: string
  district: string
  ward: string
  address: string
  createAt: string
}

class CustomerStore {
  loading = {
    getList: false,
    getDetail: false,
    changeStatus: false,
  }
  listCustomer: ICustomer[] = []
  total: number = 0
  payload: IPayloadCustomer = {
    page: DEFAULT_PAGE,
    limit: Config._limit,
  }
  detailCustomer: IResDataDetailCustomer | undefined = undefined

  constructor() {
    makeAutoObservable(this)
  }

  async getListCustomer() {
    try {
      this.loading.getList = true
      const res = await getListCustomerApi({ ...this.payload, search: this.payload.search?.trim() })
      if (res.body.status) {
        this.listCustomer = res.body.data.map((value, index) => {
          return { ...value, STT: Config.getIndexTable(this.payload.page, index), key: value.id }
        })
        this.total = res.body.paging.totalItemCount
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading.getList = false
    }
  }

  async getDetailCustomer(id: number) {
    try {
      this.loading.getDetail = true
      const res = await getDetailCustomerApi(id)
      if (res.body.status) {
        this.detailCustomer = res.body.data
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading.getDetail = false
    }
  }

  async changeStatus(id: number) {
    try {
      Modal.confirm({
        title: 'Bạn có chắc muốn chuyển trạng thái hoạt động khách hàng này không?',
        okText: 'Xác nhận',
        onOk: async () => {
          const res = await putChangeStatusCustomerApi(id, this.detailCustomer?.status ? 0 : 1)
          if (res.body.status) {
            Notification.PushNotification('SUCCESS', 'Chuyển trạng thái khách hàng thành công')
            this.getDetailCustomer(id)
          }
        },
      })
    } catch (e) {
      console.error(e)
    }
  }

  get dataSourceAddress(): IDataSourceAddress[] {
    try {
      if (this.detailCustomer) {
        return this.detailCustomer.customerAddresses.map((value, index) => {
          return {
            key: value.id,
            STT: index + 1,
            address: value.address,
            createAt: value.createAt,
            district: value.dFDistrict.name,
            name: value.name,
            phone: value.phone,
            province: value.dFProvince.name,
            ward: value.dFWard.name,
          }
        })
      } else return []
    } catch (e) {
      console.error(e)
      return []
    }
  }
}

const store = new CustomerStore()

export default store
