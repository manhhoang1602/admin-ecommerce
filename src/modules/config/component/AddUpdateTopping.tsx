import React, { useEffect, useState } from 'react'
import { Form, Input, Modal } from 'antd'
import ModalHoc from '../../../commons/HOC/ModalHOC'
import UploadFileComponent from '../../../commons/upload/UploadFileComponent'
import { IDataSourceTopping } from './Topping'
import Config from '../../../services/Config'
import { useForm } from 'antd/es/form/Form'
import NumberFormat from 'react-number-format'
import { postToppingApi, putToppingApi } from '../ConfigApi'
import { Notification } from '../../../commons/notification/Notification'
import { IReqTopping } from '../ConfigInterface'

interface IProps {
  type: 'ADD' | 'UPDATE'
  defaultData?: IDataSourceTopping
  openModal: (fn: Function) => any
  onCallApiSuccess: () => any
}

interface IForm {
  thumbnailUrl: string
  name: string
  price: number
  displayOrder: number
  code: string
}

const AddUpdateTopping: React.FC<IProps> = ({ type, defaultData, openModal, onCallApiSuccess }) => {
  const [visibleModal, setVisible] = useState<boolean>(false)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [form] = useForm()

  const onCloseModal = () => {
    setVisible(false)
    form.resetFields()
  }

  const onOpenModal = () => {
    setVisible(true)
  }

  const onCreateUpdateTopping = async (values: IForm) => {
    const reqData: IReqTopping = {
      name: values.name,
      price: values.price,
      code: values.code,
      display_order: values.displayOrder,
      thumbnail_url: values.thumbnailUrl,
    }
    if (type === 'ADD') {
      const res = await postToppingApi(reqData)
      if (res.body.status === Config._statusSuccessCallAPI) {
        Notification.PushNotification('SUCCESS', 'Thêm mới topping thành công')
        setVisible(false)
        onCallApiSuccess()
        form.resetFields()
      }
    } else {
      const res = await putToppingApi(defaultData!.id, reqData)
      if (res.body.status === Config._statusSuccessCallAPI) {
        Notification.PushNotification('SUCCESS', 'Cập nhật topping thành công')
        setVisible(false)
        onCallApiSuccess()
      }
    }
  }

  const onFinish = (values: IForm) => {
    try {
      setLoadingSubmit(true)
      onCreateUpdateTopping(values)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingSubmit(false)
    }
  }

  useEffect(() => {
    openModal(onOpenModal)
  }, [])

  return (
    <ModalHoc>
      <Modal
        title={` ${type === 'ADD' ? 'Thêm mới topping.' : 'Sửa topping.'} `}
        visible={visibleModal}
        onCancel={onCloseModal}
        onOk={() => form.submit()}
        confirmLoading={loadingSubmit}
      >
        <Form
          wrapperCol={{ span: 18 }}
          labelCol={{ span: 6 }}
          form={form}
          className={'label-left'}
          onFinish={onFinish}
          initialValues={type === 'UPDATE' ? { ...defaultData, thumbnailUrl: defaultData!.thumbnailPath } : undefined}
        >
          <Form.Item
            label={'Mã topping'}
            name={'code'}
            rules={[
              { required: true, whitespace: true, message: 'Vui lòng nhập mã topping.' },
              { type: 'string', max: 50, message: 'Mã topping không quá 50 ký tự.' },
            ]}
          >
            <Input placeholder={'Nhập mã topping'} disabled={type === 'UPDATE' ? true : false} />
          </Form.Item>
          <Form.Item
            name={'name'}
            label={'Tên topping'}
            rules={[
              { required: true, whitespace: true, message: 'Vui lòng nhập tên topping.' },
              { type: 'string', max: 50, message: 'Tên topping không quá 50 ký tự.' },
            ]}
          >
            <Input placeholder={'Nhập tên topping.'} />
          </Form.Item>
          <Form.Item
            label={'Giá niêm yết'}
            name={'price'}
            rules={[
              { required: true, message: 'Vui lòng nhập giá niêm yết.' },
              { type: 'integer', min: 0, message: 'Giá niêm yết là số nguyên dương.' },
            ]}
          >
            <NumberFormat
              onChange={(event) => {
                form.setFieldsValue({ price: Config.parserFormatNumber(event.target.value) })
                console.log(form.getFieldsValue())
              }}
              thousandSeparator={true}
              placeholder={'Giá niêm yết.'}
            />
          </Form.Item>
          <Form.Item
            label={'STT hiển thị'}
            name={'displayOrder'}
            rules={[
              { type: 'integer', min: 0, message: 'STT hiển thị là số nguyên dương.' },
              { required: true, message: 'Vui lòng nhập STT hiển thị.' },
            ]}
          >
            <NumberFormat
              onChange={(event) => form.setFieldsValue({ displayOrder: Config.parserFormatNumber(event.target.value) })}
              thousandSeparator={true}
              placeholder={'STT hiển thị'}
            />
          </Form.Item>
          <Form.Item label={'Ảnh'} name={'thumbnailUrl'}>
            <UploadFileComponent
              type={'picture-card'}
              limit={1}
              name={Config._nameUploadUImage}
              path={Config._pathUploadImage}
              size={Config._sizeUploadImage}
              logger={(data) => {
                form.setFieldsValue({ thumbnailUrl: data.length > 0 ? data[0].response!.data.filename : null })
              }}
              defaultData={
                defaultData
                  ? [
                      {
                        status: 'done',
                        uid: defaultData.id,
                        url: defaultData.thumbnailUrl,
                        name: defaultData.thumbnailPath,
                      },
                    ]
                  : []
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </ModalHoc>
  )
}

export default AddUpdateTopping
