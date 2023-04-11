import React, { useEffect } from 'react'
import { Card, Form, FormInstance, Row } from 'antd'
import UploadFileComponent, { IFile } from '../../../../../commons/upload/UploadFileComponent'
import Config from '../../../../../services/Config'
import { useForm } from 'antd/es/form/Form'

export interface IFormImage {
  imageRequired: IFile[]
  images: IFile[]
}

const ProductImage: React.FC<{ form: (form: FormInstance) => any; defaultForm?: IFormImage }> = ({
  form,
  defaultForm,
}) => {
  const [formImage] = useForm()

  useEffect(() => {
    form(formImage)
  }, [])

  useEffect(() => {
    defaultForm && formImage.setFieldsValue(defaultForm)
  }, [defaultForm])

  return (
    <div className={'style-box'}>
      <Card title={<div className={'title-card'}>Thông tin hình ảnh</div>} bordered={false}>
        <Form className={'label-left'} form={formImage} scrollToFirstError={true}>
          <Form.Item label={'Ảnh sản phẩm'}>
            <Row justify={'start'}>
              <Form.Item name={'imageRequired'} rules={[{ required: true, message: 'Vui lòng chọn ảnh đại diện' }]}>
                <UploadFileComponent
                  type={'picture-card'}
                  limit={1}
                  name={Config._nameUploadUImage}
                  path={Config._pathUploadImage}
                  size={Config._sizeUploadImage}
                  placeholder={
                    <div style={{ fontSize: 12, color: 'gray' }}>
                      <div>Ảnh đại diện</div>
                      <div>(Bắt buộc)</div>
                      <div>Tối đa 7MB</div>
                    </div>
                  }
                  logger={(data) => {
                    formImage.setFieldsValue({
                      imageRequired: data,
                    })
                  }}
                  defaultData={defaultForm ? defaultForm!.imageRequired : []}
                />
              </Form.Item>

              <Form.Item name={'images'}>
                <UploadFileComponent
                  type={'picture-card'}
                  limit={4}
                  name={Config._nameUploadUImage}
                  path={Config._pathUploadImage}
                  size={Config._sizeUploadImage}
                  isMultiple={true}
                  placeholder={
                    <div className={'placeholder-file'}>
                      <div>Ảnh sản phẩm</div>
                      <div>Tối đa 7MB</div>
                    </div>
                  }
                  logger={(data) => {
                    formImage.setFieldsValue({
                      imageRequired: formImage.getFieldValue('imageRequired'),
                      images: data,
                    })
                  }}
                  defaultData={defaultForm ? defaultForm.images : []}
                />
              </Form.Item>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default React.memo(ProductImage)
