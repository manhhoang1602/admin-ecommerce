import { Baservices, IApiResponse } from '../../../services/Basevices'
import {
  IPayloadOrderProductReport,
  IPayloadProductReport,
  IResOrderProductReport,
  IResProductReport,
} from './ReportRevenueInterfaces'

export const getListProductReportApi = (payload: IPayloadProductReport): Promise<IApiResponse<IResProductReport>> => {
  return Baservices.getMethod(`/admin/report/revenue-report`, payload)
}

export const getListOrderProductReportApi = (
  id: number,
  payload: IPayloadOrderProductReport
): Promise<IApiResponse<IResOrderProductReport>> => {
  return Baservices.getMethod(`/admin/report/revenue-report-by-product/${id}`, payload)
}
