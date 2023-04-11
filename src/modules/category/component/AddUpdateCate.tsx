import React, { useEffect, useState } from 'react'
import ModalHoc from '../../../commons/HOC/ModalHOC'
import { Form, Input, Modal } from 'antd'
import UploadFileComponent from '../../../commons/upload/UploadFileComponent'
import Config from '../../../services/Config'
import { useForm } from 'antd/es/form/Form'
import { postCategoryApi, putCategoryApi } from '../CategoryApi'
import { Notification } from '../../../commons/notification/Notification'
import NumberFormat from 'react-number-format'
import { IDatasourceCate } from '../Category'

interface IProps {
  type?: 'ADD' | 'EDIT'
  onOpenModal?: (fn: Function) => any
  onCallApiSuccess: () => any
  dataDefault?: IDatasourceCate
}

interface IFormAddUpdateCate {
  name: string
  description: string
  displayOrder: number
  iconUrl: string
}

const AddUpdateCate: React.FC<IProps> = ({ type = 'EDIT', onOpenModal, dataDefault, onCallApiSuccess }) => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = useForm()

  const openModal = (dataDefault: IDatasourceCate) => {
    setVisibleModal(true)
    if (dataDefault) {
      form.setFieldsValue({
        name: dataDefault.name,
        description: dataDefault.description,
        displayOrder: dataDefault.displayOrder,
        iconUrl: dataDefault.iconPath,
      })
      // console.log(dataDefault)
    }
  }

  const closeModal = () => {
    setVisibleModal(false)
    form.resetFields()
  }

  const onAddCate = async (values: IFormAddUpdateCate) => {
    try {
      setLoading(true)
      const res = await postCategoryApi({
        description: values.description,
        name: values.name,
        display_order: values.displayOrder,
        icon_url: values.iconUrl,
      })
      if (res.body.status === Config._statusSuccessCallAPI) {
        Notification.PushNotification('SUCCESS', 'Thêm mới danh mục thành công.')
        setTimeout(() => {
          onCallApiSuccess()
        }, 500)
        setVisibleModal(false)
        form.resetFields()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const onUpdateCate = async (values: IFormAddUpdateCate) => {
    try {
      // console.log(values)
      setLoading(true)
      const res = await putCategoryApi(dataDefault?.id as number, {
        description: values.description,
        name: values.name,
        display_order: values.displayOrder,
        icon_url: values.iconUrl,
      })
      if (res.body.status === Config._statusSuccessCallAPI) {
        Notification.PushNotification('SUCCESS', 'Cập danh mục thành công.')
        setTimeout(() => {
          onCallApiSuccess()
        }, 500)
        setVisibleModal(false)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const onFinish = (values: IFormAddUpdateCate) => {
    if (type === 'ADD') {
      onAddCate(values)
    } else {
      onUpdateCate(values)
    }
  }

  useEffect(() => {
    onOpenModal && onOpenModal(openModal)
  }, [])

  return (
    <ModalHoc>
      <Modal
        title={type === 'ADD' ? 'Thêm danh mục' : 'Sửa danh mục'}
        visible={visibleModal}
        onCancel={closeModal}
        confirmLoading={loading}
        onOk={(e) => form.submit()}
      >
        <Form labelCol={{ span: 8 }} className={'label-left'} form={form} onFinish={onFinish}>
          <Form.Item
            label={'Tên danh mục'}
            name={'name'}
            rules={[
              { required: true, whitespace: true, message: 'Vui lòng nhập tên danh mục' },
              { type: 'string', max: 50, min: 3, message: 'Tên danh mục phải từ 3 - 50 ký tự.' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={'Thứ tự hiển thị'}
            name={'displayOrder'}
            rules={[
              { required: true, message: 'Vui lòng nhập thứ tự hiển thị.' },
              { type: 'integer', min: 0, message: 'Thứ tự hiển thị là số nguyên dương.' },
            ]}
          >
            <NumberFormat
              min={0}
              disabled={dataDefault?.id === 33 ? true : false}
              onChange={(event) => {
                form.setFieldsValue({
                  displayOrder: Number(event.target.value) ? Number(event.target.value) : undefined,
                })
              }}
            />
          </Form.Item>
          <Form.Item label={'Ảnh danh mục'} name={'iconUrl'} rules={[{ required: true }]}>
            <UploadFileComponent
              type={'picture-card'}
              limit={1}
              name={Config._nameUploadUImage}
              path={Config._pathUploadImage}
              size={Config._sizeUploadImage}
              defaultData={
                dataDefault
                  ? [
                      {
                        uid: dataDefault.id,
                        name: dataDefault.iconUrl,
                        url: dataDefault.iconUrl,
                        status: 'done',
                        response: { data: { url: dataDefault.iconUrl, filename: dataDefault.iconPath } },
                      },
                    ]
                  : []
              }
              logger={(data) => {
                form.setFieldsValue({ iconUrl: data.length > 0 ? data[0].response!.data.filename : undefined })
              }}
            />
          </Form.Item>
          <Form.Item label={'Mô tả'} name={'description'}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </ModalHoc>
  )
}

export default React.memo(AddUpdateCate)
