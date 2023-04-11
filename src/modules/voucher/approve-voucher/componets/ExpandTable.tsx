import React, { useState } from 'react'
import { Button, Card, Descriptions, Image, Popconfirm } from 'antd'
import DescriptionsItem from 'antd/es/descriptions/Item'
import {
  DEFINE_VOUCHER_DISCOUNT_TYPE,
  DEFINE_VOUCHER_STATUS,
  IDatasourceApproveVoucher,
  RenderTagTypeVoucherDiscount,
} from '../ApproveVoucher'
import { Moment } from '../../../../services/Moment'
import { Format } from '../../../../services/Format'
import Icon from '../../../../commons/icon/Icon'
import PopconfirmHoc from '../../../../commons/HOC/PopconfirmHOC'
import { putChangeStatusVoucherRequestApi } from '../ApproveVoucherApi'
import { Notification } from '../../../../commons/notification/Notification'

const ExpandTable = (props: { record: IDatasourceApproveVoucher; onChangeStatusSuccess?: () => any }) => {
  const { record, onChangeStatusSuccess } = props

  const [loading, setLoading] = useState({
    approve: false,
    reject: false,
  })

  const onChangeStatus = async (status: number) => {
    try {
      if (status === DEFINE_VOUCHER_STATUS.REFUSE) {
        setLoading({ ...loading, reject: true })
      }
      if (status === DEFINE_VOUCHER_STATUS.ACTIVE) {
        setLoading({ ...loading, approve: true })
      }
      const res = await putChangeStatusVoucherRequestApi(record.id, { status: status })
      if (res.body.status) {
        if (status === DEFINE_VOUCHER_STATUS.REFUSE) {
          Notification.PushNotification('SUCCESS', 'Từ chối phê duyệt voucher thành công.')
        }
        if (status === DEFINE_VOUCHER_STATUS.ACTIVE) {
          Notification.PushNotification('SUCCESS', 'Chấp nhận phê duyệt phê duyệt thành công.')
        }
        onChangeStatusSuccess && onChangeStatusSuccess()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, reject: false, approve: false })
    }
  }

  return (
    <div style={{ margin: 0, backgroundColor: 'white', padding: 8 }}>
      <Card title={'Chi tiết đăng ký'} bordered={false}>
        <Card title={<div style={{ fontSize: 15 }}>Thông tin cửa hàng đăng ký</div>} bordered={false}>
          <Descriptions column={2}>
            <DescriptionsItem label={'Tên cửa hàng'}>{record.nameShop}</DescriptionsItem>
            <DescriptionsItem label={'Số điện thoại'}>{record.phone}</DescriptionsItem>
            <DescriptionsItem label={'Email'}>{record.email}</DescriptionsItem>
            <DescriptionsItem label={'Thời gian gửi'}>{Moment.getDate(record.createAt, 'DD/MM/YYYY')}</DescriptionsItem>
          </Descriptions>
        </Card>
        <Card
          title={<div style={{ fontSize: 15 }}>Thông tin voucher</div>}
          bordered={false}
          actions={
            record.status === DEFINE_VOUCHER_STATUS.PENDING
              ? [
                  <PopconfirmHoc>
                    <Popconfirm
                      title={'Bạn có chắc muốn phê duyệt yêu cầu này.'}
                      onConfirm={() => onChangeStatus(DEFINE_VOUCHER_STATUS.ACTIVE)}
                    >
                      <Button className={'btn-primary-text'} type={'text'} icon={Icon.BUTTON.ACCEPT}>
                        Phê duyệt
                      </Button>
                    </Popconfirm>
                  </PopconfirmHoc>,
                  <PopconfirmHoc>
                    <Popconfirm
                      title={'Bạn có chắc muốn từ chối yêu cầu này.'}
                      onConfirm={() => onChangeStatus(DEFINE_VOUCHER_STATUS.REFUSE)}
                    >
                      <Button type={'text'} danger icon={Icon.BUTTON.CANCEL}>
                        Từ chối
                      </Button>
                    </Popconfirm>
                  </PopconfirmHoc>,
                ]
              : []
          }
        >
          <Descriptions column={2}>
            <DescriptionsItem label={'Mã voucher hệ thống'}>{record.code}</DescriptionsItem>
            <DescriptionsItem label={'Loại mã'}>{RenderTagTypeVoucherDiscount(record.discountType)}</DescriptionsItem>
            <DescriptionsItem label={'Tên voucher hệ thống'}>{record.name}</DescriptionsItem>
            <DescriptionsItem label={'Mức giảm'}>
              {Format.numberWithCommas(
                record.discountValue,
                record.discountType === DEFINE_VOUCHER_DISCOUNT_TYPE.MONEY ? 'đ' : '%'
              )}
            </DescriptionsItem>
            <DescriptionsItem label={'Số lượng'}>{Format.numberWithCommas(record.quantity)}</DescriptionsItem>
            <DescriptionsItem label={'Thời gian bắt đầu'}>
              {record.startDate ? Moment.getDate(record.startDate, 'DD/MM/YYYY') : '___'}
            </DescriptionsItem>
            <DescriptionsItem label={'Giá trị đơn hàng tối thiểu'}>
              {Format.numberWithCommas(record.minPriceOrder, 'đ')}
            </DescriptionsItem>
            <DescriptionsItem label={'Thời gian kết thúc'}>
              {record.endDate ? Moment.getDate(record.endDate, 'DD/MM/YYYY') : '___'}
            </DescriptionsItem>
            <DescriptionsItem label={'Mô tả'}>{Format.formatString(record.description)}</DescriptionsItem>
          </Descriptions>
          <Descriptions>
            <DescriptionsItem label={'Ảnh thumbnail voucher'}>
              <Image src={record.url} width={300} style={{ height: 200, objectFit: 'cover' }} />
            </DescriptionsItem>
          </Descriptions>
        </Card>
      </Card>
    </div>
  )
}

export default ExpandTable
