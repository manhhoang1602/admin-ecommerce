import React, { useEffect, useMemo, useState } from 'react'
import { Button, Checkbox, Col, Form, Input, Modal, PageHeader, Row, Spin } from 'antd'
import { SelectBannerStatus, SelectBannerTypeComponent } from './Banner'
import UploadFileComponent, { IFile } from '../../commons/upload/UploadFileComponent'
import Config from '../../services/Config'
import { useForm } from 'antd/es/form/Form'
import { IReqBanner } from './BannerInterface'
import store, { DEFINE_BANNER_STATUS } from './BannerStore'
import history from '../../services/history'
import { DEFINE_STATUS } from '../Constances'
import { observer } from 'mobx-react'
import { ADMIN_ROUTER } from '../../router/AdminRouter'
import { Notification } from '../../commons/notification/Notification'
import SunEditorComponent from '../../commons/editor/SunEditorComponent'

interface IForm extends Omit<IReqBanner, 'media_url' | 'push_notify'> {
  media_url: IFile | undefined
  push_notify: boolean | undefined
}

const AddUpdateBanner = observer(() => {
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index') as string)

  const [form] = useForm()

  const [defaultFormData, setDefaultFormData] = useState<IForm>()

  const [statusBanner, setStatusBanner] = useState<number>(DEFINE_BANNER_STATUS.DRAFT)

  const onSubmit = async (values: IForm) => {
    const reqData: IReqBanner = {
      media_url: values.media_url ? (values.media_url.response?.data.filename as string) : '',
      post_status: values.post_status,
      type: values.type,
      title: values.title,
      content: values.content,
      push_notify: values.push_notify ? 1 : 0,
    }
    if (JSON.stringify(values.content) !== '<p></p>') {
      if (id) {
        const result = await store.putBanner(id, reqData)
        if (result) {
          history.push(ADMIN_ROUTER.BANNER.path)
        }
      } else {
        store.postBanner(reqData)
      }
    } else {
      Notification.PushNotification('ERROR', 'Vui lòng nhập nội dung.')
    }
  }

  const onDelete = async () => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xóa banner này ra khỏi hệ thống không.',
      okText: 'Xác nhận',
      onOk: async () => {
        const result = await store.deleteBanner(id)
        if (result) {
          history.push(ADMIN_ROUTER.BANNER.path)
        }
      },
    })
  }

  const onChangeStatus = () => {
    Modal.confirm({
      title: `Bạn có chắc muốn ${store.detailBanner?.status ? 'ngương hoạt động' : 'hoạt động'} banner này không?`,
      okText: 'Xác nhận',
      onOk: async () => {
        const result = await store.changeStatus(
          id,
          store.detailBanner?.status ? DEFINE_STATUS.INACTIVE : DEFINE_STATUS.ACTIVE
        )
        if (result) {
          store.getDetailBanner(id)
        }
      },
    })
  }

  useEffect(() => {
    const getDetail = async () => {
      await store.getDetailBanner(id)
      if (store.detailBanner) {
        const defaultData: IForm = {
          media_url: {
            url: store.detailBanner.mediaUrl,
            name: store.detailBanner.mediaPath as string,
            uid: store.detailBanner.mediaUrl,
            status: 'done',
            response: {
              data: { url: store.detailBanner.mediaUrl, filename: store.detailBanner.mediaPath as string },
            },
          },
          title: store.detailBanner.title,
          type: store.detailBanner.type,
          content: store.detailBanner.content,
          push_notify: store.detailBanner.pushNotify ? true : false,
          post_status: store.detailBanner.postStatus,
        }
        setDefaultFormData(defaultData)
        setStatusBanner(defaultData.post_status)
        form.setFieldsValue(defaultData)
      }
    }

    if (id) {
      getDetail()
    }
  }, [])

  const getDefaultImage = useMemo(() => {
    return defaultFormData && id ? [defaultFormData.media_url as IFile] : undefined
  }, [defaultFormData])

  return (
    <Spin spinning={store.loading.detail}>
      <PageHeader
        title={id ? 'Sửa Banner, tin tức' : 'Thêm mới Banner, tin tức'}
        onBack={(e) => history.goBack()}
        extra={
          id
            ? [
                <Button
                  type={'primary'}
                  onClick={onChangeStatus}
                  className={!store.detailBanner?.status ? 'btn-secondary' : ''}
                >
                  {store.detailBanner?.status ? 'Ngưng hoạt động' : 'Hoạt động'}
                </Button>,
                <Button type={'primary'} danger={true} onClick={onDelete}>
                  Xóa
                </Button>,
                <Button loading={store.loading.submit} type={'primary'} onClick={(event) => form.submit()}>
                  Lưu
                </Button>,
              ]
            : [
                <Button type={'primary'} danger onClick={(event) => history.goBack()}>
                  Hủy
                </Button>,
                <Button loading={store.loading.submit} type={'primary'} onClick={(event) => form.submit()}>
                  Lưu
                </Button>,
              ]
        }
      />

      <div className={'style-box'}>
        <Form layout={'vertical'} form={form} onFinish={onSubmit}>
          <Row gutter={[32, 16]}>
            <Col md={12}>
              <Form.Item
                label={'Tiêu đề banner'}
                name={'title'}
                rules={[
                  { required: true, whitespace: true, message: 'Vui lòng nhập banner' },
                  { type: 'string', max: 255, message: 'Tiêu đề banner không vượt quá 255 ký tự.' },
                ]}
              >
                <Input placeholder={'Nhập tiêu đề banner'} allowClear={true} />
              </Form.Item>
              <Form.Item
                label={'Loại banner'}
                name={'type'}
                rules={[{ required: true, message: 'Vui lòng chọn loại banner' }]}
              >
                <SelectBannerTypeComponent
                  defaultValue={id ? store.detailBanner?.type : undefined}
                  onChange={(value) => {
                    form.setFieldsValue({ type: value })
                  }}
                />
              </Form.Item>

              <Form.Item name={'push_notify'} valuePropName={'checked'}>
                <Checkbox
                  disabled={
                    (store.detailBanner?.pushNotify && id) || statusBanner === DEFINE_BANNER_STATUS.DRAFT ? true : false
                  }
                >
                  Gửi thông báo cho khách hàng
                </Checkbox>
              </Form.Item>
              <Form.Item
                label={'Ảnh banner'}
                name={'media_url'}
                rules={[{ required: true, message: 'Vui lòng chọn ảnh banner.' }]}
              >
                <UploadFileComponent
                  type={'picture-card'}
                  limit={1}
                  name={Config._nameUploadUImage}
                  path={Config._pathUploadImage}
                  size={Config._sizeUploadImage}
                  logger={(data) => form.setFieldsValue({ media_url: data.length > 0 ? data[0] : undefined })}
                  defaultData={getDefaultImage}
                />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label={'Trạng thái banner'}
                name={'post_status'}
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái banner.' }]}
              >
                <SelectBannerStatus
                  disabled={id && store.detailBanner?.postStatus === DEFINE_BANNER_STATUS.PUBLIC ? true : false}
                  defaultValue={id ? store.detailBanner?.postStatus : undefined}
                  onChange={(value) => {
                    form.setFieldsValue({ post_status: value })
                    setStatusBanner(value as number)
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/*<Form.Item*/}
          {/*  label={'Nội dung'}*/}
          {/*  name={'content'}*/}
          {/*  rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập nội dung.' }]}*/}
          {/*>*/}
          {/*  <EditorComponent*/}
          {/*    onChange={(value) => {*/}
          {/*      form.setFieldsValue({ content: value })*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</Form.Item>*/}

          <SunEditorComponent
            label={'Nội dung'}
            name={'content'}
            rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập nội dung.' }]}
            loading={store.loading.detail}
            form={form}
          />
        </Form>
      </div>
    </Spin>
  )
})

export default AddUpdateBanner
