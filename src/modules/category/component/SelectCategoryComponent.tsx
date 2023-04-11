import React, { CSSProperties, useEffect, useState } from 'react'
import { Select } from 'antd'
import { getCateDropListApi } from '../CategoryApi'
import Config from '../../../services/Config'
import { IResDataListCate } from '../CategoryInterface'

const SelectCategoryComponent: React.FC<{
  onSelected: (value: number) => any
  style?: CSSProperties
  defaultValue?: number
  isHideCombo?: boolean
}> = ({ onSelected, style, defaultValue, isHideCombo }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [listCate, setListCate] = useState<IResDataListCate[]>([])

  const [value, setValue] = useState<number>()

  const getListCate = async () => {
    try {
      setLoading(true)
      const res = await getCateDropListApi()
      if (res.body.status === Config._statusSuccessCallAPI) {
        setListCate(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListCate()
  }, [])

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <Select
      style={{ width: '100%', ...style }}
      allowClear={true}
      value={value || undefined}
      loading={loading}
      placeholder={'Danh mục sản phẩm'}
      onChange={(value) => {
        onSelected(value !== undefined ? Number(value) : 0)
        setValue(value !== undefined ? Number(value) : undefined)
      }}
    >
      {listCate.map((value) => {
        if (!isHideCombo) {
          return <Select.Option value={value.id}>{value.name}</Select.Option>
        } else {
          if (value.id !== 33) {
            return <Select.Option value={value.id}>{value.name}</Select.Option>
          }
        }
      })}
    </Select>
  )
}

export default SelectCategoryComponent
