import React from 'react'
import { Tag } from 'antd'

const DEFINE_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  ALL: 2,
}

export const RenderStatus = (status: number) => {
  if (status === DEFINE_STATUS.ACTIVE) {
    return <Tag color={'green'}>Đang hoạt động</Tag>
  }
  if (status === DEFINE_STATUS.INACTIVE) {
    return <Tag color={'gray'}>Ngưng hoạt động</Tag>
  }
}
