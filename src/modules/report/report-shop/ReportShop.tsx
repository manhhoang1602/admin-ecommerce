import React, { useEffect, useRef } from 'react'
import { Button, Col, DatePicker, Input, PageHeader, Row } from 'antd'
import RangePickerHoc from '../../../commons/HOC/RangePickerHOC'
import TableHoc from '../../../commons/HOC/TableHOC'
import { Table } from 'antd/es'
import { IColumn } from '../../../services/Interfaces'
import { observer } from 'mobx-react'
import { Format } from '../../../services/Format'
import store from './ReportShopStore'
import { DEFAULT_PAGE } from '../../Constances'
import ExportToExcel from '../../../commons/export-excel/ExportToExcel'

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    width: 80,
    align: 'center',
    render: (STT: number, row, index) => <div>{STT}</div>,
  },
  {
    title: 'Tên gian hàng',
    key: 'nameShop',
    dataIndex: 'nameShop',
    render: (nameShop: string, row, index) => <div>{nameShop}</div>,
  },
  {
    title: 'Tổng đơn',
    key: 'orderTotal',
    dataIndex: 'orderTotal',
    align: 'center',
    render: (orderTotal: number, row, index) => <div>{Format.numberWithCommas(orderTotal)}</div>,
  },
  {
    title: 'Tổng SL sản phẩm',
    key: 'quantityTotal',
    dataIndex: 'quantityTotal',
    align: 'center',
    render: (quantityTotal: number, row, index) => <div>{Format.numberWithCommas(quantityTotal)}</div>,
  },
  {
    title: 'Tổng giá trị ĐH',
    key: 'moneyTotal',
    dataIndex: 'moneyTotal',
    align: 'center',
    render: (moneyTotal: number, row, index) => <div>{Format.numberWithCommas(moneyTotal, 'đ')}</div>,
  },
  {
    title: 'Tổng đơn hoàn thành',
    key: 'orderDone',
    dataIndex: 'orderDone',
    align: 'center',
    render: (orderDone: number, row, index) => <div>{Format.numberWithCommas(orderDone)}</div>,
  },
  {
    title: 'SL sản phẩm hoàn thành',
    key: 'quantityDone',
    dataIndex: 'quantityDone',
    align: 'center',
    render: (quantityDone: number, row, index) => <div>{Format.numberWithCommas(quantityDone, '')}</div>,
  },
  {
    title: 'Giá trị ĐH hoàn thành',
    key: 'moneyDone',
    dataIndex: 'moneyDone',
    align: 'center',
    render: (moneyDone: number, row, index) => <div>{Format.numberWithCommas(moneyDone, 'đ')}</div>,
  },
  {
    title: 'Thành công',
    key: 'percent',
    dataIndex: 'percent',
    align: 'center',
    render: (percent: number, row, index) => <div>{Format.numberWithCommas(percent, '%')}</div>,
  },
]
const ReportShop = observer(() => {
  const fnExport = useRef<Function>()
  const onExport = async () => {
    await store.getDataExport()
    fnExport.current && fnExport.current(store.dataExport)
  }

  useEffect(() => {
    const idTimeout = setTimeout(() => {
      store.getListReportShop()
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [store.payload.page, store.payload.endDate, store.payload.startDate, store.payload.search])

  return (
    <div>
      <PageHeader
        title={'Báo cáo cửa hàng'}
        extra={
          <ExportToExcel
            fileName={'Bao-cao-cua-hang'}
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
          <Col lg={10} md={10} sm={24} xs={24}>
            <Input
              placeholder={'Tên cửa hàng'}
              allowClear={true}
              onChange={(event) => {
                store.payload.search = event.target.value
                store.payload.page = DEFAULT_PAGE
              }}
            />
          </Col>
          <Col lg={10} md={10} sm={24} xs={24}>
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
          <Col lg={4} md={4} sm={24} xs={24}>
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
            dataSource={store.listReportShop}
            loading={store.loading.getList}
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

export default ReportShop
