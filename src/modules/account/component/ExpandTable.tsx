import React, { useRef, useState } from 'react'
import { Button, Card, Descriptions, Popconfirm } from 'antd'
import DescriptionsItem from 'antd/es/descriptions/Item'
import Icon from '../../../commons/icon/Icon'
import PopconfirmHoc from '../../../commons/HOC/PopconfirmHOC'
import { DEFINE_STATUS_ACCOUNT, GetTagRoleAccount, IDatasourceAccount } from '../Account'
import { Moment } from '../../../services/Moment'
import { deleteAccountApi, putResetAccountApi, putStatusAccountApi } from '../AccountAPI'
import Config from '../../../services/Config'
import { Notification } from '../../../commons/notification/Notification'
import AddUpdateAccount from './AddUpdateAccount'
import { ButtonChangeStatus } from '../../../commons/button/Button'

interface IProps {
  record: IDatasourceAccount
  callApiSuccess: () => any
}

const ExpandTable: React.FC<IProps> = ({ record, callApiSuccess }) => {
  const [loading, setLoading] = useState({
    delete: false,
    changeStatus: false,
    resetPass: false,
    update: false,
  })

  const openModal = useRef<Function>()

  const onOpenModal = () => {
    openModal.current && openModal.current()
  }

  const onDeleteAccount = async () => {
    try {
      setLoading({ ...loading, delete: true })
      const res = await deleteAccountApi(record.id)
      if (res.status === Config._statusSuccessCallAPI) {
        Notification.PushNotification('SUCCESS', `Xóa thành công tài khoản ${record.name}-${record.phone}`)
        callApiSuccess()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, delete: false })
    }
  }

  const onChangeStatusAccount = async () => {
    try {
      setLoading({ ...loading, changeStatus: true })
      const res = await putStatusAccountApi(
        record.id,
        record.status === DEFINE_STATUS_ACCOUNT.ACTIVE ? DEFINE_STATUS_ACCOUNT.INACTIVE : DEFINE_STATUS_ACCOUNT.ACTIVE
      )
      if (res.body.status === Config._statusSuccessCallAPI) {
        Notification.PushNotification(
          'SUCCESS',
          `Chuyển trạng thái thành công tài khoản ${record.name}-${record.phone}`
        )
        callApiSuccess()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, changeStatus: false })
    }
  }

  const onResetPassAccount = async () => {
    try {
      setLoading({ ...loading, resetPass: true })
      const res = await putResetAccountApi(record.id)
      if (res.body.status === Config._statusSuccessCallAPI) {
        Notification.PushNotification('SUCCESS', `Reset tài khoản thành công tài khoản ${record.name}-${record.phone}`)
        callApiSuccess()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, resetPass: false })
    }
  }

  return (
    <Card
      title={'Thông tin tài khoản'}
      bordered={false}
      actions={[
        <PopconfirmHoc>
          <Popconfirm title={'Bạn có chắc muốn ngưng hoạt động tài khoản này không.'} onConfirm={onChangeStatusAccount}>
            <ButtonChangeStatus status={record.status} loading={loading.changeStatus} onClick={() => {}} />
          </Popconfirm>
        </PopconfirmHoc>,
        <PopconfirmHoc>
          <Popconfirm title={'Bạn có chắc muốn reset mật khẩu tài khoản này không?'} onConfirm={onResetPassAccount}>
            <Button
              size={'large'}
              type={'text'}
              className={'btn-secondary-text'}
              icon={Icon.BUTTON.RESET}
              loading={loading.resetPass}
            >
              Reset mật khẩu
            </Button>
          </Popconfirm>
        </PopconfirmHoc>,
        <Button
          size={'large'}
          type={'text'}
          className={'btn-success-text'}
          icon={Icon.BUTTON.EDIT}
          onClick={onOpenModal}
        >
          Chỉnh sửa
        </Button>,
        <PopconfirmHoc>
          <Popconfirm title={'Bạn có chắc muốn xóa tài khoản này không?'} onConfirm={onDeleteAccount}>
            <Button size={'large'} type={'text'} danger icon={Icon.BUTTON.DELETE} loading={loading.delete}>
              Xóa
            </Button>
          </Popconfirm>
        </PopconfirmHoc>,
      ]}
    >
      <Descriptions column={3}>
        <DescriptionsItem label={'Tên người dùng'}>{record.name}</DescriptionsItem>
        <DescriptionsItem label={'Email'}>{record.email}</DescriptionsItem>
        <DescriptionsItem label={'Số điện thoại'}>{record.phone}</DescriptionsItem>
        <DescriptionsItem label={'Loại tài khoản'}>{GetTagRoleAccount(record.role)}</DescriptionsItem>
        <DescriptionsItem label={'Ngày tạo'}>{Moment.getDate(record.create_at, 'DD/MM/YYYY')}</DescriptionsItem>
      </Descriptions>
      <AddUpdateAccount
        type={'UPDATE'}
        onOpenModal={(fn) => (openModal.current = fn)}
        defaultForm={record}
        onCallApiSuccess={() => callApiSuccess()}
      />
    </Card>
  )
}

export default ExpandTable
