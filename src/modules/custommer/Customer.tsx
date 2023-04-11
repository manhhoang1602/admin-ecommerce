import React, { useEffect } from 'react'
import { Col, DatePicker, Input, PageHeader, Row, Table } from 'antd'
import { SelectStatus } from '../../commons/select-status/SelectStatusComponent'
import RangePickerHoc from '../../commons/HOC/RangePickerHOC'
import { IColumn } from '../../services/Interfaces'
import TableHoc from '../../commons/HOC/TableHOC'
import store, { ICustomer } from './CustomerStore'
import { RenderStatus } from '../component/Component'
import { Moment } from '../../services/Moment'
import { observer } from 'mobx-react'
import { Format } from '../../services/Format'
import { DEFAULT_PAGE } from '../Constances'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'
import Config from '../../services/Config'

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
    title: 'Họ tên',
    key: 'name',
    dataIndex: 'name',
    render: (name: string, row, index) => <div>{name}</div>,
  },
  {
    title: 'Số điện thoại',
    key: 'phone',
    dataIndex: 'phone',
    render: (phone: string, row, index) => <div>{phone}</div>,
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
    render: (email: string, row, index) => <div>{Format.formatString(email)}</div>,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: (status: number, row, index) => <div>{RenderStatus(status)}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    render: (createAt: string, row, index) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
]

const Customer = observer(() => {
  useEffect(() => {
    const idTimeout = setTimeout(() => {
      store.getListCustomer()
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [store.payload.status, store.payload.page, store.payload.search, store.payload.startDate, store.payload.endDate])

  useEffect(() => {
    return () => {
      store.payload = {
        page: DEFAULT_PAGE,
        limit: Config._limit,
      }
    }
  }, [])

  return (
    <div>
      <PageHeader title={'Khách hàng'} />

      <div className={'style-box'}>
        <Row gutter={16}>
          <Col lg={7} md={7} sm={24} xs={24}>
            <Input
              onChange={(event) => {
                store.payload.search = event.target.value
                store.payload.page = DEFAULT_PAGE
              }}
              placeholder={'Tên hoặc số điện thoại khách hàng'}
              allowClear={true}
            />
          </Col>
          <Col lg={7} md={7} sm={24} xs={24}>
            <SelectStatus
              onChange={(id) => {
                store.payload.status = id
                store.payload.page = DEFAULT_PAGE
              }}
            />
          </Col>
          <Col lg={7} md={7} sm={24} xs={24}>
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
          <Col lg={3} md={3} sm={24} xs={24}>
            <Row justify={'end'} style={{ marginTop: 5 }}>
              Kết quả lọc: {store.total}
            </Row>
          </Col>
        </Row>
      </div>

      <div className={'style-box'}>
        <TableHoc>
          <Table
            loading={store.loading.getList}
            columns={columns}
            dataSource={store.listCustomer}
            onRow={(record: ICustomer) => {
              return {
                onClick: () => history.push(ADMIN_ROUTER.CUSTOMER_DETAIL.path + `?index=${record.id}`),
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

export default Customer
