import React, { useEffect, useRef } from 'react'
import { Button, Col, DatePicker, Input, PageHeader, Row } from 'antd'
import RangePickerHoc from '../../../../commons/HOC/RangePickerHOC'
import TableHoc from '../../../../commons/HOC/TableHOC'
import { Table } from 'antd/es'
import { IColumn } from '../../../../services/Interfaces'
import { observer } from 'mobx-react'
import { Moment } from '../../../../services/Moment'
import { Format } from '../../../../services/Format'
import store, { IListOrderRevenue } from './DetailReportRevenueStore'
import { RenderStatusOrder } from '../../../order/Order'
import { DEFAULT_PAGE } from '../../../Constances'
import history from '../../../../services/history'
import { ADMIN_ROUTER } from '../../../../router/AdminRouter'
import ExportToExcel from '../../../../commons/export-excel/ExportToExcel'

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    render: (STT: number, row, index) => <div>{STT}</div>,
  },
  {
    title: 'Mã đơn hàng',
    key: 'code',
    dataIndex: 'code',
    render: (code: string, row, index) => <div>{code}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    render: (createAt: string, row, index) => <div>{Moment.getDate(createAt, 'HH:mm DD/MM/YYYY')}</div>,
  },
  {
    title: 'Giá bán',
    key: 'price',
    dataIndex: 'price',
    render: (price: number, row, index) => <div>{Format.numberWithCommas(price, 'đ')}</div>,
  },
  {
    title: 'Số lượng',
    key: 'quantity',
    dataIndex: 'quantity',
    render: (quantity: number, row, index) => <div>{Format.numberWithCommas(quantity)}</div>,
  },
  {
    title: 'Thành tiền',
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    render: (totalPrice: number, row: IListOrderRevenue, index) => (
      <div>{Format.numberWithCommas(totalPrice, 'đ')}</div>
    ),
  },
  {
    title: 'Người mua',
    key: 'name',
    dataIndex: 'name',
    render: (name: string, row, index) => <div>{name}</div>,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: (status: number, row, index) => <div>{RenderStatusOrder(status)}</div>,
  },
]

const DetailReportRevenue = observer(() => {
  const searchParams = new URLSearchParams(window.location.search)
  const id: number = Number(searchParams.get('index') as string)

  const fnExport = useRef<Function>()
  const onExport = async () => {
    await store.getDataExport(id)
    fnExport.current && fnExport.current(store.dataExport)
  }

  useEffect(() => {
    const idTimeout = setTimeout(() => {
      store.getListOrder(id)
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [store.payload.search, store.payload.page, store.payload.endDate, store.payload.startDate])

  return (
    <div>
      <PageHeader
        title={'Chi tiết sản sản phẩm'}
        onBack={(e) => history.goBack()}
        extra={
          <ExportToExcel
            fileName={'Bao-cao-doanh-thu'}
            dataExport={store.dataExport}
            header={[]}
            button={
              <Button type={'primary'} onClick={onExport}>
                Excel
              </Button>
            }
            onExport={(fn) => {
              fnExport.current = fn
            }}
          />
        }
      />

      <div className={'style-box'}>
        <Row gutter={16}>
          <Col span={10}>
            <Input
              placeholder={'Mã đơn hàng'}
              allowClear={true}
              onChange={(event) => {
                store.payload.search = event.target.value
                store.payload.page = 1
              }}
            />
          </Col>
          <Col span={10}>
            <RangePickerHoc
              onChange={(stringDate) => {
                store.payload.startDate = stringDate[0]
                store.payload.endDate = stringDate[1]
                store.payload.page = DEFAULT_PAGE
              }}
            >
              <DatePicker.RangePicker style={{ width: '100%' }} />
            </RangePickerHoc>
          </Col>
          <Col span={4}>
            <Row justify={'end'} style={{ marginTop: 5 }}>
              Kết quả lọc: {store.total}
            </Row>
          </Col>
        </Row>
      </div>

      <div className={'style-box'}>
        <TableHoc>
          <Table
            columns={columns}
            dataSource={store.listOrder}
            loading={store.loading.get}
            onRow={(record: IListOrderRevenue) => {
              return {
                onClick: () => {
                  history.push(ADMIN_ROUTER.ORDER_DETAIL.path + `?index=${record.id}`)
                },
              }
            }}
            pagination={{
              onChange: (page) => (store.payload.page = page),
              total: store.total,
              current: store.payload.page,
            }}
          />
        </TableHoc>
      </div>
    </div>
  )
})

export default DetailReportRevenue
