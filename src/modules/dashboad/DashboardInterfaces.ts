import { IResBody } from '../../services/Interfaces'

export interface IResDataDashboard {
  totalDriver: number
  totalCustomer: number
  totalShop: number
  totalDoneOrder: number
  totalPendingOrder: number
  totalDeliveringOrder: number
  totalCancelOrder: number
  chartData: {
    time: string
    value: number[]
  }[]
}

export interface IResDashboard extends IResBody {
  data: IResDataDashboard
}

export interface IPayloadDashboard {
  startDate?: string
  endDate?: string
}
