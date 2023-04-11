import React from 'react'
import { Select } from 'antd'
import { DEFINE_STATUS } from '../../modules/Constances'

const SelectStatusComponent: React.FC<{ onChange: (id: number) => any; text?: [string, string] }> = ({
  onChange,
  text,
}) => {
  return (
    <Select
      onChange={(value) => onChange(value !== undefined ? Number(value) : DEFINE_STATUS.ALL)}
      allowClear={true}
      placeholder={'Trạng thái khuyến mại'}
    >
      <Select.Option value={DEFINE_STATUS.ACTIVE}>{text ? text[0] : 'Đang hoạt động'}</Select.Option>
      <Select.Option value={DEFINE_STATUS.INACTIVE}>{text ? text[1] : 'Ngưng hoạt động'}</Select.Option>
    </Select>
  )
}

export const SelectStatus: React.FC<{ onChange: (value: number | undefined) => any }> = ({ onChange }) => {
  return (
    <Select onChange={(value) => onChange(value as number | undefined)} allowClear={true} placeholder={'Trạng thái.'}>
      <Select.Option value={DEFINE_STATUS.ACTIVE}>Đang hoạt động</Select.Option>
      <Select.Option value={DEFINE_STATUS.INACTIVE}>Ngưng hoạt động</Select.Option>
    </Select>
  )
}

export default SelectStatusComponent
