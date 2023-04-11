import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Descriptions, Image, Modal, PageHeader, Row, Spin } from 'antd'
import history from '../../../services/history'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'
import DescriptionsItem from 'antd/es/descriptions/Item'
import { DEFINE_VOUCHER_DISCOUNT_TYPE, RenderTagTypeVoucherDiscount } from '../approve-voucher/ApproveVoucher'
import { Format } from '../../../services/Format'
import { Moment } from '../../../services/Moment'
import { IResDataVoucherShop } from './VoucherShopInterface'
import { deleteVoucherShopApi, getDetailVoucherShopApi, putChangeStatusApi } from './VoucherShopApi'
import { Notification } from '../../../commons/notification/Notification'
import { DEFINE_STATUS } from '../../Constances'

const DetailVoucherShop = () => {
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index') as string)
  const [loading, setLoading] = useState({
    getDetail: false,
    delete: false,
  })

  const [detailVoucher, setDetailVoucher] = useState<IResDataVoucherShop>()

  const deleteVoucher = () => {
    try {
      Modal.confirm({
        title: 'Bạn có muốn xóa voucher này ra khỏi hệ thống không.',
        okText: 'Xác nhận.',
        onOk: async () => {
          setLoading({ ...loading, delete: true })
          const res = await deleteVoucherShopApi(id)
          if (res.body.status) {
            Notification.PushNotification('SUCCESS', 'Voucher đã được xóa ra khỏi hệ thống.')
            setTimeout(() => {
              history.push(ADMIN_ROUTER.VOUCHER_SHOP.path)
            }, 500)
          }
        },
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, delete: false })
    }
  }

  const getDetailVoucher = async () => {
    try {
      setLoading({ ...loading, getDetail: true })
      const res = await getDetailVoucherShopApi(id)
      if (res.body.status) {
        setDetailVoucher(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getDetail: false })
    }
  }

  const changeStatusVoucher = () => {
    try {
      Modal.confirm({
        title: `Bạn có chắc muốn voucher này ${detailVoucher?.status ? 'ngưng hoạt động' : 'hoạt động'}?`,
        okText: 'Xác nhận',
        onOk: async () => {
          const res = await putChangeStatusApi(
            id,
            detailVoucher?.status ? DEFINE_STATUS.INACTIVE : DEFINE_STATUS.ACTIVE
          )
          if (res.body.status) {
            Notification.PushNotification('SUCCESS', 'Thay đổi trạng thái thành công.')
            getDetailVoucher()
          }
        },
      })
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getDetailVoucher()
  }, [])

  return (
    <Spin spinning={loading.getDetail}>
      <PageHeader
        title={'Chi tiết voucher cửa hàng'}
        onBack={(e) => history.push(ADMIN_ROUTER.VOUCHER_SHOP.path)}
        extra={[
          <Button type={'primary'} danger={true} onClick={deleteVoucher}>
            Xóa voucher
          </Button>,
          <Button
            type={'primary'}
            className={detailVoucher?.status ? '' : 'btn-secondary'}
            onClick={changeStatusVoucher}
          >
            {detailVoucher?.status ? 'Ngưng hoạt động' : 'Hoạt động'}
          </Button>,
          <Button
            className={'btn-warning'}
            onClick={(event) => history.push(ADMIN_ROUTER.VOUCHER_SHOP_ADD_UPDATE.path + `?index=${id}`)}
          >
            Chỉnh sửa
          </Button>,
        ]}
      />

      <div className={'style-box'}>
        <Card title={'THÔNG TIN CHUNG'} bordered={false}>
          <Descriptions column={2}>
            <DescriptionsItem label={'Mã voucher cửa hàng'}>{detailVoucher?.code}</DescriptionsItem>
            <DescriptionsItem label={'Loại mã'}>
              {detailVoucher ? RenderTagTypeVoucherDiscount(detailVoucher.discountType) : '__'}
            </DescriptionsItem>
            <DescriptionsItem label={'Tên voucher cửa hàng'}>{detailVoucher?.name}</DescriptionsItem>
            <DescriptionsItem label={'Mức giảm'}>
              <span style={{ color: 'red' }}>
                {detailVoucher &&
                  Format.numberWithCommas(
                    detailVoucher.discountValue,
                    detailVoucher.discountType === DEFINE_VOUCHER_DISCOUNT_TYPE.PERCENT ? '%' : 'đ'
                  )}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={'Giá trị tối thiểu đơn hàng'}>
              {detailVoucher && Format.numberWithCommas(detailVoucher.minPriceOrder, 'đ')}
            </DescriptionsItem>
            <DescriptionsItem label={'Người tạo'}>{detailVoucher?.createdBy}</DescriptionsItem>
            <DescriptionsItem label={'Mô tả'}>
              <p dangerouslySetInnerHTML={{ __html: Format.formatString(detailVoucher?.description) }} />
            </DescriptionsItem>
          </Descriptions>
        </Card>
      </div>

      <div className={'style-box'}>
        <Row gutter={[32, 16]}>
          <Col lg={12}>
            <Card title={'THÔNG TIN SỐ LƯỢNG VOUCHER'} bordered={false}>
              <Descriptions column={1}>
                <DescriptionsItem label={'Số lượng quy định'}>
                  <span style={{ color: 'red' }}>{Format.numberWithCommas(detailVoucher?.quantity)}</span>
                </DescriptionsItem>
                <DescriptionsItem label={'Số lượng đã sử dụng'}>
                  <span style={{ color: 'orange' }}>
                    {detailVoucher && Format.numberWithCommas(detailVoucher.quantity - detailVoucher.remainQuantity)}
                  </span>
                </DescriptionsItem>
                <DescriptionsItem label={'Số lượng còn lại'}>
                  <span style={{ color: 'blue' }}>{Format.numberWithCommas(detailVoucher?.remainQuantity)}</span>
                </DescriptionsItem>
              </Descriptions>
            </Card>
          </Col>
          <Col lg={12}>
            <Card title={'THỜI GIAN KHUYẾN MẠI'} bordered={false}>
              <Descriptions column={1}>
                <DescriptionsItem label={'Thời gian bắt đầu'}>
                  {detailVoucher && detailVoucher.startDate
                    ? Moment.getDate(detailVoucher.startDate, 'DD/MM/YYYY')
                    : '___'}
                </DescriptionsItem>
                <DescriptionsItem label={'Thời gian kết thúc'}>
                  {detailVoucher && detailVoucher.endDate ? Moment.getDate(detailVoucher.endDate, 'DD/MM/YYYY') : '___'}
                </DescriptionsItem>
                <DescriptionsItem label={'Ảnh thumbnail voucher'}>
                  {<Image src={detailVoucher?.url} style={{ objectFit: 'cover', width: 160, height: 100 }} />}
                </DescriptionsItem>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  )
}

export default DetailVoucherShop
