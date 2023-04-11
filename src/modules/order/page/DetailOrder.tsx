import React, { useEffect, useState } from 'react'
import { Card, Col, Descriptions, PageHeader, Row, Spin, Table, Tag, Timeline } from 'antd'
import DescriptionsItem from 'antd/es/descriptions/Item'
import TableHoc from '../../../commons/HOC/TableHOC'
import { IColumn } from '../../../services/Interfaces'
import { getDetailOrderApi } from '../OrderApi'
import { IResDataDetailOrder } from '../OrderInterfaeces'
import { Format } from '../../../services/Format'
import history from '../../../services/history'
import { Moment } from '../../../services/Moment'
import { DEFINE_ORDER_STATUS, RenderStatusOrder } from '../Order'

export const DELIVER_TYPE = {
  DELIVERY: 0, // giao hàng tận nơi
  TAKE_AWAY: 1, // lấy tại cửa hàng
}

const RenderTypeDeliver = (type: number) => {
  if (type === DELIVER_TYPE.DELIVERY) {
    return <Tag color={'blue'}>Giao hàng tận nơi</Tag>
  }
  if (type === DELIVER_TYPE.TAKE_AWAY) {
    return <Tag color={'orange'}>Lấy tại cửa hàng</Tag>
  }
}

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Tên sản phẩm',
    key: 'name',
    dataIndex: 'name',
    align: 'center',
    render: (name: string) => <div>{name}</div>,
  },
  {
    title: 'Thuộc tính ',
    key: 'sizeName',
    dataIndex: 'sizeName',
    align: 'center',
    render: (sizeName: string) => <div>{Format.formatString(sizeName)}</div>,
  },
  {
    title: 'Topping',
    key: 'toppingName',
    dataIndex: 'toppingName',
    align: 'center',
    render: (toppingName: string) => <div>{Format.formatString(toppingName)}</div>,
  },
  {
    title: 'Số lượng',
    key: 'quantity',
    dataIndex: 'quantity',
    align: 'center',
    render: (quantity: number) => <div>{quantity}</div>,
  },
  {
    title: 'Giá bán',
    key: 'price',
    dataIndex: 'price',
    align: 'center',
    render: (price: number) => <div>{Format.numberWithCommas(price, 'đ')}</div>,
  },
  {
    title: 'Thành tiền',
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    align: 'center',
    render: (totalPrice: number) => <div>{Format.numberWithCommas(totalPrice, 'đ')}</div>,
  },
]

const RenderTimeLive = (props: { status: number; createAt: string }) => {
  if (props.status === DEFINE_ORDER_STATUS.DONE) {
    return (
      <Timeline.Item color={'green'}>
        Hoàn thành{' '}
        <span style={{ fontFamily: 'open sans-bold', marginLeft: 4 }}>
          {Moment.getDate(props.createAt, 'DD-MM-YYYY')}
        </span>
      </Timeline.Item>
    )
  }
  if (props.status === DEFINE_ORDER_STATUS.CANCEL) {
    return (
      <Timeline.Item color={'green'}>
        Hủy{' '}
        <span style={{ fontFamily: 'open sans-bold', marginLeft: 4 }}>
          {Moment.getDate(props.createAt, 'DD-MM-YYYY')}
        </span>
      </Timeline.Item>
    )
  }
  if (props.status === DEFINE_ORDER_STATUS.ARRIVED) {
    return (
      <Timeline.Item color={'green'}>
        Đã đến nơi{' '}
        <span style={{ fontFamily: 'open sans-bold', marginLeft: 4 }}>
          {Moment.getDate(props.createAt, 'DD-MM-YYYY')}
        </span>
      </Timeline.Item>
    )
  }
  if (props.status === DEFINE_ORDER_STATUS.PENDING) {
    return (
      <Timeline.Item color={'green'}>
        Chờ xác nhận{' '}
        <span style={{ fontFamily: 'open sans-bold', marginLeft: 4 }}>
          {Moment.getDate(props.createAt, 'DD-MM-YYYY')}
        </span>
      </Timeline.Item>
    )
  }
  if (props.status === DEFINE_ORDER_STATUS.DELIVERING) {
    return (
      <Timeline.Item color={'green'}>
        Đang vận chuyển{' '}
        <span style={{ fontFamily: 'open sans-bold', marginLeft: 4 }}>
          {Moment.getDate(props.createAt, 'DD-MM-YYYY')}
        </span>
      </Timeline.Item>
    )
  }
  if (props.status === DEFINE_ORDER_STATUS.CONFIRMED) {
    return (
      <Timeline.Item color={'green'}>
        Xác nhận{' '}
        <span style={{ fontFamily: 'open sans-bold', marginLeft: 4 }}>
          {Moment.getDate(props.createAt, 'DD-MM-YYYY')}
        </span>
      </Timeline.Item>
    )
  }
}

const DetailOrder = () => {
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index') as string)

  const [loading, setLoading] = useState<boolean>(false)
  const [detail, setDetail] = useState<IResDataDetailOrder>()

  const getDetail = async () => {
    try {
      setLoading(true)
      const res = await getDetailOrderApi(id)
      if (res.body.status) {
        setDetail(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <Spin spinning={loading}>
      <PageHeader title={`Đơn hàng ${detail?.code}`} onBack={() => history.goBack()} />

      <Row gutter={[8, 8]} style={{ margin: '0px 8px 0px 5px' }}>
        <Col md={12}>
          <div style={{ backgroundColor: 'white' }}>
            <Card title={'Thông tin cửa hàng'} bordered={false} extra={RenderTypeDeliver(detail?.isDelivery as number)}>
              <Descriptions column={1}>
                <DescriptionsItem label={'Tên cửa hàng'}>
                  {Format.formatString(detail && detail.shop ? detail.shop.nameShop : '')}
                </DescriptionsItem>
                <DescriptionsItem label={'Số điện thoại'}>
                  {Format.formatString(detail && detail.shop ? detail.shop.phone : '')}
                </DescriptionsItem>
                <DescriptionsItem label={'Địa chỉ chi tiết'}>{detail?.shop.address}</DescriptionsItem>
              </Descriptions>
            </Card>

            <Card title={'Thông tin khách hàng'} bordered={false}>
              <Descriptions column={1}>
                <DescriptionsItem label={'Tên người nhận'}>
                  {Format.formatString(detail?.customerAddress && detail.customerAddress.name)}
                </DescriptionsItem>
                <DescriptionsItem label={'Số điện thoại'}>
                  {Format.formatString(detail?.customerAddress && detail.customerAddress.phone)}
                </DescriptionsItem>
              </Descriptions>
            </Card>

            <Card title={'Thông tin Người nhận hàng'} bordered={false}>
              <Descriptions column={1}>
                <DescriptionsItem label={'Tên người nhận'}>
                  {Format.formatString(detail?.customerAddress && detail.customerAddress.name)}
                </DescriptionsItem>
                <DescriptionsItem label={'Số điện thoại'}>
                  {Format.formatString(detail?.customerAddress && detail.customerAddress.phone)}
                </DescriptionsItem>
                <DescriptionsItem label={'Địa chỉ chi tiết'}>
                  {Format.formatString(detail?.customerAddress?.wardName, true) +
                    Format.formatString(detail?.customerAddress?.districtName, true, ' -') +
                    Format.formatString(detail?.customerAddress?.provinceName, true, ' -')}
                </DescriptionsItem>
              </Descriptions>
            </Card>
          </div>
        </Col>
        <Col md={12}>
          <div style={{ height: '100%', backgroundColor: 'white' }}>
            <Card title={'Tài xế nhận đơn'} bordered={false}>
              <Descriptions column={1}>
                <DescriptionsItem label={'Tên tài xế'}>
                  {detail && detail.driver ? detail.driver.name : '_ _ _'}
                </DescriptionsItem>
                <DescriptionsItem label={'Số điện thoại'}>
                  {detail && detail.driver ? detail.driver.phone : '_ _ _'}
                </DescriptionsItem>
              </Descriptions>
            </Card>

            <Card title={'Lịch sử đơn hàng'} bordered={false}>
              <Timeline style={{ marginTop: 10 }}>
                {detail &&
                  detail.orderHistories.map((value) => {
                    return RenderTimeLive({ status: value.status, createAt: value.createAt })
                  })}
              </Timeline>
            </Card>
          </div>
        </Col>
      </Row>

      <div className={'style-box'}>
        <Card title={'Thông tin đơn hàng'} bordered={false} extra={RenderStatusOrder(detail?.status as number)}>
          <Row gutter={[12, 12]}>
            <Col md={12}>
              <Descriptions column={1}>
                <DescriptionsItem label={'Mã đơn hàng'}>{detail && detail.code}</DescriptionsItem>
                <DescriptionsItem label={'Số lượng sản phẩm'}>
                  {detail && Format.numberWithCommas(detail.totalQuantity, 'sản phẩm')}
                </DescriptionsItem>
              </Descriptions>
            </Col>
            <Col md={12}>
              <Descriptions column={1}>
                <DescriptionsItem label={'Tổng tiền'}>
                  {detail &&
                    Format.numberWithCommas(
                      detail.discountProductPrice + detail.discountPrice + detail.totalPrice,
                      'đ'
                    )}
                </DescriptionsItem>
                <DescriptionsItem label={'Tổng tiền giảm theo KM sản phẩm'}>
                  {detail && Format.numberWithCommas(detail.discountProductPrice, 'đ')}
                </DescriptionsItem>
                <DescriptionsItem label={'Tổng tiền giảm theo voucher'}>
                  {detail && Format.numberWithCommas(detail.discountPrice, 'đ')}
                </DescriptionsItem>
                <DescriptionsItem label={'Tổng tiền thanh toán'}>
                  {detail && Format.numberWithCommas(detail.totalPrice, 'đ')}
                </DescriptionsItem>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </div>

      <div className={'style-box'}>
        <Card title={'Danh sách sản phẩm'} bordered={false}>
          <TableHoc>
            <Table
              columns={columns}
              dataSource={
                detail
                  ? detail.orderItems.map((value, index) => {
                      return {
                        ...value,
                        STT: index + 1,
                        price: value.product.price,
                        key: value.id,
                        totalPrice: value.product.price * value.quantity,
                        name: value.product.productName ? value.product.productName : value.product.comboName,
                        sizeName: value.product.sizeName,
                        toppingName: value.product.toppingName,
                      }
                    })
                  : []
              }
            />
          </TableHoc>
        </Card>
      </div>
    </Spin>
  )
}

export default DetailOrder
