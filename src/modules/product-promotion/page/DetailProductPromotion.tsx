import React, { useEffect, useState } from 'react'
import { Button, Card, Descriptions, Modal, PageHeader, Table } from 'antd'
import history from '../../../services/history'
import DescriptionsItem from 'antd/es/descriptions/Item'
import TableHoc from '../../../commons/HOC/TableHOC'
import { IColumn } from '../../../services/Interfaces'
import { Format } from '../../../services/Format'
import { IResDataDetailProductPromotion } from '../ProductPromotionInterfaces'
import { deleteProductPromotionApi, getDetailProductPromotionApi } from '../ProductPromotionApi'
import { Moment } from '../../../services/Moment'
import { Notification } from '../../../commons/notification/Notification'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    width: 50,
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Thuộc tính',
    key: 'size',
    dataIndex: 'size',
    render: (size: string) => <div>{size}</div>,
  },
  {
    title: 'Giá gốc',
    key: 'price',
    dataIndex: 'price',
    align: 'center',
    render: (price: number) => <div>{Format.numberWithCommas(price, 'đ')}</div>,
  },
  {
    title: 'Giá khuyến mãi',
    key: 'pricePromotion',
    dataIndex: 'pricePromotion',
    align: 'center',
    render: (pricePromotion: number) => <div>{Format.numberWithCommas(pricePromotion, 'đ')}</div>,
  },
]

const DetailProductPromotion = () => {
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index') as string)

  const [loading, setLoading] = useState({
    delete: false,
    detail: false,
  })

  const [detail, setDetail] = useState<IResDataDetailProductPromotion>()

  const getDetail = async () => {
    try {
      setLoading({ ...loading, detail: true })
      const res = await getDetailProductPromotionApi(id)
      if (res.body.status) {
        setDetail(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, detail: true })
    }
  }

  const onDelete = async () => {
    try {
      Modal.confirm({
        title: `Bạn có chắc muốn xóa sản phẩm khuyến mãi ${detail?.productName}`,
        okText: 'Xác nhận',
        onOk: async () => {
          setLoading({ ...loading, delete: false })
          const res = await deleteProductPromotionApi(id)
          if (res.body.status) {
            Notification.PushNotification('SUCCESS', `Sản phẩm ${detail?.productName} đã được xóa khỏi hệ thống.`)
            setTimeout(() => {
              history.push(ADMIN_ROUTER.PRODUCT_PROMOTION.path)
            })
          }
        },
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, delete: false })
    }
  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <div>
      <PageHeader
        title={'Chi tiết sản phẩm khuyến mãi.'}
        onBack={() => history.goBack()}
        extra={[
          <Button type={'primary'} danger={true} onClick={onDelete}>
            Xóa sản phẩm
          </Button>,
          <Button
            type={'primary'}
            onClick={() => history.push(ADMIN_ROUTER.ADD_UPDATE_PRODUCT_PROMOTION.path + `?index=${id}`)}
          >
            Chỉnh sửa
          </Button>,
        ]}
      />

      <div className={'style-box'}>
        <Card title={<div className={'title-card'}>Thông tin chung</div>} bordered={false}>
          <Descriptions column={2}>
            <DescriptionsItem label={'Danh mục'}>{detail?.categoryName}</DescriptionsItem>
            <DescriptionsItem label={'Tên sản phẩm'}>{detail?.productName}</DescriptionsItem>
            <DescriptionsItem label={'Giá khuyến mại'}>
              {Format.numberWithCommas(detail?.promotionPrice, 'đ')}
            </DescriptionsItem>
            <DescriptionsItem label={'Ghi chú'}>{detail?.note}</DescriptionsItem>
          </Descriptions>
        </Card>
      </div>

      <div className={'style-box'}>
        <Card title={<div className={'title-card'}>Giá theo thuộc tính size sản phẩm</div>} bordered={false}>
          <TableHoc>
            <Table
              columns={columns}
              dataSource={
                detail
                  ? detail.product.productSizes.map((value, index) => {
                      return {
                        STT: index + 1,
                        size: value.name,
                        price: value.price,
                        pricePromotion: value.price + detail?.promotionPrice,
                      }
                    })
                  : []
              }
            />
          </TableHoc>
        </Card>
      </div>

      <div className={'style-box'}>
        <Card title={<div className={'title-card'}>Thời gian khuyến mãi</div>} bordered={false}>
          <Descriptions column={1}>
            <DescriptionsItem label={'Thời gian bắt đầu'}>
              {Moment.getDate(detail?.fromTimeSale, 'HH:mm DD/MM/YYYY')}
            </DescriptionsItem>
            <DescriptionsItem label={'Thời gian kết thúc'}>
              {Moment.getDate(detail?.toTimeSale, 'HH:mm DD/MM/YYYY')}
            </DescriptionsItem>
          </Descriptions>
        </Card>
      </div>
    </div>
  )
}

export default DetailProductPromotion
