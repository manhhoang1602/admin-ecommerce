import React, { useEffect, useState } from 'react'
import { Button, Card, Descriptions, Modal, PageHeader, Spin, Table, Tag } from 'antd'
import history from '../../../services/history'
import DescriptionsItem from 'antd/es/descriptions/Item'
import TableHoc from '../../../commons/HOC/TableHOC'
import { IColumn } from '../../../services/Interfaces'
import { getDetailApproveMenuApi, putChangeStatusApproveMenuApi } from '../ApproveMenuApi'
import { DEFAULT_PAGE } from '../../Constances'
import { IResDataDetailApproveMenu } from '../ApproveMenuInterfaces'
import { Format } from '../../../services/Format'
import { Moment } from '../../../services/Moment'
import Icon from '../../../commons/icon/Icon'
import Config from '../../../services/Config'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'
import { DEFINE_STATUS_APPROVE, RenderStatusApprove } from '../ApproveMenu'
import { Notification } from '../../../commons/notification/Notification'

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Mã sản phẩm',
    key: 'code',
    dataIndex: 'code',
    align: 'center',
    render: (code: string) => <div>{code}</div>,
  },
  {
    title: 'Tên sản phẩm',
    key: 'name',
    dataIndex: 'name',
    render: (name: string) => <div>{name}</div>,
  },
  {
    title: 'Danh mục',
    key: 'category',
    dataIndex: 'category',
    render: (category: string) => <div>{category}</div>,
  },
  {
    title: 'Giá',
    key: 'price',
    dataIndex: 'price',
    align: 'center',
    render: (price: number) => <div>{Format.numberWithCommas(price, 'đ')}</div>,
  },
  {
    title: 'Phân loại',
    key: 'type',
    dataIndex: 'type',
    align: 'center',
    render: (type: string) => (
      <div>{type === 'COMBO' ? <Tag color={'blue'}>Combo sản phẩm</Tag> : <Tag color={'purple'}>Sản phẩm</Tag>}</div>
    ),
  },
  {
    title: 'Chi tiết',
    key: 'option',
    dataIndex: 'option',
    align: 'center',
    render: (option: { id: number; type: 'COMBO' | 'PRODUCT' }) => (
      <div
        onClick={(event) => {
          option.type === 'PRODUCT'
            ? history.push(ADMIN_ROUTER.PRODUCT_DETAIL.path + `?index=${option.id}`)
            : history.push(ADMIN_ROUTER.COMBO_DETAIL.path + `?index=${option.id}`)
        }}
      >
        {Icon.DETAIL}
      </div>
    ),
  },
]

const ApproveDetail = () => {
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index') as string)

  const [loading, setLoading] = useState({
    getDetail: false,
  })
  const [page, setPage] = useState<number>(DEFAULT_PAGE)

  const [detail, setDetail] = useState<IResDataDetailApproveMenu>()

  const getDetail = async () => {
    try {
      setLoading({ ...loading, getDetail: true })
      const res = await getDetailApproveMenuApi(id, page)
      if (res.body.status) {
        setDetail(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getDetail: false })
    }
  }

  const changeStatus = async (status: number) => {
    try {
      Modal.confirm({
        title: (
          <>
            Bạn có chắc muốn{' '}
            {status === DEFINE_STATUS_APPROVE.INACTIVE ? (
              <span style={{ color: 'red' }}>từ chối</span>
            ) : (
              <span style={{ color: 'blue' }}>chấp nhận</span>
            )}{' '}
            yêu cầu phê duyệt thêm món của cửa hàng {detail?.shop.name}?
          </>
        ),
        okText: 'Xác nhận',
        onOk: async () => {
          const res = await putChangeStatusApproveMenuApi(id, { status: status })
          if (res.body.status) {
            Notification.PushNotification('SUCCESS', 'Thay đổi trạng thái thành công.')
          }
          getDetail()
        },
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading })
    }
  }

  useEffect(() => {
    getDetail()
  }, [page])

  return (
    <Spin spinning={loading.getDetail}>
      <PageHeader
        onBack={(e) => history.goBack()}
        title={`Chi tiết yêu cầu phê duyệt thêm món vào menu cửa hàng`}
        extra={
          detail && detail.status === DEFINE_STATUS_APPROVE.PENDING
            ? [
                <Button
                  type={'primary'}
                  danger={true}
                  onClick={(event) => changeStatus(DEFINE_STATUS_APPROVE.INACTIVE)}
                >
                  Từ chối
                </Button>,
                <Button type={'primary'} onClick={(event) => changeStatus(DEFINE_STATUS_APPROVE.ACTIVE)}>
                  Chấp nhận
                </Button>,
              ]
            : []
        }
      />

      <div className={'style-box'}>
        <Card title={'Thông tin cửa hàng'} bordered={false}>
          <Descriptions column={2}>
            <DescriptionsItem label={'Tên cửa hàng'}>
              {detail && Format.formatString(detail.shop.nameShop)}
            </DescriptionsItem>
            <DescriptionsItem label={'Tên người đại diện'}>
              {detail && Format.formatString(detail.shop.name)}
            </DescriptionsItem>
            <DescriptionsItem label={'Số điện thoại'}>
              {detail && Format.formatString(detail.shop.phone)}
            </DescriptionsItem>
            <DescriptionsItem label={'Đánh giá'}>
              {detail && Format.formatString(Number(detail.shop.star).toFixed(1))}
              <span style={{ marginLeft: 4, color: 'orange' }}>{Icon.STAR}</span>
            </DescriptionsItem>
            <DescriptionsItem label={'Email'}>{detail && Format.formatString(detail.shop.email)}</DescriptionsItem>
            <DescriptionsItem label={'Chi tiết địa chỉ cửa hàng'}>
              {detail && Format.formatString(detail.shop.addressGoogle)}
            </DescriptionsItem>
            <DescriptionsItem label={'Thời gian gửi yêu cầu'}>
              {detail && Moment.getDate(detail.createAt, 'DD/MM/YYYY')}
            </DescriptionsItem>
            <DescriptionsItem label={'Trạng thái'}>{RenderStatusApprove(detail?.status)}</DescriptionsItem>
          </Descriptions>
        </Card>
      </div>

      <div className={'style-box'}>
        <Card title={'Các món muốn bán thêm'} bordered={false}>
          <TableHoc>
            <Table
              columns={columns}
              dataSource={
                detail
                  ? detail.approveItems.map((value, index) => {
                      if (value.combo) {
                        return {
                          STT: Config.getIndexTable(page, index),
                          code: value.combo.code,
                          name: value.combo.name,
                          category: '',
                          price: value.combo.price,
                          type: value.combo ? 'COMBO' : 'PRODUCT',
                          option: { id: value.combo.id, type: 'COMBO' },
                        }
                      } else {
                        return {
                          STT: Config.getIndexTable(page, index),
                          code: value.product && value.product.code,
                          name: value.product && value.product.name,
                          category: value.product && value.product.category.name,
                          price: value.product && value.product.price,
                          option: { id: value.productId, type: 'PRODUCT' },
                        }
                      }
                    })
                  : []
              }
              pagination={{ onChange: (page) => setPage(page), current: page, total: detail ? detail?.count : 0 }}
            />
          </TableHoc>
        </Card>
      </div>
    </Spin>
  )
}

export default ApproveDetail
