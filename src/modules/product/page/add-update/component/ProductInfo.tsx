import React, { useEffect } from 'react'
import { Card, Col, Form, FormInstance, Input, Row } from 'antd'
import EditorComponent from '../../../../../commons/editor/EditorComponent'
import NumberFormat from 'react-number-format'
import { useForm } from 'antd/es/form/Form'
import { SelectUnitComponent } from '../../../../config/component/Unit'
import { MultiSelectAttributeComponent } from '../../../../config/component/Attribute'
import SelectCategoryComponent from '../../../../category/component/SelectCategoryComponent'
import Config from '../../../../../services/Config'
import SunEditorComponent from '../../../../../commons/editor/SunEditorComponent'

export interface IPropsProductInfo {
  formInfo: (form: FormInstance) => any
  defaultForm?: IFormProductInfo
  type: 'add' | 'update'
  onChangePrice?: (price: number) => any
}

export interface IFormProductInfo {
  name: string
  code: string
  unitId: number
  displayOrder: number
  categoryId: number
  price: number
  productConfigId: number[] | null
  description: string | null
}

const ProductInfo: React.FC<IPropsProductInfo> = ({ formInfo, defaultForm, type, onChangePrice }) => {
  const [form] = useForm()

  useEffect(() => {
    formInfo(form)
  }, [])

  useEffect(() => {
    if (defaultForm) {
      form.setFieldsValue(defaultForm)
      onChangePrice && onChangePrice(defaultForm.price)
    }
  }, [defaultForm])

  return (
    <div className={'style-box'}>
      <Card bordered={false} title={<div className={'title-card'}>Thông tin chung</div>}>
        <Form labelCol={{ span: 7 }} className={'label-left'} form={form} layout={'vertical'} scrollToFirstError={true}>
          <Row gutter={[124, 16]}>
            <Col lg={12} md={24} sm={24}>
              <Form.Item
                label={'Mã sản phẩm'}
                name={'code'}
                rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập mã sản phẩm.' }]}
              >
                <Input placeholder={'Nhập mã sản phẩm.'} disabled={type === 'add' ? false : true} />
              </Form.Item>
              <Form.Item
                label={'Tên sản phẩm'}
                name={'name'}
                rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập tên sản phẩm.' }]}
              >
                <Input placeholder={'Nhập tên sản phẩm'} />
              </Form.Item>
              <Form.Item
                label={'Đơn vị tính'}
                name={'unitId'}
                rules={[{ required: true, message: 'Vui lòng chọn đơn vị tính' }]}
              >
                <SelectUnitComponent
                  defaultSelectId={form.getFieldValue('unitId')}
                  onSelect={(id) => form.setFieldsValue({ unitId: id })}
                />
              </Form.Item>
              <Form.Item
                label={'STT hiển thị'}
                name={'displayOrder'}
                rules={[{ required: true, message: 'Vui lòng nhập số thứ tự hiển thị.' }]}
              >
                <NumberFormat
                  thousandSeparator={true}
                  placeholder={'STT hiển thị'}
                  onChange={(event) =>
                    form.setFieldsValue({ displayOrder: Config.parserFormatNumber(event.target.value) })
                  }
                />
              </Form.Item>
            </Col>

            <Col lg={12} md={24} sm={24}>
              <Form.Item
                label={'Danh mục'}
                name={'categoryId'}
                rules={[{ required: true, message: 'Vui lòng chọn danh mục.' }]}
              >
                <SelectCategoryComponent
                  onSelected={(value1) => form.setFieldsValue({ categoryId: value1 })}
                  defaultValue={form.getFieldValue('categoryId')}
                />
              </Form.Item>
              <Form.Item
                label={'Giá niêm yết'}
                name={'price'}
                rules={[
                  { required: true, message: 'Vui lòng nhập giá niêm yết.' },
                  { type: 'number', max: 999999999, message: 'Giá niêm yết phải ít hơn 9 chữ số.' },
                  { type: 'integer', message: 'Giá niêm yết phải là số nguyên dương.' },
                ]}
              >
                <NumberFormat
                  placeholder={'Nhập giá niêm yết.'}
                  style={{ width: '100%' }}
                  thousandSeparator={true}
                  onChange={(event) => {
                    form.setFieldsValue({
                      price: event.target.value ? Config.parserFormatNumber(event.target.value) : null,
                    })
                    onChangePrice && onChangePrice(Config.parserFormatNumber(event.target.value) as number)
                  }}
                />
              </Form.Item>
              <Form.Item name={'productConfigId'} label={'Cấu hình'}>
                <MultiSelectAttributeComponent
                  defaultSelect={form.getFieldValue('productConfigId')}
                  onSelect={(value1) => form.setFieldsValue({ productConfigId: value1 })}
                />
              </Form.Item>
            </Col>
          </Row>

          <SunEditorComponent
            name={'description'}
            label={'Mô tả'}
            labelCol={{ span: 3 }}
            form={form}
            loading={defaultForm ? true : false}
          />
        </Form>
      </Card>
    </div>
  )
}

export default React.memo(ProductInfo)
