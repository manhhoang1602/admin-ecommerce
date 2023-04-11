import React, { useEffect, useRef, useState } from 'react'
import { Affix, Button, Card, Checkbox, Col, Form, Input, PageHeader, Row, Select, Spin, Table } from 'antd'
import NumberFormat from 'react-number-format'
import UploadFileComponent, { IFile } from '../../../commons/upload/UploadFileComponent'
import Config from '../../../services/Config'
import Icon from '../../../commons/icon/Icon'
import TableHoc from '../../../commons/HOC/TableHOC'
import { IColumn } from '../../../services/Interfaces'
import { getDetailComboApi, postComboApi, putComboApi } from '../ComboProductApi'
import { IReqCombo, IResDataDetailCombo } from '../ComboProductInterface'
import { useForm } from 'antd/es/form/Form'
import ListProductComponent, { IDataSourceSubProduct } from './component/ListProductComponent'
import { getListToppingByProductIdApi } from '../../config/ConfigApi'
import { Notification } from '../../../commons/notification/Notification'
import history from '../../../services/history'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'
import { Format } from '../../../services/Format'
import { splitArray } from '../../../services/Functions'

interface IForm {
  code: string
  name: string
  price: number
  displayOrder: number
  isDisplayHome: number
  comboMedia: IFile[]
  description: string
}

const RenderMultipleSelectToppingByProductId: React.FC<{
  productId: number
  onChange: (data: number[], totalPriceTopping: number) => any
  defaultData?: number[]
}> = ({ productId, onChange, defaultData }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [listTopping, setListTopping] = useState<{ id: number; toppingId: number; name: string; price: number }[]>([])
  const [value, setValue] = useState<number[]>([])

  const getListTopping = async () => {
    try {
      setLoading(true)
      const res = await getListToppingByProductIdApi(productId)
      setListTopping(res.body.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListTopping()
  }, [])

  useEffect(() => {
    defaultData && setValue(defaultData)
  }, [defaultData])

  return (
    <Select
      loading={loading}
      mode={'multiple'}
      onChange={(value, option) => {
        setValue(value)
        let totalPriceTopping: number = 0
        option.forEach((value1: { key: string }) => {
          if (JSON.parse(value1.key).price) {
            totalPriceTopping = totalPriceTopping + JSON.parse(value1.key).price
          }
        })
        onChange(value, totalPriceTopping)
      }}
      value={value}
    >
      {listTopping.map((value) => (
        <Select.Option key={JSON.stringify({ ids: value.toppingId, price: value.price })} value={value.toppingId}>
          {value.name}
        </Select.Option>
      ))}
    </Select>
  )
}

const AddUpdateCombo = () => {
  const onDeleteProduct = (key: any) => {
    setListProduct(listProduct.filter((value) => value.key !== key))
  }

  const onSelectTopping = (key: any, toppingIds: number[], totalPriceTopping: number) => {
    setListProduct(
      listProduct.map((value) => {
        if (value.key === key) {
          return {
            ...value,
            topping: { ...value.topping, toppingIds: toppingIds, totalPriceTopping: totalPriceTopping },
          }
        } else return value
      })
    )
  }

  const onChangeQuantity = (key: any, quantity: number) => {
    setListProduct(
      listProduct.map((value) => {
        if (value.key === key) {
          return { ...value, quantity: { ...value.quantity, value: quantity } }
        } else return value
      })
    )
  }

  const columns: IColumn[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      align: 'center',
      width: 20,
      render: (STT: number) => <div>{STT}</div>,
    },
    {
      title: 'Tên món',
      key: 'productName',
      dataIndex: 'productName',
      render: (productName: string) => <div>{productName}</div>,
    },
    {
      title: 'Thuộc tính',
      key: 'productSizeName',
      dataIndex: 'productSizeName',
      render: (productSizeName: string) => <div>{Format.formatString(productSizeName)}</div>,
    },
    {
      title: 'Topping đi kèm',
      key: 'topping',
      dataIndex: 'topping',
      render: (topping: { key: number; productId: number; toppingIds: number[]; totalPriceTopping: number }) => {
        return (
          <RenderMultipleSelectToppingByProductId
            productId={topping?.productId}
            defaultData={topping?.toppingIds}
            onChange={(data, totalPriceTopping) => onSelectTopping(topping.key, data, totalPriceTopping)}
          />
        )
      },
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      dataIndex: 'quantity',
      width: 150,
      render: (quantity: { key: any; value: number }) => (
        <NumberFormat
          value={quantity ? quantity.value : null}
          thousandSeparator={true}
          onChange={(event) => onChangeQuantity(quantity.key, Config.parserFormatNumber(event.target.value) as number)}
        />
      ),
    },
    {
      title: 'Đơn vị tính',
      key: 'unitName',
      dataIndex: 'unitName',
      render: (unitName: string) => <div>{unitName}</div>,
    },
    {
      title: 'Danh mục',
      key: 'categoryName',
      dataIndex: 'categoryName',
      render: (categoryName: string) => <div>{categoryName}</div>,
    },
    {
      title: '',
      key: 'option',
      dataIndex: 'option',
      align: 'center',
      render: (option: { key: number }) => (
        <div style={{ fontSize: 18, color: 'red' }} onClick={(event) => onDeleteProduct(option.key)}>
          {Icon.BUTTON.DELETE}
        </div>
      ),
    },
  ]

  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index') as string)

  const [form] = useForm()
  const modalListSubProduct = useRef<Function>()
  const onOpenModal = () => {
    modalListSubProduct.current && modalListSubProduct.current()
  }

  const [loading, setLoading] = useState({
    submit: false,
    getDetail: false,
  })

  const [detail, setDetail] = useState<IResDataDetailCombo>()
  const [listProduct, setListProduct] = useState<IDataSourceSubProduct[]>([])
  const defaultListProduct = useRef<IDataSourceSubProduct[]>([])

  const getDetail = async () => {
    try {
      setLoading({ ...loading, getDetail: true })
      const res = await getDetailComboApi(id)
      if (res.body.status) {
        setDetail(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getDetail: false })
    }
  }

  const onSubmit = (values: IForm) => {
    const reqData: IReqCombo = {
      name: values.name,
      code: values.code,
      display_order: Number(values.displayOrder),
      is_display_home: values.isDisplayHome ? 1 : 0,
      price: values.price,
      description: values.description ? values.description : null,
      combo_media: values.comboMedia.map((value, index) => {
        return {
          type: 1,
          is_avatar: 1,
          display_order: index + 1,
          media_url: value.response?.data.filename as string,
        }
      }),
      product_combo_item: listProduct.map((value) => {
        return {
          quantity: value.quantity.value as number,
          by_product_id: value.id,
          topping_id: value.topping.toppingIds as number[],
        }
      }),
    }

    const onPost = async () => {
      try {
        setLoading({ ...loading, submit: true })
        const res = await postComboApi(reqData)
        if (res.body.status) {
          Notification.PushNotification('SUCCESS', 'Thêm mới combo thành công.')
          history.push(ADMIN_ROUTER.COMBO.path)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading({ ...loading, submit: false })
      }
    }

    const onPut = async () => {
      try {
        setLoading({ ...loading, submit: true })
        let splitArrProduct = splitArray(listProduct, defaultListProduct.current, 'key')
        reqData.delete_product_combo_item = splitArrProduct.deleteArray.map((value) => value.id)
        reqData.update_product_combo_item = splitArrProduct.mergeArray.map((value) => {
          return {
            id: value.id,
            quantity: value.quantity.value,
            topping_id: value.topping.toppingIds,
          }
        })
        reqData.new_product_combo_item = splitArrProduct.newArray.map((value) => {
          return {
            by_product_id: value.id,
            quantity: value.quantity.value,
            topping_id: value.topping.toppingIds,
          }
        })

        delete reqData.code
        delete reqData.product_combo_item

        const res = await putComboApi(id, reqData)
        if (res.body.status) {
          Notification.PushNotification('SUCCESS', 'Cập nhật combo thành công.')
          history.push(ADMIN_ROUTER.COMBO_DETAIL.path + `?index=${id}`)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading({ ...loading, submit: false })
      }
    }

    const validate = (): { isValidity: boolean; msg: string } => {
      let validation: { isValidity: boolean; msg: string } = {
        isValidity: true,
        msg: '',
      }
      if (listProduct.length === 0) {
        validation = {
          isValidity: false,
          msg: 'Vui lòng chọn sản phẩm trong combo',
        }
      } else {
        if (listProduct.length === 1 && listProduct[0].quantity.value <= 1) {
          validation = {
            isValidity: false,
            msg: 'Vui lòng chọn số lượng sản phẩm trong combo lớn hơn 1',
          }
        }
      }
      if (!validation.isValidity) {
        return validation
      }
      listProduct.forEach((value) => {
        if (!value.quantity.value) {
          validation = {
            isValidity: false,
            msg: `Vui lòng nhập sô lượng cho món ${value.productName}`,
          }
        }
      })
      return validation
    }
    if (validate().isValidity) {
      if (id) {
        onPut()
      } else {
        onPost()
      }
    } else {
      Notification.PushNotification('ERROR', validate().msg)
    }
  }

  const getPriceCombo = (): { max: number; min: number } => {
    let price: { max: number; min: number } = {
      max: 0,
      min: 0,
    }

    let minPriceCombo: number = 0
    let maxPriceCombo: number = 0

    listProduct.forEach((value) => {
      const priceProduct: number = value.price
      const totalPriceTopping: number = value.topping ? value.topping.totalPriceTopping : 0
      const quantity: number = value.quantity ? value.quantity.value : 0

      minPriceCombo = minPriceCombo + priceProduct * quantity
      maxPriceCombo = maxPriceCombo + (priceProduct + totalPriceTopping) * quantity
    })

    price.min = minPriceCombo
    price.max = maxPriceCombo

    return price
  }

  useEffect(() => {
    id && getDetail()
  }, [])

  useEffect(() => {
    if (detail) {
      form.setFieldsValue({
        code: detail.code,
        name: detail.name,
        price: Number(detail.price),
        displayOrder: detail.displayOrder,
        isDisplayHome: detail.isDisplayHome ? true : false,
        comboMedia: detail.comboMedia.map((value) => {
          return {
            uid: value.id,
            name: value.mediaPath,
            status: 'done',
            url: value.mediaUrl,
            response: { data: { filename: value.mediaPath, url: value.mediaUrl } },
          }
        }),
        description: detail.description,
      })

      const resListProduct: IDataSourceSubProduct[] = detail.productCombos.map((value, index) => {
        const key: number = value.byProduct.productSizeId
          ? value.byProduct.productSizeId + value.byProduct.productId
          : value.byProduct.productId
        return {
          STT: index + 1,
          topping: {
            key: key,
            productId: value.byProduct.productId,
            toppingIds: value.productComboToppings.map((value1) => value1.toppingId),
            totalPriceTopping:
              value.productComboToppings.length > 0
                ? value.productComboToppings
                    .map((value1) => value1.price)
                    .reduce((previousValue, currentValue) => previousValue + currentValue)
                : 0,
          },
          quantity: { key: key, value: value.quantity },
          key: key,
          option: { key: key, status: 0, isDefaultData: 0 },
          id: value.id,
          productId: value.byProduct.productId,
          productSizeId: value.byProduct.productSizeId,
          productSizeName: value.byProduct.sizeName,
          unitName: value.byProduct.unitName,
          categoryName: value.byProduct.categoryName,
          productName: value.byProduct.name,
          price: value.byProduct.price,
          status: 0,
        }
      })

      setListProduct(resListProduct)
      defaultListProduct.current = resListProduct
    }
  }, [detail])

  return (
    <Spin spinning={loading.getDetail}>
      <Affix offsetTop={Config._offsetTopAffix}>
        <PageHeader
          title={id ? 'Sửa combo sản phẩm' : 'Thêm mới combo sản phẩm'}
          onBack={() => history.goBack()}
          extra={[
            <Button type={'primary'} danger key={'cancel'} onClick={(event) => history.goBack()}>
              Hủy
            </Button>,
            <Button type={'primary'} onClick={() => form.submit()}>
              Lưu
            </Button>,
          ]}
        />
      </Affix>

      <div className={'style-box'}>
        <Card bordered={false} title={<div className={'title-card'}>Thông tin chung</div>}>
          <Form layout={'vertical'} form={form} onFinish={onSubmit}>
            <Row gutter={[32, 4]}>
              <Col md={12}>
                <Form.Item
                  name={'code'}
                  label={'Mã combo sản phẩm'}
                  rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập mã combo sản phẩm.' }]}
                >
                  <Input placeholder={'Nhập mã combo'} disabled={id ? true : false} />
                </Form.Item>
                <Form.Item
                  name={'name'}
                  label={'Tên combo sản phẩm'}
                  rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập combo sản phẩm.' }]}
                >
                  <Input placeholder={'Nhập têm combo'} />
                </Form.Item>
                <Row justify={'start'}>
                  <Form.Item name={'isDisplayHome'} valuePropName={'checked'}>
                    <Checkbox>Hiển thị nổi bật trên màn home</Checkbox>
                  </Form.Item>
                </Row>
              </Col>

              <Col md={12}>
                <Form.Item
                  name={'price'}
                  label={'Giá niêm yết'}
                  rules={[{ required: true, message: 'Vui lòng nhập giá niêm yết' }]}
                >
                  <NumberFormat
                    thousandSeparator={true}
                    placeholder={'Nhập giá niêm yết'}
                    onChange={(event) => form.setFieldsValue({ price: Config.parserFormatNumber(event.target.value) })}
                  />
                </Form.Item>
                <Form.Item
                  name={'displayOrder'}
                  label={'STT hiển thị'}
                  rules={[{ required: true, message: 'Vui lòng nhập stt hiển thị' }]}
                >
                  <Input type={'number'} placeholder={'Nhập STT hiển thị'} />
                </Form.Item>
              </Col>

              <Col md={24} className={'mt-16'}>
                <Form.Item
                  name={'comboMedia'}
                  label={'Ảnh combo sản phẩm'}
                  rules={[{ required: true, message: 'Vui lòng chọn ảnh combo' }]}
                >
                  <UploadFileComponent
                    type={'picture-card'}
                    isMultiple={true}
                    limit={5}
                    name={Config._nameUploadUImage}
                    path={Config._pathUploadImage}
                    size={Config._sizeUploadImage}
                    placeholder={<div className={'placeholder-file'}>Ảnh combo</div>}
                    defaultData={detail ? form.getFieldValue('comboMedia') : undefined}
                    logger={(data) => {
                      form.setFieldsValue({ comboMedia: data })
                    }}
                  />
                </Form.Item>
              </Col>

              <Col md={24}>
                <Form.Item name={'description'} label={'Mô tả.'}>
                  <Input.TextArea rows={7} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>

      <div className={'style-box'}>
        <Card
          title={<div className={'title-card'}>Thông tin sản phẩm trong combo</div>}
          bordered={false}
          extra={
            <Button type={'primary'} icon={Icon.BUTTON.ADD} onClick={onOpenModal}>
              Thêm sản phẩm
            </Button>
          }
        >
          <ul>
            <li className={'text-primary'}>
              Giá combo: {Format.numberWithCommas(getPriceCombo().min, 'đ')} -{' '}
              {Format.numberWithCommas(getPriceCombo().max, 'đ')}
            </li>
          </ul>
          <TableHoc>
            <Table columns={columns} dataSource={listProduct} />
          </TableHoc>
        </Card>
      </div>
      <ListProductComponent
        modal={(modal) => (modalListSubProduct.current = modal)}
        defaultSelect={listProduct}
        onSave={(listSubProduct) => {
          const newListSubProduct = listSubProduct.map((value, index) => {
            return { ...value, STT: index + 1 }
          })
          const listSubProductSplit = splitArray(newListSubProduct, listProduct, 'key', 'defaultArray')
          setListProduct(listSubProductSplit.mergeArray.concat(listSubProductSplit.newArray) as IDataSourceSubProduct[])
        }}
        title={'Thêm sản phẩm vào combo'}
      />
    </Spin>
  )
}

export default AddUpdateCombo
