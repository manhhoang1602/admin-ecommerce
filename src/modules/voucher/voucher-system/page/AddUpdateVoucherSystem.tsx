import React, { useEffect, useState } from 'react'
import { Affix, Button, Card, Col, Form, Input, PageHeader, Row, Select, Spin } from 'antd'
import history from '../../../../services/history'
import Config from '../../../../services/Config'
import NumberFormat from 'react-number-format'
import { DEFINE_VOUCHER_DISCOUNT_TYPE } from '../../approve-voucher/ApproveVoucher'
import EditorComponent from '../../../../commons/editor/EditorComponent'
import { DatePicker } from 'antd/es'
import UploadFileComponent from '../../../../commons/upload/UploadFileComponent'
import { useForm } from 'antd/es/form/Form'
import { getDetailVoucherSystemApi, postVoucherSystemApi, putVoucherSystemApi } from '../VoucherSystemApi'
import moment from 'moment'
import { Notification } from '../../../../commons/notification/Notification'
import { ADMIN_ROUTER } from '../../../../router/AdminRouter'
import { IReqVoucherSystem } from '../VoucherSystemInterfaces'

interface IForm {
  name: string
  code: string
  media_url: string
  quantity: number
  description: string
  min_price_order: number
  discount_value: number
  discount_type: number
  start_date: moment.Moment | undefined
  end_date: moment.Moment | undefined
  used_quantity?: number
  remain_quantity?: number
  url?: string
}

const AddUpdateVoucherSystem = () => {
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index') as string)

  const [form] = useForm()
  const [loading, setLoading] = useState({
    submit: false,
    getDetail: false,
  })

  const submit = async (values: IForm) => {
    try {
      setLoading({ ...loading, submit: true })
      const validate = (): { isValidity: boolean; msg: string } => {
        const result: { isValidity: boolean; msg: string } = {
          isValidity: true,
          msg: '',
        }
        if (values.discount_type === DEFINE_VOUCHER_DISCOUNT_TYPE.PERCENT && values.discount_value > 100) {
          return {
            isValidity: false,
            msg: 'Mức giảm phải nhỏ hơn hoặc bằng 100.',
          }
        }
        if (values.start_date && values.end_date && values.start_date >= values.end_date) {
          return {
            isValidity: false,
            msg: 'Thời gian bắt đầu khuyến mãi phải nhỏ hơn thời gian kết thúc.',
          }
        }
        return result
      }
      if (validate().isValidity) {
        if (!id) {
          const reqData: IReqVoucherSystem = {
            ...values,
            start_date: values.start_date ? values.start_date.toISOString() : null,
            end_date: values.end_date ? values.end_date.toISOString() : null,
          }
          !values.start_date && delete reqData.start_date
          !values.end_date && delete reqData.end_date

          const res = await postVoucherSystemApi(reqData)
          if (res.body.status) {
            Notification.PushNotification('SUCCESS', 'Thêm mới voucher thành công.')
            history.push(ADMIN_ROUTER.VOUCHER_SYSTEM.path)
          }
        } else {
          delete values.remain_quantity
          delete values.used_quantity

          const reqData: IReqVoucherSystem = {
            ...values,
            start_date: values.start_date ? values.start_date.toISOString() : null,
            end_date: values.end_date ? values.end_date.toISOString() : null,
          }
          !values.start_date && delete reqData.start_date
          !values.end_date && delete reqData.end_date

          const res = await putVoucherSystemApi(id, reqData)
          if (res.body.status) {
            Notification.PushNotification('SUCCESS', 'Sửa voucher thành công.')
            history.push(ADMIN_ROUTER.VOUCHER_SYSTEM_DETAIL.path + `?index=${id}`)
          }
        }
      } else {
        Notification.PushNotification('ERROR', validate().msg)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, submit: false })
    }
  }

  const getDetail = async () => {
    try {
      setLoading({ ...loading, getDetail: true })
      const res = await getDetailVoucherSystemApi(id)
      if (res.body.status) {
        const resDetail = res.body.data
        const dataForm: IForm = {
          end_date: resDetail.endDate ? moment(resDetail.endDate) : undefined,
          start_date: resDetail.startDate ? moment(resDetail.startDate) : undefined,
          discount_value: resDetail.discountValue,
          discount_type: resDetail.discountType,
          code: resDetail.code,
          description: resDetail.description,
          media_url: resDetail.mediaUrl,
          name: resDetail.name,
          min_price_order: resDetail.minPriceOrder,
          quantity: resDetail.quantity,
          remain_quantity: resDetail.remainQuantity,
          used_quantity: resDetail.quantity - resDetail.remainQuantity,
          url: resDetail.url,
        }

        form.setFieldsValue(dataForm)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getDetail: false })
    }
  }

  useEffect(() => {
    id && getDetail()
  }, [id])

  return (
    <Spin spinning={loading.getDetail}>
      <Affix offsetTop={Config._offsetTopAffix}>
        <PageHeader
          title={id ? 'Sửa voucher hệ thống' : 'Thêm mới voucher hệ thống'}
          onBack={(e) => history.goBack()}
          extra={[
            <Button type={'primary'} danger={true} onClick={(event) => history.goBack()}>
              Hủy
            </Button>,
            <Button type={'primary'} onClick={(event) => form.submit()} loading={loading.submit}>
              Lưu
            </Button>,
          ]}
        />
      </Affix>

      <Form layout={'vertical'} form={form} onFinish={submit} scrollToFirstError={{ behavior: 'smooth' }}>
        <div className={'style-box'}>
          <Card title={'THÔNG TIN CHUNG'}>
            <Row gutter={[32, 16]}>
              <Col md={12}>
                <Form.Item
                  label={'Mã voucher hệ thống'}
                  name={'code'}
                  rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập mã voucher.' }]}
                >
                  <Input placeholder={'Nhập mã voucher'} allowClear={true} />
                </Form.Item>
                <Form.Item
                  label={'Tên voucher hệ thống'}
                  name={'name'}
                  rules={[
                    { required: true, whitespace: true, message: 'Vui lòng nhập tên voucher.' },
                    { pattern: Config._reg.nameUnicode, message: 'Tên không đúng định dạng.' },
                  ]}
                >
                  <Input placeholder={'Nhập tên voucher'} allowClear={true} />
                </Form.Item>
                <Form.Item
                  label={'Giá trị tối thiểu đơn hàng'}
                  name={'min_price_order'}
                  rules={[{ type: 'integer', min: 0, message: 'Giá trị tối thiểu đơn hàng phải là số nguyên dương.' }]}
                >
                  <NumberFormat
                    placeholder={'vd: 10.000 đ'}
                    thousandSeparator={true}
                    onChange={(event) =>
                      form.setFieldsValue({ min_price_order: Config.parserFormatNumber(event.target.value) })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label={'Số lượng voucher'}
                  name={'quantity'}
                  rules={[
                    { required: true, message: 'Vui lòng nhập số lượng.' },
                    { type: 'integer', min: 0, message: 'Số lượng là số nguyên dương.' },
                  ]}
                >
                  <NumberFormat
                    placeholder={'Nhập số lượng voucher'}
                    thousandSeparator={true}
                    onChange={(event) =>
                      form.setFieldsValue({ quantity: Config.parserFormatNumber(event.target.value) })
                    }
                  />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  label={'Loại giảm'}
                  name={'discount_type'}
                  rules={[{ required: true, message: 'Vui lòng chọn loại mã.' }]}
                >
                  <Select placeholder={'Loại giảm'}>
                    <Select.Option value={DEFINE_VOUCHER_DISCOUNT_TYPE.MONEY}>Giảm giá theo số tiền</Select.Option>
                    <Select.Option value={DEFINE_VOUCHER_DISCOUNT_TYPE.PERCENT}>Giảm giá theo phần trăm</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label={'Mức giảm'}
                  name={'discount_value'}
                  rules={[
                    { required: true, message: 'Vui lòng nhập mức giảm.' },
                    { type: 'integer', min: 0, message: 'Mức giảm là số nguyên dương.' },
                    // form.getFieldValue('discount_type') === DEFINE_VOUCHER_DISCOUNT_TYPE.PERCENT
                    //   ? {
                    //       type: 'integer',
                    //       min: 0,
                    //       max: 100,
                    //       message: 'Mức giảm là số nguyên dương nhỏ hơn hoặc bằng 100.',
                    //     }
                    //   : {},
                  ]}
                >
                  <NumberFormat
                    placeholder={'Nhập mức giảm'}
                    thousandSeparator={true}
                    // value={form.getFieldValue('discount_value')}
                    onChange={(event) =>
                      form.setFieldsValue({ discount_value: Config.parserFormatNumber(event.target.value) })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label={'Mô tả'} name={'description'}>
              <EditorComponent onChange={(value) => form.setFieldsValue({ description: value })} />
            </Form.Item>
          </Card>
        </div>

        {id ? (
          <div className={'style-box'}>
            <Card title={'THÔNG TIN SỐ LƯỢNG VOUCHER'}>
              <Form.Item label={'Số lượng quy định'} name={'quantity'}>
                <NumberFormat
                  placeholder={'Nhập số lượng quy định'}
                  thousandSeparator={true}
                  onChange={(event) => form.setFieldsValue({ quantity: Config.parserFormatNumber(event.target.value) })}
                />
              </Form.Item>
              <Form.Item label={'Số lượng đã sử dụng'} name={'used_quantity'}>
                <NumberFormat placeholder={'Nhập số lượng đã sử dụng'} thousandSeparator={true} disabled={true} />
              </Form.Item>
              <Form.Item label={'Số lượng còn lại'} name={'remain_quantity'}>
                <NumberFormat placeholder={'Nhập số lượng còn lại'} thousandSeparator={true} disabled={true} />
              </Form.Item>
            </Card>
          </div>
        ) : null}

        <div className={'style-box'}>
          <Card title={'THỜI GIAN KHUYẾN MẠI'}>
            <Form.Item
              label={'Thời gian bắt đầu'}
              name={'start_date'}
              rules={[{ required: true, message: 'Vui lòng nhập thời gian bắt đầu' }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label={'Thời gian kết thúc'}
              name={'end_date'}
              rules={[{ required: true, message: 'Vui lòng nhập thời gian kết thúc.' }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label={'Ảnh thumbnail voucher'}
              name={'media_url'}
              rules={[{ required: true, message: 'Vui lòng chọn ảnh.' }]}
            >
              <UploadFileComponent
                type={'picture-card'}
                limit={1}
                name={Config._nameUploadUImage}
                path={Config._pathUploadImage}
                size={Config._sizeUploadImage}
                defaultData={
                  form.getFieldValue('url')
                    ? [
                        {
                          url: form.getFieldValue('url'),
                          name: form.getFieldValue('url'),
                          status: 'done',
                          uid: form.getFieldValue('url'),
                          response: {
                            data: { url: form.getFieldValue('url'), filename: form.getFieldValue('media_url') },
                          },
                        },
                      ]
                    : []
                }
                logger={(data) =>
                  data.length > 0
                    ? form.setFieldsValue({ media_url: data[0].response!.data.filename })
                    : form.setFieldsValue({ media_url: undefined })
                }
              />
            </Form.Item>
          </Card>
        </div>
      </Form>
    </Spin>
  )
}

export default AddUpdateVoucherSystem
