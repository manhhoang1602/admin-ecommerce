import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import { getListShopApi } from '../ShopApi'
import { DEFAULT_PAGE, DEFINE_STATUS } from '../../Constances'
import { IResDataListShop } from '../ShopInterfaces'

const SelectShopComponent = (props: {
  type?: 'multiple' | 'tags'
  onSelect?: (value: number | undefined | number[]) => any
  defaultValue?: number | number[] | undefined
  disabled?: boolean
}) => {
  const { onSelect, type, defaultValue, disabled } = props

  const [loading, setLoading] = useState<boolean>(false)
  const [listShop, setListShop] = useState<IResDataListShop[]>([])

  const [value, setValue] = useState<number | number[] | undefined>()

  const getListShop = async () => {
    try {
      setLoading(false)
      const res = await getListShopApi(DEFAULT_PAGE, DEFINE_STATUS.ACTIVE, '', '', '', 1000)
      if (res.body.status) {
        setListShop(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListShop()
  }, [])

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <Select
      loading={loading}
      mode={type}
      placeholder={'Cửa hàng'}
      showSearch
      value={value}
      disabled={disabled}
      allowClear={true}
      optionFilterProp={'children'}
      onChange={(value) => {
        onSelect && onSelect(value as number)
        setValue(value)
      }}
    >
      {listShop.map((value) => (
        <Select.Option value={value.id}>{value.nameShop}</Select.Option>
      ))}
    </Select>
  )
}

export default SelectShopComponent
