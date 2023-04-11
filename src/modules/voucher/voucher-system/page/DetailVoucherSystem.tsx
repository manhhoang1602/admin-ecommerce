import React, { useEffect, useState } from 'react'
import { Button, Card, Descriptions, Image, Modal, PageHeader, Spin } from 'antd'
import history from '../../../../services/history'
import DescriptionsItem from 'antd/es/descriptions/Item'
import { IResDataVoucherSystem } from '../VoucherSystemInterfaces'
import { deleteVoucherSystemApi, getDetailVoucherSystemApi } from '../VoucherSystemApi'
import { DEFINE_VOUCHER_DISCOUNT_TYPE, RenderTagTypeVoucherDiscount } from '../../approve-voucher/ApproveVoucher'
import { Format } from '../../../../services/Format'
import { Moment } from '../../../../services/Moment'
import { Notification } from '../../../../commons/notification/Notification'
import { ADMIN_ROUTER } from '../../../../router/AdminRouter'
import { isFuture } from '../../../../services/Functions'

const DetailVoucherSystem = () => {
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index') as string)
  const [loading, setLoading] = useState({
    getDetail: false,
    delete: false,
  })

  const [detailVoucher, setDetailVoucher] = useState<IResDataVoucherSystem>()

  const getDetail = async () => {
    try {
      setLoading({ ...loading, getDetail: false })
      const res = await getDetailVoucherSystemApi(id)
      if (res.body.status) {
        setDetailVoucher(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getDetail: false })
    }
  }

  const deleteVoucher = async () => {
    try {
      Modal.confirm({
        title: 'Bạn có chắc muốn xóa voucher này ra khỏi hệ thống?',
        okText: 'Xác nhận',
        onOk: async () => {
          setLoading({ ...loading, delete: false })
          const res = await deleteVoucherSystemApi(id)
          if (res.body.status) {
            Notification.PushNotification('SUCCESS', 'Xóa thành công voucher ra khỏi hệ thống.')
            history.push(ADMIN_ROUTER.VOUCHER_SYSTEM.path)
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
    <Spin spinning={loading.getDetail}>
      <PageHeader
        title={'Chi tiết voucher hệ thống'}
        onBack={(e) => history.push(ADMIN_ROUTER.VOUCHER_SYSTEM.path)}
        extra={
          isFuture(detailVoucher?.endDate)
            ? [
                <Button type={'primary'} danger={true} onClick={deleteVoucher}>
                  Xóa voucher
                </Button>,
                <Button
                  className={'btn-warning'}
                  onClick={(event) => history.push(ADMIN_ROUTER.ADD_UPDATE_VOUCHER_SYSTEM.path + `?index=${id}`)}
                >
                  Chỉnh sửa
                </Button>,
              ]
            : [
                <Button type={'primary'} danger={true} onClick={deleteVoucher}>
                  Xóa voucher
                </Button>,
              ]
        }
      />

      <div className={'style-box'}>
        <Card title={'THÔNG TIN CHUNG'} bordered={false}>
          <Descriptions column={2}>
            <DescriptionsItem label={'Mã voucher hệ thống'}>{detailVoucher?.code}</DescriptionsItem>
            <DescriptionsItem label={'Loại mã'}>
              {detailVoucher ? RenderTagTypeVoucherDiscount(detailVoucher.discountType) : '__'}
            </DescriptionsItem>
            <DescriptionsItem label={'Tên voucher hệ thống'}>{detailVoucher?.name}</DescriptionsItem>
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
      </div>

      <div className={'style-box'}>
        <Card title={'THỜI GIAN KHUYẾN MẠI'} bordered={false}>
          <Descriptions column={1}>
            <DescriptionsItem label={'Thời gian bắt đầu'}>
              {detailVoucher && detailVoucher.startDate ? Moment.getDate(detailVoucher.startDate, 'DD/MM/YYYY') : '___'}
            </DescriptionsItem>
            <DescriptionsItem label={'Thời gian kết thúc'}>
              {detailVoucher && detailVoucher.endDate ? Moment.getDate(detailVoucher.endDate, 'DD/MM/YYYY') : '___'}
            </DescriptionsItem>
            <DescriptionsItem label={'Ảnh thumbnail voucher'}>
              {<Image src={detailVoucher?.url} width={300} />}
            </DescriptionsItem>
          </Descriptions>
        </Card>
      </div>
    </Spin>
  )
}

export default DetailVoucherSystem
