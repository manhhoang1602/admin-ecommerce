import { IPayloadDashboard, IResDataDashboard } from './DashboardInterfaces'
import { action, makeAutoObservable, observable } from 'mobx'
import { getDataDashboardApi } from './DashboardApi'
import { IDataChartLine, ILineConfig } from '../../commons/chart/LineChart'

class DashboardStore {
  loading: boolean = false
  payload: IPayloadDashboard = {}
  dataDashboard: IResDataDashboard | undefined = undefined

  constructor() {
    makeAutoObservable(this, {
      loading: observable,
      payload: observable,
      dataDashboard: observable,

      getDataDashboard: action,
    })
  }

  async getDataDashboard(payload: IPayloadDashboard) {
    try {
      this.loading = true
      const res = await getDataDashboardApi(payload)
      if (res.body.data) {
        this.dataDashboard = res.body.data
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  get dataChart(): IDataChartLine {
    const getDataChart = (index: number): number[] => {
      try {
        const result: number[] | undefined = this.dataDashboard?.chartData.map((value) => {
          if (value.value) {
            return value.value[index]
          } else return 0
        })
        return result as number[]
      } catch (e) {
        console.error(e)
        return []
      }
    }

    try {
      const rs: IDataChartLine = {
        labels: [],
        datasets: [],
      }

      const datasetsOrderPending: ILineConfig = {
        backgroundColor: 'purple',
        borderColor: 'purple',
        borderWidth: 1,
        fill: false,
        label: 'Chờ xác nhận',
        lineTension: 0.5,
        data: getDataChart(0),
      }
      const datasetsOrderDelivering: ILineConfig = {
        backgroundColor: 'blue',
        borderColor: 'blue',
        borderWidth: 1,
        fill: false,
        label: 'Đang thực hiện',
        lineTension: 0.5,
        data: getDataChart(1),
      }
      const datasetsOrderCancel: ILineConfig = {
        backgroundColor: 'red',
        borderColor: 'red',
        borderWidth: 1,
        fill: false,
        label: 'Hủy/ Từ chối',
        lineTension: 0.5,
        data: getDataChart(2),
      }
      const datasetsOrderComplete: ILineConfig = {
        backgroundColor: 'green',
        borderColor: 'green',
        borderWidth: 1,
        fill: false,
        label: 'Hoàn thành',
        lineTension: 0.5,
        data: getDataChart(3),
      }

      this.dataDashboard?.chartData.forEach((value) => {
        rs.labels.push(value.time)
      })

      rs.datasets.push(datasetsOrderPending)
      rs.datasets.push(datasetsOrderDelivering)
      rs.datasets.push(datasetsOrderCancel)
      rs.datasets.push(datasetsOrderComplete)

      return rs
    } catch (e) {
      console.error(e)
      return {
        labels: [],
        datasets: [],
      }
    }
  }
}

const store = new DashboardStore()

export default store
