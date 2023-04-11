import React, { useState } from 'react'
import { Button, Card, Descriptions, Divider, Form, Input, Modal, Popconfirm } from 'antd'
import store, { DEFINE_SHOP_REQUEST_STATUS, IPartnerRequest } from './PartnerRequestStore'
import DescriptionsItem from 'antd/es/descriptions/Item'
import { Moment } from '../../services/Moment'
import { Format } from '../../services/Format'
import Icon from '../../commons/icon/Icon'
import PopconfirmHoc from '../../commons/HOC/PopconfirmHOC'
import ModalHoc from '../../commons/HOC/ModalHOC'
import { useForm } from 'antd/es/form/Form'

const ExpandTableComponent = (props: { data: IPartnerRequest }) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [form] = useForm()

  return (
    <Card
      title={'Chi tiết đăng ký'}
      actions={
        props.data.status === DEFINE_SHOP_REQUEST_STATUS.INACTIVE
          ? [
              <PopconfirmHoc>
                <Popconfirm
                  title={'Bạn có chắc muốn phê duyệt đối tác này?'}
                  onConfirm={(e) =>
                    store.putChangeStatus('APPROVE', props.data.id, { status: DEFINE_SHOP_REQUEST_STATUS.ACTIVE })
                  }
                >
                  <Button type={'text'} className={'btn-success-text'} icon={Icon.BUTTON.ACCEPT}>
                    Phê duyệt
                  </Button>
                </Popconfirm>
              </PopconfirmHoc>,
              <Button type={'text'} danger={true} icon={Icon.BUTTON.CANCEL} onClick={(event) => setVisible(true)}>
                Từ chối
              </Button>,
            ]
          : undefined
      }
    >
      <h4>Thông tin khách hàng</h4>
      <Descriptions column={2}>
        <DescriptionsItem label={'Tên người dùng'}>{props.data.customer.name}</DescriptionsItem>
        <DescriptionsItem label={'Số điện thoại'}>{props.data.customer.phone}</DescriptionsItem>
        <DescriptionsItem label={'Email'}>{props.data.customer.email}</DescriptionsItem>
        <DescriptionsItem label={'Thời gian gửi'}>{Moment.getDate(props.data.createAt, 'DD/MM/YYYY')}</DescriptionsItem>
      </Descriptions>
      <Divider />
      <h4>Thông tin đăng ký đối tác</h4>
      <Descriptions column={2}>
        <DescriptionsItem label={'Tên đối tác'}>{props.data.name}</DescriptionsItem>
        <DescriptionsItem label={'Số điện thoại'}>{props.data.phone}</DescriptionsItem>
        <DescriptionsItem label={'Ghi chú'}>{Format.formatString(props.data.note)}</DescriptionsItem>
        <DescriptionsItem label={'Địa chỉ'}>{props.data.address}</DescriptionsItem>
      </Descriptions>

      <ModalHoc>
        <Modal
          title={'Nhập lý do từ  chối'}
          visible={visible}
          onCancel={(e) => {
            setVisible(false)
            form.resetFields()
          }}
          onOk={(e) => form.submit()}
        >
          <Form
            form={form}
            onFinish={async (form) => {
              const result = await store.putChangeStatus('REJECT', props.data.id, {
                status: DEFINE_SHOP_REQUEST_STATUS.DENY,
                reason: form.reason,
              })
              if (result) {
                setVisible(false)
              }
            }}
          >
            <Form.Item name={'reason'} rules={[{ required: true, message: 'Vui lòng nhập lý do.' }]}>
              <Input placeholder={'Nhập lý do từ chối'} />
            </Form.Item>
          </Form>
        </Modal>
      </ModalHoc>
    </Card>
  )
}

export default ExpandTableComponent
