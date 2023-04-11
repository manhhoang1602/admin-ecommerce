import React, { useEffect, useState } from 'react'
import { Affix, Button, Card, Col, DatePicker, Divider, Form, Input, PageHeader, Row, Spin } from 'antd'
import Config from '../../../services/Config'
import NumberFormat from 'react-number-format'
import { DEFINE_VOUCHER_DISCOUNT_TYPE, SelectVoucherDiscount } from '../approve-voucher/ApproveVoucher'
import EditorComponent from '../../../commons/editor/EditorComponent'
import { useForm } from 'antd/es/form/Form'
import { getDetailVoucherShopApi, postVoucherShopApi, putVoucherShopApi } from './VoucherShopApi'
import { IReqVoucherShop, IResDataVoucherShop } from './VoucherShopInterface'
import { Notification } from '../../../commons/notification/Notification'
import history from '../../../services/history'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'
import moment from 'moment'
import UploadFileComponent, { IFile } from '../../../commons/upload/UploadFileComponent'
import SelectShopComponent from '../../shop/component/SelectShopComponent'
import { IValidate } from '../../../services/Interfaces'

interface IForm extends Omit<IReqVoucherShop, 'start_date' | 'end_date' | 'media_url'> {
  start_date: moment.Moment
  end_date: moment.Moment
  media_url: IFile
  remainQuantity: number
  quantityUsed: number
}

const AddUpdateVoucherShop = () => {
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index') as string)

  const [form] = useForm()

  const [loading, setLoading] = useState({
    getDetail: false,
    submit: false,
  })

  const onPost = async (reqData: IReqVoucherShop) => {
    try {
      setLoading({ ...loading, submit: true })
      const res = await postVoucherShopApi(reqData)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Thêm mới voucher thành công.')
        history.push(ADMIN_ROUTER.VOUCHER_SHOP.path)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, submit: false })
    }
  }

  const onPut = async (reqData: IReqVoucherShop) => {
    try {
      setLoading({ ...loading, submit: false })
      const res = await putVoucherShopApi(id, reqData)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Cập nhật voucher thành công.')
        history.push(ADMIN_ROUTER.VOUCHER_SHOP_DETAIL.path + `?index=${id}`)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, submit: false })
    }
  }

  const onSubmit = async (values: IForm) => {
    const validate = (): IValidate => {
      let rs: IValidate = {
        isValidity: true,
        msg: '',
      }

      if (values.start_date > values.end_date) {
        return {
          isValidity: false,
          msg: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.',
        }
      }
      if (values.discount_type === DEFINE_VOUCHER_DISCOUNT_TYPE.PERCENT && values.discount_value > 100) {
        return {
          isValidity: false,
          msg: 'Mức giảm không vượt quá 100%',
        }
      }

      return rs
    }

    if (validate().isValidity) {
      const reqData: IReqVoucherShop = {
        start_date: moment(values.start_date).toISOString(),
        shop_id: values.shop_id,
        end_date: moment(values.end_date).toISOString(),
        code: values.code,
        description: values.description,
        discount_type: values.discount_type,
        discount_value: values.discount_value,
        name: values.name,
        media_url: values.media_url ? (values.media_url.response?.data.filename as string) : undefined,
        min_price_order: values.min_price_order,
        quantity: values.quantity,
      }

      if (id) {
        delete reqData.shop_id
        onPut(reqData)
      } else {
        onPost(reqData)
      }
    } else {
      Notification.PushNotification('ERROR', validate().msg)
    }
  }

  const getDetail = async () => {
    try {
      setLoading({ ...loading, getDetail: true })
      const res = await getDetailVoucherShopApi(id)
      if (res.body.status) {
        const detail: IResDataVoucherShop = res.body.data
        const defaultDataForm: IForm = {
          end_date: moment(detail.endDate),
          shop_id: [detail.shopId],
          start_date: moment(detail.startDate),
          code: detail.code,
          description: detail.description,
          discount_type: detail.discountType,
          name: detail.name,
          media_url: {
            url: detail.url,
            name: detail.mediaUrl,
            status: 'done',
            uid: detail.url,
            response: { data: { url: detail.url, filename: detail.mediaUrl } },
          },
          quantity: detail.quantity,
          min_price_order: detail.minPriceOrder,
          discount_value: detail.discountValue,
          quantityUsed: detail.quantity - detail.remainQuantity,
          remainQuantity: detail.remainQuantity || 0,
        }
        form.setFieldsValue(defaultDataForm)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getDetail: false })
    }
  }

  useEffect(() => {
    if (id) {
      getDetail()
    }
  }, [])

  return (
    <Spin spinning={false}>
      <Affix offsetTop={Config._offsetTopAffix}>
        <PageHeader
          onBack={(e) => history.goBack()}
          title={id ? 'Sửa voucher cửa hàng' : 'Thêm mới voucher cửa hàng'}
          extra={[
            <Button key={'reject'} type={'primary'} danger onClick={(event) => history.goBack()}>
              Hủy
            </Button>,
            <Button key={'submit'} type={'primary'} loading={loading.submit} onClick={(event) => form.submit()}>
              Lưu
            </Button>,
          ]}
        />
      </Affix>
      <Form
        layout={'vertical'}
        form={form}
        scrollToFirstError={{
          behavior: 'smooth',
          inline: 'end',
          block: 'end',
          skipOverflowHiddenElements: true,
        }}
        onFinish={onSubmit}
      >
        <div className={'style-box'}>
          <Card title={'Thông tin chung'} bordered={false}>
            <Row gutter={[16, 8]}>
              <Col md={12}>
                <Form.Item
                  label={'Mã voucher cửa hàng'}
                  name={'code'}
                  rules={[
                    { required: true, whitespace: true, message: 'Vui lòng nhập mã voucher.' },
                    { type: 'string', max: 255, message: 'Mã voucher không quá 255 ký tự.' },
                  ]}
                >
                  <Input allowClear={true} placeholder={'Nhập mã voucher cửa hàng'} />
                </Form.Item>
                <Form.Item
                  name={'name'}
                  label={'Tên voucher cửa hàng'}
                  rules={[
                    { required: true, whitespace: true, message: 'Vui lòng nhập tên voucher cửa hàng.' },
                    { type: 'string', max: 255, message: 'Tên voucher không quá 255 ký tự.' },
                  ]}
                >
                  <Input allowClear={true} placeholder={'Tên voucher cửa hàng'} />
                </Form.Item>
                <Form.Item
                  name={'shop_id'}
                  label={'Tên cửa hàng'}
                  rules={[{ required: true, message: 'Vui lòng chọn tên cửa hàng.' }]}
                >
                  <SelectShopComponent
                    disabled={id ? true : false}
                    defaultValue={form.getFieldValue('shop_id')}
                    type={id ? undefined : 'multiple'}
                    onSelect={(value) => form.setFieldsValue({ shop_id: value as number[] })}
                  />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  label={'Loại giảm'}
                  name={'discount_type'}
                  rules={[{ required: true, message: 'Vui lòng chọn loại mã.' }]}
                >
                  <SelectVoucherDiscount
                    defaultValue={form.getFieldValue('discount_type')}
                    onSelect={(value) => form.setFieldsValue({ discount_type: value })}
                  />
                </Form.Item>
                <Form.Item
                  label={'Mức giảm'}
                  name={'discount_value'}
                  rules={[{ required: true, message: 'Vui lòng nhập mức giảm.' }]}
                >
                  <NumberFormat
                    placeholder={'Nhập mức giảm'}
                    thousandSeparator={true}
                    onChange={(event) =>
                      form.setFieldsValue({ discount_value: Config.parserFormatNumber(event.target.value) })
                    }
                  />
                </Form.Item>
                <Form.Item label={'Giá trị tối thiểu đơn hàng.'} name={'min_price_order'}>
                  <NumberFormat
                    placeholder={'Giá trị đơn hàng'}
                    thousandSeparator={true}
                    onChange={(event) =>
                      form.setFieldsValue({ min_price_order: Config.parserFormatNumber(event.target.value) })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label={'Mô tả'} name={'description'}>
              <EditorComponent />
            </Form.Item>
          </Card>
        </div>

        <div className={'style-box'}>
          <Row gutter={[32, 16]}>
            <Col lg={12}>
              <Card title={'Thông tin số lượng voucher'} bordered={false}>
                <Form.Item
                  label={'Số lượng quy định'}
                  name={'quantity'}
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng.' }]}
                >
                  <NumberFormat
                    placeholder={'Nhập số lượng quy định'}
                    thousandSeparator={true}
                    onChange={(event) =>
                      form.setFieldsValue({ quantity: Config.parserFormatNumber(event.target.value) })
                    }
                  />
                </Form.Item>
                {id ? (
                  <div>
                    <Form.Item label={'Số lượng đã sửa dụng'} name={'quantityUsed'}>
                      <NumberFormat disabled={true} thousandSeparator={true} />
                    </Form.Item>
                    <Form.Item label={'Số lượng còn lại'} name={'remainQuantity'}>
                      <NumberFormat disabled={true} thousandSeparator={true} />
                    </Form.Item>
                  </div>
                ) : null}
              </Card>
            </Col>
            <Col lg={12}>
              <Card title={'Thời gian khuyến mại'} bordered={false}>
                <Form.Item
                  name={'start_date'}
                  label={'Thời gian bắt đầu'}
                  rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
                >
                  <DatePicker
                    format={'DD-MM-YYYY'}
                    disabled={id && form.getFieldValue('start_date') < moment() ? true : false}
                  />
                </Form.Item>
                <Form.Item
                  label={'Thời gian kết thúc'}
                  name={'end_date'}
                  rules={[{ required: true, message: 'Vui lòng nhập thời gian kết thúc.' }]}
                >
                  <DatePicker format={'DD-MM-YYYY'} />
                </Form.Item>
                <Divider />
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
                    logger={(data) => form.setFieldsValue({ media_url: data && data.length > 0 ? data[0] : undefined })}
                    defaultData={form.getFieldValue('media_url') ? [form.getFieldValue('media_url')] : []}
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </div>
      </Form>
    </Spin>
  )
}

export default AddUpdateVoucherShop
