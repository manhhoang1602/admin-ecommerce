import React, { useEffect, useState } from 'react'
import { Col, DatePicker, Input, PageHeader, Row, Select, Table, Tag } from 'antd'
import RangePickerHoc from '../../commons/HOC/RangePickerHOC'
import TableHoc from '../../commons/HOC/TableHOC'
import { DEFAULT_PAGE } from '../Constances'
import { getListApproveApi } from './ApproveMenuApi'
import { IResDataApproveMenu } from './ApproveMenuInterfaces'
import Config from '../../services/Config'
import { IColumn } from '../../services/Interfaces'
import { Format } from '../../services/Format'
import { Moment } from '../../services/Moment'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'

interface IDatasourceApprove extends IResDataApproveMenu {
  STT: number
  key: number
}

export const DEFINE_STATUS_APPROVE = {
  ACTIVE: 1, // phê duyệt
  INACTIVE: 0, // từ chối
  PENDING: 2, //  chờ duyệt
}

export const RenderStatusApprove = (status: number | undefined) => {
  if (status === DEFINE_STATUS_APPROVE.ACTIVE) {
    return <Tag color={'green'}>Phê duyệt</Tag>
  }
  if (status === DEFINE_STATUS_APPROVE.PENDING) {
    return <Tag color={'orange'}>Chờ phê duyệt</Tag>
  }
  if (status === DEFINE_STATUS_APPROVE.INACTIVE) {
    return <Tag color={'red'}>Từ chối</Tag>
  }
}

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    width: 50,
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Tên cửa hàng',
    key: 'shop',
    dataIndex: 'shop',
    render: (shop: { nameShop: string }) => <div>{shop.nameShop}</div>,
  },
  {
    title: 'Số điện thoại',
    key: 'shop',
    dataIndex: 'shop',
    align: 'center',
    render: (shop: { phone: string }) => <div>{Format.formatString(shop.phone)}</div>,
  },
  {
    title: 'Email',
    key: 'shop',
    dataIndex: 'shop',
    render: (shop: { email: string }) => <div>{Format.formatString(shop.email)}</div>,
  },
  {
    title: 'Số lượng món muốn đăng ký',
    key: 'countProduct',
    dataIndex: 'countProduct',
    align: 'center',
    render: (countProduct: number, row: IDatasourceApprove) => (
      <div>
        {Format.numberWithCommas(countProduct, 'sản phẩm')}/ {Format.numberWithCommas(row.countCombo, 'combo')}
      </div>
    ),
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    align: 'center',
    render: (status: number) => <div>{RenderStatusApprove(status)}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    align: 'center',
    render: (createAt: string) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
]

const ApproveMenu = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [arg, setArg] = useState<{
    page: number
    search: string
    status: number | undefined
    startDate: string
    endDate: string
  }>({
    page: DEFAULT_PAGE,
    search: '',
    status: undefined,
    startDate: '',
    endDate: '',
  })

  const [listApprove, setListApprove] = useState<IDatasourceApprove[]>([])
  const [total, setTotal] = useState<number>(0)

  const getListApproveMenu = async () => {
    try {
      setLoading(true)
      const res = await getListApproveApi(arg)
      if (res.body.status) {
        setListApprove(
          res.body.data.map((value, index) => {
            return { ...value, STT: Config.getIndexTable(arg.page, index), key: value.id }
          })
        )
        setTotal(res.body.paging.totalItemCount)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const idTimeOut = setTimeout(() => {
      getListApproveMenu()
    }, 500)
    return () => clearTimeout(idTimeOut)
  }, [arg])

  return (
    <div>
      <PageHeader title={'Yêu cầu phê duyệt thêm món vào menu cửa hàng.'} />
      <div className={'style-box'}>
        <Row gutter={[32, 8]}>
          <Col md={7}>
            <Input
              placeholder={'Tên cửa hàng, số điện thoại, mã số thuế.'}
              allowClear={true}
              onChange={(event) => setArg({ ...arg, search: event.target.value, page: DEFAULT_PAGE })}
            />
          </Col>
          <Col md={7}>
            <Select
              placeholder={'Trạng thái'}
              onChange={(value) =>
                setArg({ ...arg, status: value !== undefined ? Number(value) : undefined, page: DEFAULT_PAGE })
              }
              allowClear={true}
            >
              <Select.Option value={DEFINE_STATUS_APPROVE.PENDING}>Chờ phê duyệt</Select.Option>
              <Select.Option value={DEFINE_STATUS_APPROVE.ACTIVE}>Phê duyệt</Select.Option>
              <Select.Option value={DEFINE_STATUS_APPROVE.INACTIVE}>Từ chối</Select.Option>
            </Select>
          </Col>
          <Col md={7}>
            <RangePickerHoc
              onChange={(stringDate) => setArg({ ...arg, startDate: stringDate[0], endDate: stringDate[1] })}
            >
              <DatePicker.RangePicker style={{ width: '100%' }} />
            </RangePickerHoc>
          </Col>
          <Col md={3}>
            <Row justify={'end'} style={{ marginTop: 5 }}>
              Kết quả lọc {total}
            </Row>
          </Col>
        </Row>
      </div>

      <div className={'style-box'}>
        <TableHoc>
          <Table
            loading={loading}
            onRow={(record: any) => {
              return {
                onClick: () => history.push(ADMIN_ROUTER.APPROVE_MENU_DETAIL.path + `?index=${record.key}`),
              }
            }}
            columns={columns}
            dataSource={listApprove}
            pagination={{ onChange: (page) => setArg({ ...arg, page: page }), total: total, current: arg.page }}
          />
        </TableHoc>
      </div>
    </div>
  )
}

export default ApproveMenu
