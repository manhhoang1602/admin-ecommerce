import React, { useEffect, useState } from 'react'
import { Affix, Button, Card, Col, DatePicker, Form, Input, PageHeader, Row, Spin, Table } from 'antd'
import history from '../../../services/history'
import TableHoc from '../../../commons/HOC/TableHOC'
import { IColumn } from '../../../services/Interfaces'
import SelectCategoryComponent from '../../category/component/SelectCategoryComponent'
import { useForm } from 'antd/es/form/Form'
import { SelectProductComponent } from '../../product/Product'
import NumberFormat from 'react-number-format'
import { IResDataDetailProduct } from '../../product/ProductInterface'
import { getDetailProductApi } from '../../product/ProductApi'
import { Format } from '../../../services/Format'
import Config from '../../../services/Config'
import { IReqProductPromotion } from '../ProductPromotionInterfaces'
import moment, { Moment } from 'moment'
import { getDetailProductPromotionApi, postProductPromotionApi, putProductPromotionApi } from '../ProductPromotionApi'
import { Notification } from '../../../commons/notification/Notification'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'
import { disableDateAgo } from '../../../commons/HOC/RangePickerHOC'

interface IDatasource {
  key: any
  productSizeName: string
  price: number
  pricePlus: number
  pricePromotion: number
}

interface IFormGeneral {
  categoryId: number
  productId: number
  note: string
  promotionPrice: number
}

interface IFormDateTime {
  fromTimeSale: Moment
  toTimeSale: Moment
}

const columns: IColumn[] = [
  {
    title: 'Thuộc tính',
    key: 'productSizeName',
    dataIndex: 'productSizeName',
    render: (productSizeName: string) => <div>{productSizeName}</div>,
  },
  {
    title: 'Giá cộng thêm',
    key: 'price',
    dataIndex: 'price',
    render: (price: number) => <div>{Format.numberWithCommas(price, 'đ')}</div>,
  },
  // {
  //   title: 'Giá cộng thêm',
  //   key: 'pricePlus',
  //   dataIndex: 'pricePlus',
  //   render: (pricePlus: number) => <div>{Format.numberWithCommas(pricePlus, 'đ')}</div>,
  // },
  {
    title: 'Giá khuyến mãi',
    key: 'pricePromotion',
    dataIndex: 'pricePromotion',
    render: (pricePromotion: number) => <div>{Format.numberWithCommas(pricePromotion, 'đ')}</div>,
  },
]

const AddUpdateProductPromotion = () => {
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index') as string)

  const [formGeneral] = useForm()
  const [formDateTime] = useForm()
  const [loading, setLoading] = useState({
    detail: false,
    submit: false,
  })

  const [loadingDetailProductPromotion, setLoadingDetailProductPromotion] = useState<boolean>(false)

  const [categoryIdSelect, setCategoryIdSelect] = useState<number | undefined>()
  const [productIdSelected, setProductIdSelected] = useState<number | undefined | null>()
  const [promotionPrice, setPromotionPrice] = useState<number | null>()

  const [detailProduct, setDetailProduct] = useState<IResDataDetailProduct>()
  // const [detailProductPromotion, setDetailProductPromotion] = useState<IResDataDetailProductPromotion>()

  const getDetailProduct = async () => {
    try {
      setLoading({ ...loading, detail: true })
      const res = await getDetailProductApi(productIdSelected as number)
      if (res.body.status) {
        setDetailProduct(res.body.data)
        formGeneral.setFieldsValue({ price: res.body.data.price })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, detail: false })
    }
  }

  const getDetailProductPromotion = async () => {
    try {
      setLoadingDetailProductPromotion(true)

      const res = await getDetailProductPromotionApi(id)
      if (res.body.status) {
        const detailProductPromotion = res.body.data
        // setDetailProductPromotion(detailProductPromotion)
        let defaultDataFormGeneral: IFormGeneral = {
          promotionPrice: detailProductPromotion.promotionPrice,
          productId: detailProductPromotion.productId,
          categoryId: detailProductPromotion.categoryId,
          note: detailProductPromotion.note,
        }
        formGeneral.setFieldsValue(defaultDataFormGeneral)
        setCategoryIdSelect(detailProductPromotion.categoryId)
        setProductIdSelected(detailProductPromotion.productId)
        setPromotionPrice(detailProductPromotion.promotionPrice)

        const defaultFormDateTime: IFormDateTime = {
          toTimeSale: moment(detailProductPromotion.toTimeSale),
          fromTimeSale: moment(detailProductPromotion.fromTimeSale),
        }
        formDateTime.setFieldsValue(defaultFormDateTime)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingDetailProductPromotion(false)
    }
  }

  const getDataSource = (): IDatasource[] => {
    try {
      return detailProduct!.productSizes.map((value) => {
        return {
          key: value.id,
          price: value.price,
          pricePlus: promotionPrice as number,
          productSizeName: value.name,
          pricePromotion: value.price + Number(promotionPrice ? promotionPrice : 0),
        }
      })
    } catch (e) {
      return []
    }
  }

  const onSubmit = async () => {
    try {
      setLoading({ ...loading, submit: true })
      await formGeneral.validateFields()
      await formDateTime.validateFields()

      const dataFormGeneral: IFormGeneral = formGeneral.getFieldsValue()
      const dataFormDateTime: IFormDateTime = formDateTime.getFieldsValue()

      const reqData: IReqProductPromotion = {
        product_id: dataFormGeneral.productId,
        note: dataFormGeneral.note,
        promotion_price: dataFormGeneral.promotionPrice,
        category_id: dataFormGeneral.categoryId,
        from_time_sale: moment(dataFormDateTime.fromTimeSale).toISOString(),
        to_time_sale: moment(dataFormDateTime.toTimeSale).toISOString(),
      }

      if (id) {
        const res = await putProductPromotionApi(id, reqData)
        if (res.body.status) {
          Notification.PushNotification('SUCCESS', 'Cập nhật sản phẩm khuyến mãi thành công.')
          setTimeout(() => {
            history.push(ADMIN_ROUTER.DETAIL_PRODUCT_PROMOTION.path + `?index=${id}`)
          }, 1000)
        }
      } else {
        const res = await postProductPromotionApi(reqData)
        if (res.body.status) {
          Notification.PushNotification('SUCCESS', 'Thêm mới sản phẩm khuyến mãi thành công.')
          history.push(ADMIN_ROUTER.PRODUCT_PROMOTION.path)
        }
      }
    } catch (e) {
      console.error(e)
      window.scroll({
        top: 0,
        behavior: 'smooth',
      })
    } finally {
      setLoading({ ...loading, submit: false })
    }
  }

  useEffect(() => {
    if (productIdSelected) {
      getDetailProduct()
    } else {
      setDetailProduct(undefined)
      formGeneral.resetFields()
    }
  }, [productIdSelected])

  useEffect(() => {
    id && getDetailProductPromotion()
  }, [id])

  return (
    <Spin spinning={loadingDetailProductPromotion}>
      <Affix offsetTop={Config._offsetTopAffix}>
        <PageHeader
          title={id ? 'Sửa sản phẩm khuyến mãi' : 'Thêm mới sản phẩm khuyến mãi'}
          onBack={() => history.goBack()}
          extra={[
            <Button key={'cancel'} type={'primary'} danger={true} onClick={() => history.goBack()}>
              Hủy
            </Button>,
            <Button key={'submit'} type={'primary'} onClick={onSubmit}>
              Lưu
            </Button>,
          ]}
        />
      </Affix>

      <div className={'style-box'}>
        <Card bordered={false} title={<div className={'title-card'}>Thông tin chung</div>}>
          <Form layout={'vertical'} form={formGeneral}>
            <Row gutter={[32, 16]}>
              <Col md={12}>
                <Form.Item
                  label={'Danh mục'}
                  name={'categoryId'}
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục sản phẩm.' }]}
                >
                  <SelectCategoryComponent
                    onSelected={(value) => {
                      formGeneral.setFieldsValue({ categoryId: value ? value : null })
                      setCategoryIdSelect(value)
                      formGeneral.setFieldsValue({ price: null })
                    }}
                    defaultValue={categoryIdSelect}
                    isHideCombo={true}
                  />
                </Form.Item>
                <Form.Item
                  label={'Tên sản phẩm'}
                  name={'productId'}
                  rules={[{ required: true, message: 'Vui lòng chọn sản phẩm.' }]}
                >
                  <SelectProductComponent
                    disabled={categoryIdSelect ? false : true}
                    categoryId={categoryIdSelect}
                    defaultValue={productIdSelected as number}
                    onChange={(id1) => {
                      formGeneral.setFieldsValue({ productId: id1 })
                      setProductIdSelected(id1)
                    }}
                  />
                </Form.Item>
                <Form.Item label={'Ghi chú'} name={'note'}>
                  <Input.TextArea rows={5} placeholder={'Nhập ghi chú.'} />
                </Form.Item>
              </Col>

              <Col md={12}>
                <Form.Item label={'Giá niêm yết sản phẩm'} name={'price'}>
                  <NumberFormat thousandSeparator={true} placeholder={'Nhập giá niêm yết sản phẩm'} disabled={true} />
                </Form.Item>
                <Form.Item
                  label={'Giá khuyến mại sản phẩm'}
                  name={'promotionPrice'}
                  rules={[
                    { required: true, message: 'Vui lòng nhập giá khuyến mãi' },
                    { type: 'integer', min: 0, message: 'Giá khuyến mại là số nguyên dương' },
                  ]}
                >
                  <NumberFormat
                    placeholder={'Nhập giá khuyến mại sản phẩm'}
                    thousandSeparator={true}
                    onChange={(event) => {
                      const price = Config.parserFormatNumber(event.target.value)
                      setPromotionPrice(price)
                      formGeneral.setFieldsValue({ promotionPrice: price ? price : null })
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>

      <div className={'style-box'}>
        <Card bordered={false} title={<div className={'title-card'}>Giá theo thuộc tính size sản phẩm</div>}>
          <TableHoc>
            <Table columns={columns} dataSource={detailProduct ? getDataSource() : []} />
          </TableHoc>
        </Card>
      </div>

      <div className={'style-box'}>
        <Card bordered={false} title={<div className={'title-card'}>Thời gian khuyến mãi</div>}>
          <Form labelCol={{ span: 4 }} className={'label-left'} form={formDateTime}>
            <Form.Item
              label={'Thời gian bắt đầu'}
              name={'fromTimeSale'}
              rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu.' }]}
            >
              <DatePicker
                placeholder={'Nhập Thời gian bắt đầu'}
                style={{ width: 300 }}
                format={'HH:mm DD-MM-YYYY'}
                disabledDate={disableDateAgo}
                showTime={true}
                allowClear={true}
                disabled={id && formDateTime.getFieldsValue().fromTimeSale < Date.now() ? true : false}
              />
            </Form.Item>
            <Form.Item
              label={'Thời gian kết thúc'}
              name={'toTimeSale'}
              rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc.' }]}
            >
              <DatePicker
                placeholder={'Nhập Thời gian kết thúc'}
                style={{ width: 300 }}
                showTime={true}
                allowClear
                disabledDate={disableDateAgo}
                format={'HH:mm DD-MM-YYYY'}
              />
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Spin>
  )
}

export default AddUpdateProductPromotion
