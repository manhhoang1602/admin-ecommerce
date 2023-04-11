import { IPayloadDashboard, IResDashboard } from './DashboardInterfaces'
import { Baservices, IApiResponse } from '../../services/Basevices'

export const getDataDashboardApi = (payload: IPayloadDashboard): Promise<IApiResponse<IResDashboard>> => {
  return Baservices.getMethod(`/admin/home/summary`, payload)
}
