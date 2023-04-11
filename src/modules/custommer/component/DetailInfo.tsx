import React, { useEffect } from 'react'
import { Card, Descriptions, Table } from 'antd'
import DescriptionsItem from 'antd/es/descriptions/Item'
import TableHoc from '../../../commons/HOC/TableHOC'
import { IColumn } from '../../../services/Interfaces'
import store from '../CustomerStore'
import { observer } from 'mobx-react'
import { Moment } from '../../../services/Moment'
import { RenderStatus } from '../../component/Component'

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    render: (STT: number, row, index) => <div>{STT}</div>,
  },
  {
    title: 'Tên người nhận hàng',
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
    title: 'Tỉnh',
    key: 'province',
    dataIndex: 'province',
    render: (province: string, row, index) => <div>{province}</div>,
  },
  {
    title: 'Quận/Huyện',
    key: 'district',
    dataIndex: 'district',
    render: (district: string, row, index) => <div>{district}</div>,
  },
  {
    title: 'Phường/Xã',
    key: 'ward',
    dataIndex: 'ward',
    render: (ward: string, row, index) => <div>{ward}</div>,
  },
  {
    title: 'Địa chỉ chi tiết',
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
]

const DetailInfo = observer(() => {
  const searchParams = new URLSearchParams(window.location.search)
  const id: number = Number(searchParams.get(`index`) as string)

  useEffect(() => {
    store.getDetailCustomer(id)
  }, [id])

  return (
    <div>
      <Card title={'Thông tin cá nhân'} bordered={false}>
        <Descriptions column={2}>
          <DescriptionsItem label={'Họ tên'}>{store.detailCustomer?.name}</DescriptionsItem>
          <DescriptionsItem label={'Ngày sinh'}>
            {store.detailCustomer?.dateOfBirth && Moment.getDate(store.detailCustomer?.dateOfBirth, 'DD/MM/YYYY')}
          </DescriptionsItem>
          <DescriptionsItem label={'Số điện thoại'}>{store.detailCustomer?.phone}</DescriptionsItem>
          <DescriptionsItem label={'Giới tính'}>{store.detailCustomer?.gender === 1 ? 'Nam' : 'Nữ'}</DescriptionsItem>
          <DescriptionsItem label={'Email'}>{store.detailCustomer?.email}</DescriptionsItem>
          <DescriptionsItem label={'Trạng thái'}>
            {RenderStatus(store.detailCustomer?.status as number)}
          </DescriptionsItem>
        </Descriptions>
      </Card>

      <Card title={'Thông tin nhận hàng'} bordered={false}>
        <TableHoc>
          <Table columns={columns} dataSource={store.dataSourceAddress} />
        </TableHoc>
      </Card>
    </div>
  )
})

export default DetailInfo
