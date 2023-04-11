import React, { useEffect, useState } from 'react'
import ModalHoc from '../../../commons/HOC/ModalHOC'
import { Divider, Form, Input, Modal, Select } from 'antd'
import NumberFormat from 'react-number-format'
import { useForm } from 'antd/es/form/Form'
import Config from '../../../services/Config'
import { IReqShop } from '../ShopInterfaces'
import { postShopApi, putShopApi } from '../ShopApi'
import { Notification } from '../../../commons/notification/Notification'
import { DEFINE_STATUS_SHOP } from '../Shop'
import {
  SelectDistrictComponent,
  SelectGoogleAddress,
  SelectProvincesComponent,
  SelectWardComponent,
} from './SelectAddressComponent'

interface IProps {
  type: 'ADD' | 'UPDATE'
  defaultData?: IForm
  callApiSuccess: () => {}
  onOpenModal: (fn: Function) => any
  id?: number
}

interface IForm {
  nameShop: string
  name: string
  taxCode: string
  password?: string
  phone: string
  email: string
  address: string
  confirmPass?: string
  lat?: number
  long?: number
  status?: number
  provinceId: number
  address_google: string
  districtId: number
  wardId: number
}

const AddUpdateShop: React.FC<IProps> = ({ defaultData, callApiSuccess, id, type, onOpenModal }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)

  const [provinceId, setProvinceId] = useState<number | undefined>(undefined)
  const [districtId, setDistrictId] = useState<number | undefined>(undefined)

  const [form] = useForm()

  const openModal = (defaultData: IForm) => {
    setVisibleModal(true)
    form.setFieldsValue(defaultData)
  }

  const closeModal = () => {
    setVisibleModal(false)
    form.resetFields()
  }

  const onFinish = async (values: IForm) => {
    try {
      setLoading(true)
      const reqData: IReqShop = {
        name_shop: values.nameShop,
        name: values.name,
        tax_code: values.taxCode && values.taxCode.trim(),
        phone: values.phone,
        password: values.password,
        email: values.email,
        address: values.address,
        lat: form.getFieldValue('lat'),
        long: form.getFieldValue('long'),
        status: values.status,
        ward_id: values.wardId,
        province_id: values.provinceId,
        district_id: values.districtId,
        address_google: values.address_google,
      }
      if (type === 'ADD') {
        const validate = (): { value: boolean; msg: string } => {
          if (values.password !== values.confirmPass) {
            return { value: false, msg: 'Mật khẩu không khớp.' }
          }
          return { value: true, msg: '' }
        }

        if (validate().value) {
          delete reqData.status
          const res = await postShopApi(reqData)
          if (res.body.status === Config._statusSuccessCallAPI) {
            Notification.PushNotification('SUCCESS', 'Thêm mới thành công cửa hàng.')
            setVisibleModal(false)
            setTimeout(() => callApiSuccess(), 100)
          }
        } else {
          Notification.PushNotification('ERROR', validate().msg)
        }
      }

      if (type === 'UPDATE') {
        delete reqData.phone
        delete reqData.password

        const res = await putShopApi(id as number, reqData)
        if (res.body.status === Config._statusSuccessCallAPI) {
          Notification.PushNotification('SUCCESS', 'Cập nhật thành công cửa hàng.')
          setVisibleModal(false)
          callApiSuccess()
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    onOpenModal(openModal)
  }, [])

  useEffect(() => {
    form.setFieldsValue(defaultData)
    setDistrictId(defaultData?.districtId)
    setProvinceId(defaultData?.provinceId)
  }, [defaultData])

  return (
    <ModalHoc>
      <Modal
        width={'35vw'}
        visible={visibleModal}
        title={type === 'ADD' ? 'Thêm mới cửa hàng' : 'Sửa cửa hàng'}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form onFinish={onFinish} form={form} layout={'vertical'}>
          <Form.Item
            label={'Tên cửa hàng'}
            name={'nameShop'}
            rules={[
              { required: true, whitespace: true, message: 'Vui lòng nhập tên cửa hàng.' },
              { type: 'string', min: 3, max: 50, message: 'Tên cửa hàng phải có độ dài từ 3 - 50 ký tự.' },
            ]}
          >
            <Input placeholder={'Nhập tên cửa hàng'} />
          </Form.Item>
          <Form.Item
            label={'Số điện thoại'}
            name={'phone'}
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại.' },
              { pattern: Config._reg.phone, message: 'Số điện thoại không hợp lệ.' },
            ]}
          >
            <NumberFormat format={'##########'} placeholder={'Nhập số điện thoại'} disabled={id ? true : false} />
          </Form.Item>
          <Form.Item
            label={'Email'}
            name={'email'}
            rules={[
              { required: true, message: 'Vui lòng nhập email.' },
              { type: 'email', message: 'Email không đúng định dạng.' },
            ]}
          >
            <Input placeholder={'Nhập email'} />
          </Form.Item>
          <Divider />
          <SelectGoogleAddress
            label={'Địa chỉ google'}
            placeholder={'Chọn địa chỉ chi tiết'}
            name={'address_google'}
            rules={[{ required: true, message: 'Vui lòng chọn địa chỉ google' }]}
            onChange={(id1, description, lat, long) => {
              form.setFieldsValue({ lat: lat, long: long })
              console.log(form.getFieldValue('lat'))
            }}
          />
          <Form.Item
            label={'Địa chỉ chi tiết'}
            name={'address'}
            rules={[{ required: true, message: 'Vui lòng nhận địa chỉ.' }]}
          >
            <Input placeholder={'Nhập địa chỉ chi tiết'} />
          </Form.Item>
          <Form.Item label={'Người đại diện'} name={'name'}>
            <Input placeholder={'Nhập người đại diện'} />
          </Form.Item>
          <Divider />
          <Form.Item
            label={'Tỉnh/ thành phố'}
            name={'provinceId'}
            rules={[{ required: true, message: 'Vui lòng nhập tỉnh/ thành phố.' }]}
          >
            <SelectProvincesComponent
              value={defaultData?.provinceId}
              onChange={(values) => {
                form.setFieldsValue({ provinceId: values })
                setProvinceId(values as number)
              }}
            />
          </Form.Item>
          <Form.Item
            label={'Quận/ huyện'}
            name={'districtId'}
            rules={[{ required: true, message: 'Vui lòng nhập quận/ huyện' }]}
          >
            <SelectDistrictComponent
              provinceId={provinceId}
              value={defaultData?.districtId}
              onChange={(values) => {
                form.setFieldsValue({ districtId: values })
                setDistrictId(values)
              }}
            />
          </Form.Item>
          <Form.Item
            label={'Xã/phường'}
            name={'wardId'}
            rules={[{ required: true, message: 'Vui lòng nhập xã/phường.' }]}
          >
            <SelectWardComponent
              districtId={districtId}
              value={defaultData?.wardId}
              onChange={(values) => form.setFieldsValue({ wardId: values })}
            />
          </Form.Item>
          <Divider />
          <Form.Item label={'Mã số thuế'} name={'taxCode'}>
            <NumberFormat
              format={'#############'}
              onChange={(event) => form.setFieldsValue({ taxCode: event.target.value })}
              placeholder={'Nhập mã số thuế'}
            />
          </Form.Item>
          {type === 'ADD' ? (
            <div>
              <Form.Item
                label={'Mật khẩu'}
                name={'password'}
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu.' },
                  { type: 'string', min: 6, message: 'Mật khẩu phải ít nhất 6 ký tự.' },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label={'Xác nhận mật khẩu'}
                name={'confirmPass'}
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu.' },
                  { type: 'string', min: 6, message: 'Mật khẩu phải ít nhất 6 ký tự.' },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </div>
          ) : (
            <Form.Item label={'Trạng thái'} name={'status'}>
              <Select>
                <Select.Option value={DEFINE_STATUS_SHOP.ACTIVE}>Hoạt động </Select.Option>
                <Select.Option value={DEFINE_STATUS_SHOP.INACTIVE}>Ngưng hoạt động </Select.Option>
              </Select>
            </Form.Item>
          )}
          {/*<Form.Item name={'lat'} />*/}
          {/*<Form.Item name={'long'} />*/}
        </Form>
      </Modal>
    </ModalHoc>
  )
}

export default AddUpdateShop
