import React, { useEffect } from 'react'
import { Col, DatePicker, Input, PageHeader, Row, Select, Table, Tag } from 'antd'
import RangePickerHoc from '../../commons/HOC/RangePickerHOC'
import TableHoc from '../../commons/HOC/TableHOC'
import { IColumn } from '../../services/Interfaces'
import { observer } from 'mobx-react'
import store, { DEFINE_SHOP_REQUEST_STATUS, IPartnerRequest } from './PartnerRequestStore'
import { Moment } from '../../services/Moment'
import { DEFAULT_PAGE } from '../Constances'
import ExpandTableComponent from './ExpandTableComponent'

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
    title: 'Tên đối tác ',
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
    title: 'Địa chỉ',
    key: 'address',
    dataIndex: 'address',
    render: (address: string, row, index) => <div>{address}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    render: (createAt: string, row, index) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: (status: number, row, index) => <div>{RenderTagStatusPartnerRequest(status)}</div>,
  },
]

const RenderTagStatusPartnerRequest = (status: number) => {
  if (status === DEFINE_SHOP_REQUEST_STATUS.ACTIVE) {
    return <Tag color={'green'}>Đã xác nhận</Tag>
  }
  if (status === DEFINE_SHOP_REQUEST_STATUS.INACTIVE) {
    return <Tag color={'orange'}>Chờ xác nhận</Tag>
  }
  if (status === DEFINE_SHOP_REQUEST_STATUS.DENY) {
    return <Tag color={'red'}>Từ chối</Tag>
  }
}

const PartnerRequest = observer(() => {
  useEffect(() => {
    const idTimeout = setTimeout(() => {
      store.getListPartner()
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [store.payload.search, store.payload.page, store.payload.status, store.payload.endDate, store.payload.startDate])

  return (
    <div>
      <PageHeader title={'Yêu cầu trở thành đối tác'} />

      <div className={'style-box'}>
        <Row gutter={16}>
          <Col span={6}>
            <Input
              onChange={(event) => {
                store.payload.search = event.target.value
                store.payload.page = DEFAULT_PAGE
              }}
              placeholder={'Tên cửa hàng, số điện thoại, mã số thuế'}
              allowClear={true}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder={'Trạng thái'}
              allowClear={true}
              onChange={(value) => {
                store.payload.status = value as number | undefined
                store.payload.page = DEFAULT_PAGE
              }}
            >
              <Select.Option value={DEFINE_SHOP_REQUEST_STATUS.DENY}>Từ chối</Select.Option>
              <Select.Option value={DEFINE_SHOP_REQUEST_STATUS.ACTIVE}>Đã xác nhận</Select.Option>
              <Select.Option value={DEFINE_SHOP_REQUEST_STATUS.INACTIVE}>Chờ xác nhận</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
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
          <Col span={6}>
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
            dataSource={store.listPartnerRequest}
            loading={store.loading.getList}
            expandedRowRender={(record: IPartnerRequest) => <ExpandTableComponent data={record} />}
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

export default React.memo(PartnerRequest)
