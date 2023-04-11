import { makeAutoObservable } from 'mobx'
import { IPayloadProductReport, IResDataProductReport } from './ReportRevenueInterfaces'
import { getListProductReportApi } from './ReportRevenueApi'
import { DEFAULT_PAGE } from '../../Constances'
import Config from '../../../services/Config'

export interface IListProductReport extends IResDataProductReport {
  STT: number
  key: number
}

export interface IDataExport {
  STT: number
  'Tên sản phẩm': string
  'Nhóm sản phẩm': string
  'Gian hàng': string
  'SL đã bán': number
  'Số đơn hàng': number
  'Tổng tiền thực tế': number
}

class ReportRevenueStore {
  loading = {
    getList: false,
  }
  payload: IPayloadProductReport = {
    page: DEFAULT_PAGE,
    limit: Config._limit,
  }
  listProductReport: IListProductReport[] = []
  total: number = 0
  dataExport: IDataExport[] = []

  constructor() {
    makeAutoObservable(this)
  }

  async getListProductReport() {
    try {
      this.loading.getList = true
      const res = await getListProductReportApi({ ...this.payload, search: this.payload.search?.trim() })
      if (res.body.status) {
        this.listProductReport = res.body.data.map((value, index) => {
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

  async getDataExport() {
    try {
      const res = await getListProductReportApi({
        ...this.payload,
        search: this.payload.search?.trim(),
        limit: undefined,
      })
      if (res.body.status) {
        this.dataExport = res.body.data.map((value, index) => {
          return {
            STT: index + 1,
            'Tên sản phẩm': value.productName,
            'Nhóm sản phẩm': value.categoryName,
            'Gian hàng': value.nameShop,
            'SL đã bán': value.totalSoldProduct,
            'Số đơn hàng': value.totalDoneOrder,
            'Tổng tiền thực tế': value.totalRevenue,
          }
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
    }
  }
}

const store = new ReportRevenueStore()

export default store
