import React, { useEffect, useRef } from 'react'
import { Button, Col, DatePicker, Input, PageHeader, Row } from 'antd'
import RangePickerHoc from '../../../commons/HOC/RangePickerHOC'
import TableHoc from '../../../commons/HOC/TableHOC'
import { Table } from 'antd/es'
import { IColumn } from '../../../services/Interfaces'
import SelectCategoryComponent from '../../category/component/SelectCategoryComponent'
import SelectShopComponent from '../../shop/component/SelectShopComponent'
import { observer } from 'mobx-react'
import store, { IListProductReport } from './ReportRevenueStore'
import { Format } from '../../../services/Format'
import { DEFAULT_PAGE } from '../../Constances'
import history from '../../../services/history'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'
import ExportToExcel from '../../../commons/export-excel/ExportToExcel'
import Config from '../../../services/Config'

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
    title: 'Tên sản phẩm',
    key: 'productName',
    dataIndex: 'productName',
    render: (productName: string, row, index) => <div>{productName}</div>,
  },
  {
    title: 'Nhóm sản phẩm',
    key: 'categoryName',
    dataIndex: 'categoryName',
    render: (categoryName: string, row, index) => <div>{categoryName}</div>,
  },
  {
    title: 'Cửa hàng',
    key: 'nameShop',
    dataIndex: 'nameShop',
    render: (nameShop: string, row, index) => <div>{nameShop}</div>,
  },
  {
    title: 'SL đã bán',
    key: 'totalDoneOrder',
    dataIndex: 'totalDoneOrder',
    render: (totalDoneOrder: number, row, index) => <div>{Format.numberWithCommas(totalDoneOrder)}</div>,
  },
  {
    title: 'Số đơn hàng',
    key: 'totalSoldProduct',
    dataIndex: 'totalSoldProduct',
    render: (totalSoldProduct: number, row, index) => <div>{Format.numberWithCommas(totalSoldProduct)}</div>,
  },
  {
    title: 'Tổng tiền thực tế',
    key: 'totalRevenue',
    dataIndex: 'totalRevenue',
    render: (totalRevenue: number, row, index) => <div>{Format.numberWithCommas(totalRevenue, 'đ')}</div>,
  },
]

const ReportRevenue = observer(() => {
  useEffect(() => {
    const idTimeout = setTimeout(() => {
      store.getListProductReport()
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [
    store.payload.page,
    store.payload.search,
    store.payload.endDate,
    store.payload.endDate,
    store.payload.category_id,
    store.payload.shop_id,
  ])

  useEffect(() => {
    return () => {
      store.payload = {
        page: DEFAULT_PAGE,
        limit: Config._limit,
      }
    }
  }, [])

  const fnExport = useRef<Function>()
  const onExport = async () => {
    await store.getDataExport()
    fnExport.current && fnExport.current(store.dataExport)
  }

  return (
    <div>
      <PageHeader
        title={'Báo cáo bán hàng'}
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
          <Col lg={5} md={5} sm={24} xs={24}>
            <Input
              placeholder={'Tên sản phẩm'}
              allowClear={true}
              onChange={(event) => {
                store.payload.search = event.target.value
                store.payload.page = DEFAULT_PAGE
              }}
            />
          </Col>
          <Col lg={5} md={5} sm={24} xs={24}>
            <SelectCategoryComponent
              onSelected={(value) => {
                store.payload.category_id = value
                store.payload.page = DEFAULT_PAGE
              }}
            />
          </Col>
          <Col lg={5} md={5} sm={24} xs={24}>
            <SelectShopComponent
              onSelect={(value) => {
                store.payload.shop_id = value as number | undefined
                store.payload.page = DEFAULT_PAGE
              }}
            />
          </Col>
          <Col lg={5} md={5} sm={24} xs={24}>
            <RangePickerHoc
              onChange={(stringDate) => {
                store.payload.startDate = stringDate[0]
                store.payload.endDate = stringDate[1]
                store.payload.page = DEFAULT_PAGE
              }}
            >
              <DatePicker.RangePicker />
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
            dataSource={store.listProductReport}
            loading={store.loading.getList}
            onRow={(record: IListProductReport) => {
              return {
                onClick: () => history.push(ADMIN_ROUTER.REPORT_REVENUE_DETAIL.path + `?index=${record.productId}`),
              }
            }}
            pagination={{
              onChange: (page) => {
                store.payload.page = page
              },
              total: store.total,
              current: store.payload.page,
            }}
          />
        </TableHoc>
      </div>
    </div>
  )
})

export default ReportRevenue
