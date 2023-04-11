export interface IColumn {
  title: string | null
  dataIndex: string
  key: string
  render: (value: any, row?: any, index?: any) => any
  width?: number
  align?: 'center' | 'left' | 'right'
}

export interface IResBody {
  code: number
  message: string
  status: number
  data?: any
}

export interface IResPaging {
  limit: number
  page: number
  totalItemCount: number
}

export interface IValidate {
  isValidity: boolean
  msg: string
}
