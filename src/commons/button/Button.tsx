import React from 'react'
import { DEFINE_STATUS_CATE } from '../../modules/category/Category'
import Icon from '../icon/Icon'
import { Button, Popconfirm } from 'antd'

export const ButtonChangeStatus: React.FC<{
  status: number
  loading: boolean
  onClick: () => any
  isPrimary?: boolean
}> = ({ status, loading, onClick, isPrimary }) => {
  return (
    <Button
      type={isPrimary ? 'primary' : 'text'}
      size={isPrimary ? 'middle' : 'large'}
      icon={isPrimary ? undefined : status === DEFINE_STATUS_CATE.ENABLE ? Icon.BUTTON.ENABLE : Icon.BUTTON.DISABLE}
      className={
        isPrimary
          ? `${!status && 'btn-secondary'}`
          : status === DEFINE_STATUS_CATE.ENABLE
          ? 'btn-primary-text'
          : 'btn-secondary-text'
      }
      onClick={() => onClick()}
      loading={loading}
    >
      {status === DEFINE_STATUS_CATE.ENABLE ? 'Ngưng hoạt động' : 'Hoạt động'}
    </Button>
  )
}

export const ButtonEdit: React.FC<{ loading?: boolean; onClick: () => any }> = ({ onClick, loading }) => {
  return (
    <Button
      size={'large'}
      type={'text'}
      icon={Icon.BUTTON.EDIT}
      className={'btn-success-text'}
      onClick={() => onClick()}
    >
      Chỉnh sửa
    </Button>
  )
}

export const ButtonDelete: React.FC<{ loading: boolean; onClick: () => any; confirmText: string }> = ({
  onClick,
  loading,
  confirmText,
}) => {
  return (
    <Popconfirm title={confirmText} onConfirm={() => onClick()}>
      <Button size={'large'} type={'text'} danger icon={Icon.BUTTON.DELETE} loading={loading}>
        Xóa
      </Button>
    </Popconfirm>
  )
}
