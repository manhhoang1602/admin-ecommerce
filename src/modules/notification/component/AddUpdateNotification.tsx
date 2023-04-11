import React, { useEffect, useState } from 'react'
import ModalHOC from '../../../commons/HOC/ModalHOC'
import { Divider, Form, Input, Modal } from 'antd'
import { SelectStatusNotification, SelectTypeAccountNotification } from '../Notification'
import { IPayloadNotification, IReqNotification } from '../NotificationInterfaces'
import { useForm } from 'antd/es/form/Form'
import store, { INotification } from '../NotificationStore'

const AddUpdateNotification = (props: {
  type?: 'ADD' | 'UPDATE'
  defaultData?: INotification
  openCloseModal?: (openModalFn: Function) => any
  payload?: IPayloadNotification
}) => {
  const { defaultData, openCloseModal, type, payload } = props
  const [visible, setVisible] = useState<boolean>(false)
  const [form] = useForm()

  const onOpenModal = () => {
    setVisible(true)
    if (defaultData) {
      const formData: IReqNotification = {
        title: defaultData.title,
        account_type: defaultData.accountType,
        content: defaultData.content,
        post_status: defaultData.postStatus,
      }
      defaultData && form.setFieldsValue(formData)
    }
  }

  const onCloseModal = () => {
    setVisible(false)
    form.resetFields()
  }

  const onSubmit = async (values: IReqNotification) => {
    if (type === 'ADD') {
      const result = await store.postNotification(values)
      if (result) {
        onCloseModal()
      }
    }
    if (type === 'UPDATE') {
      const result = await store.putNotification(defaultData?.id as number, values, payload as IPayloadNotification)
      if (result) {
        onCloseModal()
      }
    }
  }

  useEffect(() => {
    openCloseModal && openCloseModal(onOpenModal)
  }, [])

  return (
    <ModalHOC>
      <Modal
        visible={visible}
        title={type === 'UPDATE' ? 'Sửa thông báo' : 'Thêm thông báo'}
        onCancel={onCloseModal}
        confirmLoading={store.loading.submitForm}
        onOk={(e) => form.submit()}
      >
        <Form layout={'vertical'} onFinish={onSubmit} form={form}>
          <Form.Item
            label={'Tiêu đề'}
            name={'title'}
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề.' },
              { type: 'string', max: 255, message: 'Tiêu đề không quá 255 ký tự.' },
            ]}
          >
            <Input placeholder={'Nhập tiêu đề'} />
          </Form.Item>

          <Divider />
          <Form.Item
            label={'Loại tài khoản'}
            name={'account_type'}
            rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản.' }]}
          >
            <SelectTypeAccountNotification
              onChange={(value) => form.setFieldsValue({ account_type: value })}
              defaultValue={defaultData?.accountType}
            />
          </Form.Item>
          <Form.Item
            label={'Trạng thái thông báo'}
            name={'post_status'}
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái thông báo' }]}
          >
            <SelectStatusNotification onChange={(value) => {}} defaultValue={defaultData?.postStatus} />
          </Form.Item>

          <Divider />
          <Form.Item
            label={'Nội dung'}
            name={'content'}
            rules={[{ required: true, message: 'Vui lòng nhập nội dung.' }]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
        </Form>
      </Modal>
    </ModalHOC>
  )
}

export default AddUpdateNotification
