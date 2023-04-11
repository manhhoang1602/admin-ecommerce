import React, { useEffect } from 'react'
import { Card, Descriptions, PageHeader, Spin, Table } from 'antd'
import history from '../../../services/history'
import DescriptionsItem from 'antd/es/descriptions/Item'
import TableHoc from '../../../commons/HOC/TableHOC'
import store, { DEFINE_GENDER } from '../DriverStore'
import { observer } from 'mobx-react'
import { Format } from '../../../services/Format'
import { Moment } from '../../../services/Moment'
import { RenderStatus } from '../../component/Component'
import { IColumn } from '../../../services/Interfaces'
import { RenderStatusOrder } from '../../order/Order'
import Icon from '../../../commons/icon/Icon'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'

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
    title: 'Tổng tiền',
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    render: (totalPrice: number, row, index) => <div>{Format.numberWithCommas(totalPrice, 'đ')}</div>,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: (status: number, row, index) => <div>{RenderStatusOrder(status)}</div>,
  },
  {
    title: 'TG Hoàn thành/Hủy',
    key: 'updateAt',
    dataIndex: 'updateAt',
    render: (updateAt: string, row, index) => <div>{Moment.getDate(updateAt, 'DD/MM/YYYY')}</div>,
  },
  {
    title: 'TG tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    render: (createAt, row, index) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
  {
    title: 'Chi tiết',
    key: 'option',
    dataIndex: 'option',
    render: (option: { id: number }, row, index) => (
      <div onClick={(event) => history.push(ADMIN_ROUTER.ORDER_DETAIL.path + `?index=${option.id}`)}>{Icon.DETAIL}</div>
    ),
  },
]

const DetailDriver = observer(() => {
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index') as string)

  const { detailDriver } = store

  useEffect(() => {
    store.getDetailDriver(id)
  }, [])

  return (
    <Spin spinning={store.loading.getDetail}>
      <PageHeader title={'Chi tiết tài xế'} onBack={(e) => history.goBack()} />

      <div className={'style-box'}>
        <Card title={'Thông tin tài xế'} bordered={false}>
          <Descriptions column={2}>
            <DescriptionsItem label={'Tên tài xế'}>{detailDriver?.name}</DescriptionsItem>
            <DescriptionsItem label={'Thuộc cửa hàng'}>
              {Format.formatString(detailDriver?.shop.nameShop)}
            </DescriptionsItem>
            <DescriptionsItem label={'Số điện thoại'}>{detailDriver?.phone}</DescriptionsItem>
            <DescriptionsItem label={'Địa chỉ'}>{Format.formatString(detailDriver?.address)}</DescriptionsItem>
            <DescriptionsItem label={'Ngày sinh'}>
              {detailDriver?.dateOfBirth ? Moment.getDate(detailDriver?.dateOfBirth, 'DD/MM/YYYY') : '_ _ _'}
            </DescriptionsItem>
            <DescriptionsItem label={'Trạng thái'}>{RenderStatus(detailDriver?.status as number)}</DescriptionsItem>
            <DescriptionsItem label={'Giới tính'}>
              {detailDriver?.gender === DEFINE_GENDER.MALE ? 'Nam' : 'Nữ'}
            </DescriptionsItem>
          </Descriptions>
        </Card>
      </div>

      <div className={'style-box'}>
        <Card title={'Lịch sử nhận đơn'} bordered={false}>
          <TableHoc>
            <Table columns={columns} dataSource={store.getDatasourceOrderDriver} />
          </TableHoc>
        </Card>
      </div>
    </Spin>
  )
})

export default DetailDriver
