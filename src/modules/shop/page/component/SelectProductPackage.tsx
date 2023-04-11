import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import { getListPackageProductApi } from '../../ShopApi'
import { IResDataPackageProduct } from '../../ShopInterfaces'
import styled from 'styled-components'

interface IProps {
  onSelect?: (value: number | undefined) => any
}

const SelectStyle = styled(Select)`
  .ant-select-selection-item {
    text-align: start;
  }
`

const SelectProductPackage = (props: IProps) => {
  const { onSelect } = props
  const [loading, setLoading] = useState<boolean>()
  const [listPackageProduct, setListPackageProduct] = useState<IResDataPackageProduct[]>([])

  const getListPackageProduct = async () => {
    try {
      setLoading(true)
      const res = await getListPackageProductApi()
      if (res.body.status) {
        setListPackageProduct(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListPackageProduct()
  }, [])

  return (
    <SelectStyle
      placeholder={'Gói sản phẩm.'}
      loading={loading}
      style={{ width: 140, marginRight: 8 }}
      allowClear={true}
      onChange={(value) => onSelect && onSelect(value as number)}
    >
      {listPackageProduct.map((value) => {
        return <Select.Option value={value.id}>{value.name}</Select.Option>
      })}
    </SelectStyle>
  )
}

export default SelectProductPackage
