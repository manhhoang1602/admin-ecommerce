import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, Select } from 'antd'
import ModalHoc from '../../../commons/HOC/ModalHOC'
import UploadFileComponent from '../../../commons/upload/UploadFileComponent'
import NumberFormat from 'react-number-format'
import Config from '../../../services/Config'
import { DEFINE_ROLE_ACCOUNT, DEFINE_STATUS_ACCOUNT, IDatasourceAccount } from '../Account'
import { useForm } from 'antd/es/form/Form'
import { postAccountApi, putAccountApi } from '../AccountAPI'
import { Notification } from '../../../commons/notification/Notification'
import { getDataFormUpdateAccount } from '../AccountFn'

interface IProps {
  type: 'ADD' | 'UPDATE'
  onOpenModal?: (fn: Function) => any
  onCallApiSuccess?: () => any
  defaultForm?: IDatasourceAccount
}

export interface IFormAddAccount {
  name: string
  phone: string
  email: string
  role: number
  password?: string
  confirmPassword?: string
  status?: number
  image: string
}

const AddUpdateAccount: React.FC<IProps> = ({ type, onOpenModal, onCallApiSuccess, defaultForm }) => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = useForm()

  const openModal = () => {
    setVisibleModal(true)
  }

  const closeModal = () => {
    form.resetFields()
    setVisibleModal(false)
  }

  const onCreateAccount = async (values: IFormAddAccount) => {
    const validateForm = (): { value: boolean; msg: string } => {
      if (values.password !== values.confirmPassword) {
        return {
          value: false,
          msg: 'Mật khẩu không khớp nhau.',
        }
      }
      return {
        value: true,
        msg: '',
      }
    }
    try {
      if (validateForm().value) {
        setLoading(true)
        const res = await postAccountApi({
          email: values.email,
          phone: values.phone,
          password: values.password as string,
          role: values.role,
          name: values.name,
          profile_picture_url: values.image,
        })
        if (res.body.status === Config._statusSuccessCallAPI) {
          onCallApiSuccess && onCallApiSuccess()
          setVisibleModal(false)
          Notification.PushNotification('SUCCESS', 'Thêm mới tài khoản thành công.')
          form.resetFields()
        }
      } else {
        Notification.PushNotification('ERROR', validateForm().msg)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const onUpdateAccount = async (values: IFormAddAccount) => {
    try {
      setLoading(true)
      const res = await putAccountApi(defaultForm?.id as number, {
        name: values.name,
        role: values.role || DEFINE_ROLE_ACCOUNT.ADMIN,
        email: values.email,
        status: values.status as number,
        profile_picture_url: values.image,
      })
      if (res.body.status === Config._statusSuccessCallAPI) {
        setVisibleModal(false)
        onCallApiSuccess && onCallApiSuccess()
        Notification.PushNotification('SUCCESS', 'Cập nhật tài khoản thành công.')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const onFinish = async (values: IFormAddAccount) => {
    if (type === 'ADD') {
      onCreateAccount(values)
    } else {
      onUpdateAccount(values)
    }
  }

  useEffect(() => {
    onOpenModal && onOpenModal(openModal)
  }, [])

  return (
    <ModalHoc>
      <Modal
        visible={visibleModal}
        title={type === 'ADD' ? 'Thêm mới tài khoản.' : 'Sửa tài khoản.'}
        onCancel={closeModal}
        onOk={(e) => form.submit()}
        confirmLoading={loading}
      >
        <Form
          labelCol={{ span: 8 }}
          className={'label-left'}
          form={form}
          onFinish={onFinish}
          initialValues={type === 'UPDATE' ? getDataFormUpdateAccount(defaultForm as IDatasourceAccount) : undefined}
        >
          <Form.Item
            label={'Họ tên'}
            name={'name'}
            rules={[
              { required: true, whitespace: true, message: 'Vui lòng nhập họ tên.' },
              { type: 'string', min: 3, max: 50, message: 'Họ tên phải trong khoảng 3 - 50 ký tự' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={'Số điện thoại'}
            name={'phone'}
            rules={[
              { required: true, whitespace: true, message: 'Vui lòng nhập số điện thoại.' },
              { pattern: Config._reg.phone, message: 'Định dạng sô điện thoại không hợp lệ. ' },
            ]}
          >
            <NumberFormat format={'##########'} />
          </Form.Item>
          <Form.Item
            label={'Email'}
            name={'email'}
            rules={[
              { required: true, whitespace: true, message: 'Vui lòng nhập địa chỉ email.' },
              { type: 'email', message: 'Định dạng email không hợp lệ.' },
            ]}
          >
            <Input />
          </Form.Item>
          {/*<Form.Item*/}
          {/*  label={'Loại tài khoản'}*/}
          {/*  name={'role'}*/}
          {/*  rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản' }]}*/}
          {/*>*/}
          {/*  <Select onChange={(value) => console.log('run')}>*/}
          {/*    <Select.Option value={DEFINE_ROLE_ACCOUNT.ADMIN}>Admin</Select.Option>*/}
          {/*    <Select.Option value={DEFINE_ROLE_ACCOUNT.ACCOUNTANT}>Kế toán</Select.Option>*/}
          {/*    <Select.Option value={DEFINE_ROLE_ACCOUNT.EDITOR}>Biên tập</Select.Option>*/}
          {/*  </Select>*/}
          {/*</Form.Item>*/}
          {type === 'ADD' && (
            <div>
              <Form.Item
                label={'Mật khẩu'}
                name={'password'}
                rules={[
                  { required: true, whitespace: true, message: 'Vui lòng nhập mật khẩu.' },
                  { pattern: Config._reg.pass, message: 'Mật khẩu không đúng định dạng.' },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label={'Xác nhận mật khẩu'}
                name={'confirmPassword'}
                rules={[
                  { required: true, whitespace: true, message: 'Vui lòng nhập mật khẩu.' },
                  { pattern: Config._reg.pass, message: 'Mật khẩu không đúng định dạng.' },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </div>
          )}

          {type === 'UPDATE' && (
            <Form.Item label={'Trạng thái'} name={'status'}>
              <Select>
                <Select.Option value={DEFINE_STATUS_ACCOUNT.ACTIVE}>Hoạt động</Select.Option>
                <Select.Option value={DEFINE_STATUS_ACCOUNT.INACTIVE}>Ngưng hoạt động</Select.Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item label={'Ảnh đại diện'} name={'image'}>
            <UploadFileComponent
              type={'picture-card'}
              limit={1}
              name={Config._nameUploadUImage}
              path={Config._pathUploadImage}
              size={Config._sizeUploadImage}
              defaultData={
                defaultForm
                  ? [
                      {
                        uid: defaultForm.id,
                        name: defaultForm.profilePicturePath,
                        url: defaultForm.profilePictureUrl,
                        status: 'done',
                      },
                    ]
                  : []
              }
              logger={(data) =>
                form.setFieldsValue({ image: data.length > 0 ? data[0].response!.data.filename : null })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </ModalHoc>
  )
}

export default AddUpdateAccount
