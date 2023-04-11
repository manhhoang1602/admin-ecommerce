import React, { useEffect, useState } from 'react'
import ModalHoc from '../../../commons/HOC/ModalHOC'
import Modal from 'antd/es/modal/Modal'
import { Form } from 'antd'
import { SelectProvincesComponent } from '../../shop/component/SelectAddressComponent'
import { postProvinceApi } from '../ConfigApi'
import { Notification } from '../../../commons/notification/Notification'
import { useForm } from 'antd/es/form/Form'

const AddUpdateProvince = (props: { fnOpenModal: (fn: Function) => any; onCallApiSuccess: () => any }) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [form] = useForm()

  const onOpenModal = () => {
    setVisible(true)
  }

  const onCloseModal = () => {
    setVisible(false)
    form.resetFields()
  }

  const onFinish = async (values: { province_id: number[] }) => {
    try {
      setLoading(true)
      const res = await postProvinceApi({ province_id: values.province_id })
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Thêm mới thành công tỉnh/ thành phố.')
        props.onCallApiSuccess()
        onCloseModal()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    props.fnOpenModal(onOpenModal)
  }, [])

  return (
    <div>
      <ModalHoc>
        <Modal
          title={'Thêm mới tỉnh thành phố'}
          visible={visible}
          confirmLoading={loading}
          onCancel={onCloseModal}
          onOk={(e) => form.submit()}
        >
          <Form layout={'vertical'} onFinish={onFinish} form={form}>
            <Form.Item
              label={'Tên Tỉnh/ Thành phố'}
              name={'province_id'}
              rules={[{ required: true, message: 'Vui lòng chọn tỉnh thành phố.' }]}
            >
              <SelectProvincesComponent onChange={(values) => {}} type={'multiple'} />
            </Form.Item>
          </Form>
        </Modal>
      </ModalHoc>
    </div>
  )
}

export default AddUpdateProvince
