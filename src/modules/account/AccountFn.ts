import { IResDataListAccount } from './AccountInterface'
import { DEFINE_STATUS_ACCOUNT, IDatasourceAccount } from './Account'
import Config from '../../services/Config'
import { IFormAddAccount } from './component/AddUpdateAccount'

export const getDataSourceAccount = (data: IResDataListAccount[], page: number): IDatasourceAccount[] => {
  return data.map((value, index) => {
    return { ...value, key: value.id, STT: Config.getIndexTable(page, index) }
  })
}

export const getDataFormUpdateAccount = (data: IDatasourceAccount): IFormAddAccount => {
  try {
    return {
      name: data.name,
      image: data.profilePicturePath,
      role: data.role,
      phone: data.phone,
      status: data.status,
      email: data.email,
    }
  } catch (e) {
    console.error(e)
    return {
      name: '',
      image: '',
      role: 0,
      phone: '',
      email: '',
      status: DEFINE_STATUS_ACCOUNT.ACTIVE,
    }
  }
}
