import React, { useEffect, useState } from 'react'
import { Badge, Form, Input, Layout, Modal, Popover, Select } from 'antd'
import Icon from '../../commons/icon/Icon'
import { getUserInfo, logout } from '../login/LoginFN'
import NotificationHeaderComponent from '../../commons/notification/NotificationHeaderComponent'
import store from './NotificationHeaderStore'
import { observer } from 'mobx-react'
import ModalHOC from '../../commons/HOC/ModalHOC'
import UploadFileComponent from '../../commons/upload/UploadFileComponent'
import Config from '../../services/Config'
import { DEFINE_ROLE_ACCOUNT } from '../account/Account'
import { useForm } from 'antd/es/form/Form'
import { putAccountApi, putChangePassAPI } from '../account/AccountAPI'
import { Notification } from '../../commons/notification/Notification'

const { Header } = Layout

interface IHeaderComponent {
  toggle: () => any
}

export const HeaderComponent: React.FC<IHeaderComponent> = ({ toggle }) => {
  return (
    <Header className="site-layout-background">
      <div className={'wrapper-content-header'}>
        <BrandComponent />
        <OptionTopComponent onToggle={() => toggle()} />
      </div>
    </Header>
  )
}

const BrandComponent: React.FC = () => {
  return (
    <div className={'brand-component'}>
      <span className={'name-brand'}>ZOCO</span>
    </div>
  )
}

const OptionTopComponent: React.FC<{ onToggle: () => any }> = observer(({ onToggle }) => {
  const [popoverVisible, setPopoverVisible] = useState({
    account: false,
    notification: false,
  })

  const [visibleModalUpdateAccount, setVisibleModalUpdateAccount] = useState<boolean>()
  const [formUpdateRef] = useForm()

  const [visibleModalChangePass, setVisibleModalChangePass] = useState<boolean>()
  const [formChangePassRef] = useForm()

  const [loadingFormUpdate, setLoadingFormUpdate] = useState<boolean>()
  const [loadingFormChangePass, setLoadingFormChangePass] = useState<boolean>()

  const updateAccount = async (values: any) => {
    try {
      setLoadingFormUpdate(true)
      const res = await putAccountApi(getUserInfo().id, {
        name: values.name,
        profile_picture_url: values.image,
        email: values.email,
      })
      if (res.body.status) {
        setVisibleModalUpdateAccount(false)
        logout()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingFormUpdate(false)
    }
  }

  const changePass = async (values: any) => {
    try {
      if (values.new_password === values.confirm_password) {
        setLoadingFormChangePass(true)
        const res = await putChangePassAPI({ password_new: values.new_password, password_old: values.old_password })
        if (res.body.status) {
          setVisibleModalChangePass(false)
          logout()
        }
      } else {
        Notification.PushNotification('SUCCESS', 'Mật khẩu không khớp')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingFormChangePass(false)
    }
  }

  const RenderPopoverAccount = () => {
    return (
      <Popover
        placement={'bottom'}
        className={'popover-header'}
        trigger={'click'}
        visible={popoverVisible.account}
        onVisibleChange={() =>
          setPopoverVisible({
            ...popoverVisible,
            account: !popoverVisible.account,
          })
        }
        content={
          <div
            className={'content-list-account'}
            onClick={() => setPopoverVisible({ ...popoverVisible, account: false })}
          >
            <div className={'item'} onClick={(event) => setVisibleModalUpdateAccount(true)}>
              Thông tin tài khoản
            </div>
            <div className={'item'} onClick={(event) => setVisibleModalChangePass(true)}>
              Đổi mật khẩu
            </div>
            <div className={'item'} onClick={logout}>
              Đăng xuất
            </div>
          </div>
        }
      >
        <span>{Icon.HEADER_ICON.USER}</span>
      </Popover>
    )
  }

  const RenderPopoverNotification = observer(() => {
    useEffect(() => {
      store.getListNotification(store.payload)
    }, [store.payload])

    return (
      <Popover
        placement={'bottom'}
        className={'popover-header'}
        trigger={'click'}
        visible={popoverVisible.notification}
        onVisibleChange={() => setPopoverVisible({ ...popoverVisible, notification: !popoverVisible.notification })}
        content={
          <NotificationHeaderComponent
            title={'Thông báo'}
            onClick={(data) => {
              store.putReadNotification('SINGLE', data.id)
              store.navigateNotification(data)
            }}
            listNotification={store.listNotificationHeader}
            extra={[
              <div
                style={{ color: 'orange', fontSize: 13, cursor: 'pointer' }}
                onClick={(event) => store.putReadNotification('ALL')}
              >
                Đọc tất cả
              </div>,
            ]}
            onLoadMore={() => {
              store.getListNotification({ page: 1, limit: store.payload.limit })
              store.loadMore()
            }}
            visibledLoadMore={store.total > store.payload.limit}
            loading={store.loading.readNotification || store.loading.getList}
          />
        }
      >
        <Badge count={store.countNotification} size={'small'}>
          <span className={'mr-16'}>{Icon.HEADER_ICON.NOTIFICATION}</span>
        </Badge>
      </Popover>
    )
  })

  return (
    <div className={'option-top-component'}>
      <div onClick={() => onToggle()}>{Icon.COLLAPSED_MENU}</div>
      <div className={'wrapper-icon-header'}>
        <RenderPopoverNotification />
        <RenderPopoverAccount />
      </div>

      <ModalHOC>
        <Modal
          title={'Sửa tài khoản'}
          visible={visibleModalUpdateAccount}
          onCancel={(e) => setVisibleModalUpdateAccount(false)}
          onOk={(e) => formUpdateRef.submit()}
          confirmLoading={loadingFormUpdate}
        >
          <Form
            layout={'vertical'}
            onFinish={updateAccount}
            initialValues={{
              name: getUserInfo().name,
              email: getUserInfo().email,
              type: getUserInfo().role,
              phone: getUserInfo().phone,
              image: getUserInfo().profilePicturePath,
            }}
            form={formUpdateRef}
          >
            <Form.Item
              label={'Họ tên'}
              name={'name'}
              rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input allowClear={true} />
            </Form.Item>
            <Form.Item
              label={'Số điện thoại'}
              name={'phone'}
              rules={[{ required: true, whitespace: true, message: '' }]}
            >
              <Input allowClear={true} disabled={true} />
            </Form.Item>
            <Form.Item
              label={'Email'}
              name={'email'}
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không đúng định dạng' },
              ]}
            >
              <Input allowClear={true} />
            </Form.Item>
            <Form.Item
              label={'Loại tài khoản'}
              name={'type'}
              rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản' }]}
            >
              <Select onChange={(value) => console.log('run')} disabled={true}>
                <Select.Option value={DEFINE_ROLE_ACCOUNT.ADMIN}>Admin</Select.Option>
                <Select.Option value={DEFINE_ROLE_ACCOUNT.ACCOUNTANT}>Kế toán</Select.Option>
                <Select.Option value={DEFINE_ROLE_ACCOUNT.EDITOR}>Biên tập</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label={'Ảnh đại diện'} name={'image'}>
              <UploadFileComponent
                type={'picture-card'}
                limit={1}
                name={Config._nameUploadUImage}
                path={Config._pathUploadImage}
                size={Config._sizeUploadImage}
                defaultData={
                  getUserInfo()
                    ? [
                        {
                          uid: getUserInfo().profilePicturePath,
                          name: getUserInfo().profilePicturePath,
                          url: getUserInfo().profilePictureUrl,
                          status: 'done',
                        },
                      ]
                    : []
                }
                logger={(data) =>
                  formUpdateRef.setFieldsValue({ image: data.length > 0 ? data[0].response!.data.filename : null })
                }
              />
            </Form.Item>
          </Form>
        </Modal>
      </ModalHOC>

      <ModalHOC>
        <Modal
          title={'Đổi mật khẩu'}
          visible={visibleModalChangePass}
          onCancel={(e) => setVisibleModalChangePass(false)}
          onOk={(e) => formChangePassRef.submit()}
          confirmLoading={loadingFormChangePass}
        >
          <Form layout={'vertical'} onFinish={changePass} form={formChangePassRef}>
            <Form.Item
              label={'Mật khẩu cũ'}
              name={'old_password'}
              rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password allowClear={true} />
            </Form.Item>
            <Form.Item
              label={'Mật khẩu mới'}
              name={'new_password'}
              rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password allowClear={true} />
            </Form.Item>
            <Form.Item
              label={'Xác nhận mật khẩu'}
              name={'confirm_password'}
              rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password allowClear={true} />
            </Form.Item>
          </Form>
        </Modal>
      </ModalHOC>
    </div>
  )
})
