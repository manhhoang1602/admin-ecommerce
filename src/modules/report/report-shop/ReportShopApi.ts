import { Baservices, IApiResponse } from '../../../services/Basevices'
import { IPayloadReportShop, IResReportShop } from './ReportShopInterfaces'

export const getListReportShopApi = (payload: IPayloadReportShop): Promise<IApiResponse<IResReportShop>> => {
  return Baservices.getMethod(`/admin/report/list-report`, payload)
}
