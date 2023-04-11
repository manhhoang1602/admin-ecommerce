import React, { useEffect } from 'react'
import { Button, Card, Col, Divider, Form, Input, Row, Spin } from 'antd'
import NumberFormat from 'react-number-format'
import UploadFileComponent from '../../../commons/upload/UploadFileComponent'
import Config from '../../../services/Config'
import { observer } from 'mobx-react'
import store from './ConfigSystemStore'
import { useForm } from 'antd/es/form/Form'
import { IReqConfigSystem } from '../ConfigInterface'
import { Moment } from '../../../services/Moment'

interface IFormContact {
  contact_hotline: string
  contact_zalo: string
  contact_messenger: string
  survey_link: string
}

interface IFormMinPriceOrder {
  min_price_order: string
}

interface IFormTimePendingOrder {
  time_out: number
}

const DEFINE_KEY_ID = {
  HOTLINE: {
    id: 5,
    key: 'contact_hotline',
  },
  SURVEY_LINK: {
    id: 22,
    key: 'survey_link',
  },
  CONTACT_ZALO: {
    id: 4,
    key: 'contact_zalo',
  },
  CONTACT_MESSAGE: {
    id: 6,
    key: 'contact_messenger',
  },
  MIN_PRICE_ORDER: {
    id: 7,
    key: 'min_price_order',
  },
  TIME_PENDING_ORDER: {
    id: 1,
    key: 'time_out',
  },
}

const ConfigSystem = observer(() => {
  const [formContactInfo] = useForm()
  const [formMinPriceOrder] = useForm()
  const [formTimePendingOrder] = useForm()

  const onSubmitFormContact = (values: IFormContact) => {
    const reqData: IReqConfigSystem[] = [
      {
        id: DEFINE_KEY_ID.CONTACT_ZALO.id,
        key: DEFINE_KEY_ID.CONTACT_ZALO.key,
        value: values.contact_zalo,
      },
      {
        id: DEFINE_KEY_ID.CONTACT_MESSAGE.id,
        key: DEFINE_KEY_ID.CONTACT_MESSAGE.key,
        value: values.contact_messenger,
      },
      {
        id: DEFINE_KEY_ID.HOTLINE.id,
        key: DEFINE_KEY_ID.HOTLINE.key,
        value: values.contact_hotline,
      },
      {
        id: DEFINE_KEY_ID.SURVEY_LINK.id,
        key: DEFINE_KEY_ID.SURVEY_LINK.key,
        value: values.survey_link,
      },
    ]
    store.putConfigSystem('INFO_CONTACT', reqData)
  }

  const onSubmitFormMinPriceOrder = (values: IFormMinPriceOrder) => {
    const reqData: IReqConfigSystem[] = [
      {
        id: DEFINE_KEY_ID.MIN_PRICE_ORDER.id,
        key: DEFINE_KEY_ID.MIN_PRICE_ORDER.key,
        value: values.min_price_order,
      },
    ]
    store.putConfigSystem('MIN_PRICE_ORDER', reqData)
  }

  const onSubmitFormTimePendingOrder = (value: IFormTimePendingOrder) => {
    const reqData: IReqConfigSystem[] = [
      {
        id: DEFINE_KEY_ID.TIME_PENDING_ORDER.id,
        key: DEFINE_KEY_ID.TIME_PENDING_ORDER.key,
        value: Moment.MToMs(value.time_out).toString(),
      },
    ]
    store.putConfigSystem('TIME_PENDING_ORDER', reqData)
  }

  useEffect(() => {
    const getDetail = async () => {
      await store.getDetailConfigSystem()
      formContactInfo.setFieldsValue(store.dataFormContactInfo)
      formMinPriceOrder.setFieldsValue(store.dataFormMinPriceOrder)
      formTimePendingOrder.setFieldsValue(store.dataFormTimePendingOrder)
    }
    getDetail()
  }, [])

  return (
    <Spin spinning={store.loading.getDetail}>
      <Row gutter={[32, 16]} justify={'center'} style={{ padding: '0 100px' }}>
        <Col md={24}>
          <Card
            title={'Thông tin liên hệ'}
            bordered={false}
            extra={
              <Button
                type={'primary'}
                loading={store.loading.infoContact}
                onClick={(event) => formContactInfo.submit()}
              >
                Lưu
              </Button>
            }
          >
            <Form layout={'vertical'} form={formContactInfo} onFinish={onSubmitFormContact}>
              <Form.Item
                label={'Thông tin hotline'}
                name={'contact_hotline'}
                rules={[
                  { required: true, whitespace: true, message: 'Vui lòng nhập thông tin hotline.' },
                  { pattern: Config._reg.phone, message: 'Thông tin hotline không đúng định dạng số điện thoại.' },
                ]}
              >
                <Input placeholder={'Nhập thông tin'} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label={'Thông tin Zalo'}
                name={'contact_zalo'}
                rules={[
                  { required: true, whitespace: true, message: 'Vui lòng nhập thông tin Zalo.' },
                  { pattern: Config._reg.phone, message: 'Thông tin Zalo không đúng định dạng số điện thoại.' },
                ]}
              >
                <Input placeholder={'Nhập thông tin'} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label={'Thông tin messenger'}
                name={'contact_messenger'}
                rules={[
                  { required: true, whitespace: true, message: 'Vui lòng nhập thông tin message.' },
                  { pattern: Config._reg.phone, message: 'Thông tin message không đúng định dạng số điện thoại.' },
                ]}
              >
                <Input placeholder={'Nhập thông tin'} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label={'Link khảo sát'}
                name={'survey_link'}
                rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập link khảo sát.' }]}
              >
                <Input placeholder={'Link khảo sát'} style={{ width: '100%' }} />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Divider type={'horizontal'} />
        <Col md={24} lg={24}>
          <Card
            title={'Thông tin giá trị tối thiểu đơn hàng'}
            bordered={false}
            extra={
              <Button
                type={'primary'}
                loading={store.loading.minPriceOrder}
                onClick={(event) => formMinPriceOrder.submit()}
              >
                Lưu
              </Button>
            }
          >
            <Form layout={'vertical'} form={formMinPriceOrder} onFinish={onSubmitFormMinPriceOrder}>
              <Form.Item
                label={'Giá trị tối thiểu đơn hàng'}
                name={'min_price_order'}
                rules={[{ required: true, message: 'Vui lòng giá trị tối thiểu đơn hàng.' }]}
              >
                <NumberFormat thousandSeparator={true} placeholder={'Nhập giá trị tối thiểu đơn hàng'} />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Divider />
        <Col md={24} lg={24}>
          <Card
            title={'Thông tin thời gian chờ nhận đơn hàng'}
            extra={
              <Button
                loading={store.loading.timePendingOrder}
                onClick={(event) => formTimePendingOrder.submit()}
                type={'primary'}
              >
                Lưu
              </Button>
            }
            bordered={false}
          >
            <Form layout={'vertical'} form={formTimePendingOrder} onFinish={onSubmitFormTimePendingOrder}>
              <Form.Item
                label={'Thời gian chờ nhận đơn (phút)'}
                name={'time_out'}
                rules={[
                  { required: true, message: 'Vui lòng nhập thời gian chờ nhận đơn hàng.' },
                  { type: 'integer', min: 0, message: 'Thời gian cập nhật đơn hàng phải là số nguyên dương.' },
                ]}
              >
                <NumberFormat
                  thousandSeparator={true}
                  placeholder={'Nhập thời gian chờ nhận đơn.'}
                  onChange={(event) => {
                    formTimePendingOrder.setFieldsValue({ time_out: Config.parserFormatNumber(event.target.value) })
                  }}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Divider />
        <Col md={24} lg={24}>
          <Card title={'Thông tin hình ảnh giới thiệu'} bordered={false}>
            <Form layout={'vertical'}>
              <Row gutter={[32, 16]}>
                {store.detailConfigSystem &&
                  store.detailConfigSystem.introducePictureUrl.map((value, index) => {
                    return (
                      <Col md={8} lg={8}>
                        <Form.Item label={`Ảnh số ${index + 1}`}>
                          <UploadFileComponent
                            type={'picture-card'}
                            limit={1}
                            name={Config._nameUploadUImage}
                            path={Config._pathUploadImage}
                            size={Config._sizeUploadImage}
                            onRemove={() => {
                              const reqData: IReqConfigSystem = {
                                id: value.id,
                                key: value.key,
                              }
                              store.deleteConfigSystemMedia(reqData)
                            }}
                            defaultData={store.getDataFile(value)}
                            logger={(data) => {
                              if (data && data.length > 0) {
                                const reqData: IReqConfigSystem = {
                                  id: value.id,
                                  key: value.key,
                                  value: data[0].response?.data.filename as string,
                                }
                                store.putConfigSystemMedia(reqData)
                              }
                            }}
                          />
                        </Form.Item>
                      </Col>
                    )
                  })}
              </Row>
            </Form>
          </Card>
        </Col>
        <Divider />
        <Col md={24} lg={24}>
          <Card title={'Thông tin hình ảnh đối tác'} bordered={false}>
            <Form layout={'vertical'}>
              <Row gutter={[32, 16]}>
                {store.detailConfigSystem &&
                  store.detailConfigSystem.partnerRegisterPictureUrl.map((value, index) => {
                    return (
                      <Col md={8} lg={8}>
                        <Form.Item label={`Ảnh số ${index + 1}`}>
                          <UploadFileComponent
                            type={'picture-card'}
                            limit={1}
                            name={Config._nameUploadUImage}
                            path={Config._pathUploadImage}
                            size={Config._sizeUploadImage}
                            onRemove={() => {
                              const reqData: IReqConfigSystem = {
                                id: value.id,
                                key: value.key,
                              }
                              store.deleteConfigSystemMedia(reqData)
                            }}
                            defaultData={store.getDataFile(value)}
                            logger={(data) => {
                              if (data && data.length > 0) {
                                const reqData: IReqConfigSystem = {
                                  id: value.id,
                                  key: value.key,
                                  value: data[0].response?.data.filename as string,
                                }
                                store.putConfigSystemMedia(reqData)
                              }
                            }}
                          />
                        </Form.Item>
                      </Col>
                    )
                  })}
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </Spin>
  )
})

export default ConfigSystem
