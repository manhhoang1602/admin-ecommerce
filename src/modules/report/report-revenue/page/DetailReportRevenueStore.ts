import { makeAutoObservable } from 'mobx'
import { IPayloadOrderProductReport, IResDataOrderProductReport } from '../ReportRevenueInterfaces'
import { DEFAULT_PAGE } from '../../../Constances'
import Config from '../../../../services/Config'
import { getListOrderProductReportApi } from '../ReportRevenueApi'
import { Moment } from '../../../../services/Moment'
import { GetStatusOrder } from '../../../order/Order'

export interface IListOrderRevenue extends IResDataOrderProductReport {
  STT: number
  key: number
}

interface IDataExport {
  STT: number
  'Mã đơn hàng': string
  'Ngày tạo': string
  'Giá bán': number
  'Số lượng': number
  'Thành tiền': number
  'Người mua': string
  'Trạng thái': string
}

class DetailReportRevenueStore {
  loading = {
    get: false,
  }
  payload: IPayloadOrderProductReport = {
    page: DEFAULT_PAGE,
    limit: Config._limit,
  }
  listOrder: IListOrderRevenue[] = []
  total: number = 0

  dataExport: IDataExport[] = []

  constructor() {
    makeAutoObservable(this)
  }

  async getListOrder(productId: number) {
    try {
      this.loading.get = true
      const res = await getListOrderProductReportApi(productId, {
        ...this.payload,
        search: this.payload.search?.trim(),
      })
      if (res.body.status) {
        this.listOrder = res.body.data.map((value, index) => {
          return { ...value, STT: Config.getIndexTable(this.payload.page, index), key: value.id }
        })
        this.total = res.body.paging.totalItemCount
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading.get = false
    }
  }

  async getDataExport(productId: number) {
    try {
      const res = await getListOrderProductReportApi(productId, {
        ...this.payload,
        search: this.payload.search?.trim(),
        limit: undefined,
      })
      if (res.body.status) {
        this.dataExport = res.body.data.map((value, index) => {
          return {
            STT: index + 1,
            'Mã đơn hàng': value.code,
            'Ngày tạo': Moment.getDate(value.createAt, 'HH:mm DD/MM/YYYY'),
            'Giá bán': value.price,
            'Số lượng': value.quantity,
            'Thành tiền': value.price * value.quantity,
            'Người mua': value.name,
            'Trạng thái': GetStatusOrder(value.status) as string,
          }
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
    }
  }
}

const store = new DetailReportRevenueStore()

export default store
