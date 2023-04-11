import React from 'react'
import { Card, Descriptions, Spin, Table } from 'antd'
import DescriptionsItem from 'antd/es/descriptions/Item'
import { RenderStatusShop } from '../../Shop'
import Icon from '../../../../commons/icon/Icon'
import TableHoc from '../../../../commons/HOC/TableHOC'
import { IColumn } from '../../../../services/Interfaces'
import { IResDataDetailShop } from '../../ShopInterfaces'

interface IDataSource {
  key: number
  STT: number
  name: string
  phone: string
  star: number
  createAt: string
}

interface IProps {
  loading: boolean
  detailShop?: IResDataDetailShop
  listReviewShop: IDataSource[]
  totalReview: number
  onPageChange: (page: number) => any
}

const InfoShop: React.FC<IProps> = ({ detailShop, loading, totalReview, onPageChange, listReviewShop }) => {
  const columns: IColumn[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      width: 20,
      align: 'center',
      render: (STT: number) => <div>{STT}</div>,
    },
    {
      title: 'Họ tên',
      key: 'name',
      dataIndex: 'name',
      render: (name: string) => <div>{name}</div>,
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      dataIndex: 'phone',
      render: (phone: number) => <div>{phone}</div>,
    },
    {
      title: 'Số sao đánh giá',
      key: 'star',
      dataIndex: 'star',
      render: (star: number) => <div>{star}</div>,
    },
    {
      title: 'Thời gian đánh giá',
      key: 'createAt',
      dataIndex: 'createAt',
      render: (createAt: number) => <div>{createAt}</div>,
    },
  ]

  return (
    <Spin spinning={loading}>
      <Card title={'Thông tin cá nhân'} style={{ marginTop: 8 }}>
        <Descriptions column={2} labelStyle={{ color: 'gray' }}>
          <DescriptionsItem label={'Tên cửa hàng'}>{detailShop?.nameShop}</DescriptionsItem>
          <DescriptionsItem label={'Số điện thoại'}>{detailShop?.phone}</DescriptionsItem>
          <DescriptionsItem label={'Email'}>{detailShop?.email}</DescriptionsItem>
          <DescriptionsItem label={'Chi tiết địa chỉ cửa hàng'}>{detailShop?.address}</DescriptionsItem>
          <DescriptionsItem label={'Địa chỉ Google maps'}>{detailShop?.addressGoogle}</DescriptionsItem>
          <DescriptionsItem label={'Mã số thuế'}>{detailShop?.taxCode}</DescriptionsItem>
          <DescriptionsItem label={'Tên người đại diện'}>{detailShop?.name}</DescriptionsItem>
          <DescriptionsItem label={'Đánh giá'}>
            {detailShop?.star}
            <span style={{ color: 'orange', marginLeft: 4 }}>{Icon.STAR}</span>
          </DescriptionsItem>
          <DescriptionsItem label={'Trạng thái'}>{RenderStatusShop(detailShop?.status as number)}</DescriptionsItem>
        </Descriptions>
      </Card>

      <Card title={'Đánh giá cửa hàng'} style={{ marginTop: 8 }}>
        <TableHoc>
          <Table
            columns={columns}
            dataSource={listReviewShop}
            pagination={{ onChange: (page) => onPageChange(page), total: totalReview }}
          />
        </TableHoc>
      </Card>
    </Spin>
  )
}

export default InfoShop
