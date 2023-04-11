import { makeAutoObservable } from 'mobx'
import { IPayloadReportShop, IResDataReportShop } from './ReportShopInterfaces'
import { getListReportShopApi } from './ReportShopApi'
import Config from '../../../services/Config'
import { DEFAULT_PAGE } from '../../Constances'

export interface IReportShop extends IResDataReportShop {
  STT: number
  key: number
}

interface IDataExport {
  STT: number
  'Tên gian hàng': string
  'Tổng đơn': number
  'Tổng SL sản phẩm': number
  'Tổng giá trị ĐH': number
  'Tổng đơn hoàn thành': number
  'SL sản phẩm hoàn thành': number
  'Giá trị ĐH hoàn thành': number
  'Thành công(%)': number
}

class ReportShopStore {
  payload: IPayloadReportShop = {
    page: DEFAULT_PAGE,
    limit: Config._limit,
  }
  loading = {
    getList: false,
  }
  listReportShop: IReportShop[] = []
  total: number = 0

  dataExport: IDataExport[] = []

  constructor() {
    makeAutoObservable(this)
  }

  async getListReportShop() {
    try {
      this.loading.getList = true
      const res = await getListReportShopApi({ ...this.payload, search: this.payload.search?.trim() })
      if (res.body.status) {
        this.listReportShop = res.body.data.map((value, index) => {
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
      const res = await getListReportShopApi({ ...this.payload, search: this.payload.search?.trim(), limit: undefined })
      if (res.body.status) {
        this.dataExport = res.body.data.map((value, index) => {
          return {
            STT: index + 1,
            'Tên gian hàng': value.nameShop,
            'Tổng đơn': value.orderTotal,
            'Tổng SL sản phẩm': value.quantityTotal,
            'Tổng giá trị ĐH': value.moneyTotal,
            'Tổng đơn hoàn thành': value.orderDone,
            'SL sản phẩm hoàn thành': value.quantityDone,
            'Giá trị ĐH hoàn thành': value.moneyDone,
            'Thành công(%)': value.percent,
          }
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
    }
  }
}

const store = new ReportShopStore()

export default store
