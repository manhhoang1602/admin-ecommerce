import React, { useEffect } from 'react'
import { DatePicker, Row, Table } from 'antd'
import RangePickerHoc from '../../../commons/HOC/RangePickerHOC'
import TableHoc from '../../../commons/HOC/TableHOC'
import { IColumn } from '../../../services/Interfaces'
import { Format } from '../../../services/Format'
import { RenderStatusOrder } from '../../order/Order'
import { Moment } from '../../../services/Moment'
import Icon from '../../../commons/icon/Icon'
import { observer } from 'mobx-react'
import store from './OrderCustomerStore'
import { DEFAULT_PAGE } from '../../Constances'
import history from '../../../services/history'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'
import { IResDataOrderCustomer } from '../CustomerInterfaces'

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    width: 80,
    render: (STT: number, row, index) => <div>{STT}</div>,
  },
  {
    title: 'Mã đơn hàng',
    key: 'code',
    dataIndex: 'code',
    render: (code: string, row, index) => <div>{code}</div>,
  },
  {
    title: 'Tên người nhận',
    key: 'receiveAddress',
    dataIndex: 'receiveAddress',
    render: (receiveAddress: { name: string }, row, index) => <div>{receiveAddress ? receiveAddress.name : '___'}</div>,
  },
  {
    title: 'Tên CHXD',
    key: 'shop',
    dataIndex: 'shop',
    render: (shop: { nameShop: string }, row, index) => <div>{shop.nameShop}</div>,
  },
  {
    title: 'Tiền thanh toán',
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    render: (totalPrice: number, row, index) => <div>{Format.numberWithCommas(totalPrice, 'đ')}</div>,
  },
  {
    title: 'Trạng thái đơn hàng',
    key: 'status',
    dataIndex: 'status',
    render: (status: number, row, index) => <div>{RenderStatusOrder(status)}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    align: 'center',
    render: (createAt: string, row, index) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
  {
    title: 'Chi tiết',
    key: 'detail',
    dataIndex: 'detail',
    align: 'center',
    render: (detail: IResDataOrderCustomer, row, index) => (
      <div onClick={(event) => history.push(ADMIN_ROUTER.ORDER_DETAIL.path + `?index=${detail.id}`)}>{Icon.DETAIL}</div>
    ),
  },
]

const ListOrder = observer(() => {
  const searchParams = new URLSearchParams(window.location.search)
  const id: number = Number(searchParams.get('index') as string)

  useEffect(() => {
    store.getListOrderCustomer(id)
  }, [store.payload.page, store.payload.endDate, store.payload.startDate])

  return (
    <div className={'style-box'}>
      <Row justify={'end'} className={'mb-16'}>
        <RangePickerHoc
          onChange={(stringDate) => {
            store.payload.startDate = stringDate[0]
            store.payload.endDate = stringDate[1]
            store.payload.page = DEFAULT_PAGE
          }}
        >
          <DatePicker.RangePicker />
        </RangePickerHoc>
      </Row>
      <TableHoc>
        <Table
          columns={columns}
          dataSource={store.listOrderCustomer}
          loading={store.loading}
          pagination={{
            onChange: (page) => (store.payload.page = page),
            total: store.total,
            current: store.payload.page,
          }}
        />
      </TableHoc>
    </div>
  )
})

export default ListOrder
