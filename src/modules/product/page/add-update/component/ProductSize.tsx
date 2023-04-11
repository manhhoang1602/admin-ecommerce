import React, { useEffect, useState } from 'react'
import { Button, Card, Input, Radio, Space, Table } from 'antd'
import TableHoc from '../../../../../commons/HOC/TableHOC'
import { IColumn } from '../../../../../services/Interfaces'
import Icon from '../../../../../commons/icon/Icon'
import { v4 as uuidv4 } from 'uuid'
import NumberFormat from 'react-number-format'
import { Format } from '../../../../../services/Format'
import { Notification } from '../../../../../commons/notification/Notification'
import Config from '../../../../../services/Config'
import { DEFINE_STATUS } from '../../../../Constances'

export interface IDatasourceAttributeSize {
  key?: any
  name: { key: any; value: string | null; isValidity: boolean }
  price: { key: any; value: number | null; isValidity: boolean }
  totalPrice: number
  isDefault: { key: any; value: number }
  status: number
  option: { key: any; status: number; isDefaultData?: number }
}

const DEFINE_ISDEFAULT = {
  DEFAULT: 1,
  NOT_DEFAULT: 0,
}

const ProductSize: React.FC<{
  onChange: (data: IDatasourceAttributeSize[]) => any
  type: 'GET_ALL' | 'GET_ACTIVE'
  priceInfo: number
  defaultData?: IDatasourceAttributeSize[]
}> = ({ onChange, type, priceInfo, defaultData }) => {
  const columnsSize: IColumn[] = [
    {
      title: 'Thuộc tính',
      key: 'name',
      dataIndex: 'name',
      render: (name: { key: any; value: string | null; isValidity: boolean }) => (
        <Input
          value={name.value as string}
          style={!name.isValidity ? { border: '1px solid red' } : {}}
          onChange={(event) => onChangeText('ATTRIBUTE', name.key, event.target.value)}
        />
      ),
    },
    {
      title: 'Giá cộng thêm',
      key: 'price',
      dataIndex: 'price',
      render: (price: { key: any; value: number | null; isValidity: boolean }) => (
        <NumberFormat
          value={price.value as number}
          style={!price.isValidity ? { border: '1px solid red' } : {}}
          thousandSeparator={true}
          onChange={(event) => onChangeText('VALUE', price.key, event.target.value)}
        />
      ),
    },
    {
      title: 'Giá trị',
      key: 'totalPrice',
      dataIndex: 'totalPrice',
      render: (totalPrice: number) => Format.numberWithCommas(totalPrice, 'đ'),
    },
    {
      title: 'Mặc định',
      key: 'isDefault',
      dataIndex: 'isDefault',
      width: 120,
      align: 'center',
      render: (isDefault: { key: any; value: number }) => (
        <div>{<Radio checked={isDefault.value ? true : false} onChange={(e) => onChangeDefault(isDefault.key)} />}</div>
      ),
    },
    {
      title: '',
      key: 'option',
      dataIndex: 'option',
      align: 'center',
      width: 200,
      render: (option: { key: number; status: number }) => (
        <div>
          <Space size={'middle'}>
            <span
              style={{ color: option.status ? 'blue' : 'gray', fontSize: 12 }}
              onClick={(event) => onChangeStatusAttribute(option.key)}
            >
              {option.status ? Icon.BUTTON.ENABLE : Icon.BUTTON.DISABLE}
            </span>
            <span style={{ color: 'red', fontSize: 20 }} onClick={(event) => onDeleteAttribute(option.key)}>
              {Icon.BUTTON.DELETE}
            </span>
          </Space>
        </div>
      ),
    },
  ]

  const [listAttributeSize, setListAttributeSize] = useState<IDatasourceAttributeSize[]>([])

  const setFirstRowIsDefault = (data: IDatasourceAttributeSize[]) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].status) {
        data[i].isDefault.value = DEFINE_ISDEFAULT.DEFAULT
        break
      }
    }
  }

  const onAddAttribute = () => {
    try {
      if (priceInfo) {
        let newListAttribute = [...listAttributeSize]
        const key = uuidv4()
        newListAttribute.push({
          key: key,
          isDefault: {
            key: key,
            value: listAttributeSize.length === 0 ? DEFINE_ISDEFAULT.DEFAULT : DEFINE_ISDEFAULT.NOT_DEFAULT,
          },
          status: DEFINE_STATUS.ACTIVE,
          name: { key: key, value: null, isValidity: true },
          totalPrice: 0,
          price: { key: key, value: null, isValidity: true },
          option: { key: key, status: DEFINE_STATUS.ACTIVE },
        })
        setListAttributeSize(newListAttribute)
      } else {
        Notification.PushNotification('ERROR', 'Vui lòng nhập giá niêm yết trong thông tin chung.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onDeleteAttribute = (key: any) => {
    try {
      let flagIsItemIsDefault: boolean = false
      let newListAttributeSize = listAttributeSize.filter((value) => {
        if (value.key === key && value.isDefault.value) {
          flagIsItemIsDefault = true
        }
        return value.key !== key
      })

      if (flagIsItemIsDefault) {
        setFirstRowIsDefault(newListAttributeSize)
      }

      setListAttributeSize(newListAttributeSize)
    } catch (e) {
      console.error(e)
    }
  }

  const onChangeStatusAttribute = async (key: any) => {
    try {
      let flagIsItemIsDefault: boolean = false
      let newListAttributeSize = listAttributeSize.map((value) => {
        if (value.key === key) {
          if (value.isDefault.value && value.status) {
            flagIsItemIsDefault = true
          }
          return {
            ...value,
            status: value.status ? DEFINE_STATUS.INACTIVE : DEFINE_STATUS.ACTIVE,
            isDefault: {
              ...value.isDefault,
              value: flagIsItemIsDefault ? DEFINE_ISDEFAULT.NOT_DEFAULT : DEFINE_ISDEFAULT.NOT_DEFAULT,
            },
            option: {
              ...value.option,
              status: value.status ? DEFINE_STATUS.INACTIVE : DEFINE_STATUS.ACTIVE,
            },
          }
        } else return value
      })

      if (flagIsItemIsDefault) {
        setFirstRowIsDefault(newListAttributeSize)
      }

      const checkHasDefault = () => {
        return newListAttributeSize.find((value) => value.isDefault.value)
      }

      if (!checkHasDefault()) {
        setFirstRowIsDefault(newListAttributeSize)
      }

      setListAttributeSize(newListAttributeSize)
    } catch (e) {
      console.error(e)
    }
  }

  const onChangeText = (type: 'ATTRIBUTE' | 'VALUE', key: any, value: any) => {
    try {
      if (priceInfo) {
        setListAttributeSize(
          listAttributeSize.map((value1) => {
            if (value1.key === key) {
              return {
                ...value1,
                name: {
                  ...value1.name,
                  value: type === 'ATTRIBUTE' ? value : value1.name.value,
                  isValidity: type === 'ATTRIBUTE' ? (value ? true : false) : value1.name.isValidity,
                },
                price: {
                  ...value1.price,
                  value: type === 'VALUE' ? value : value1.price.value,
                  isValidity: type === 'VALUE' ? (value ? true : false) : value1.name.isValidity,
                },
                totalPrice: type === 'VALUE' ? priceInfo + Number(Config.parserFormatNumber(value)) : value1.totalPrice,
              }
            } else return value1
          })
        )
      } else {
        Notification.PushNotification('ERROR', 'Vui lòng nhập giá niêm yết trong thông tin chung.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onChangeDefault = (key: any) => {
    let row = listAttributeSize.find((value) => value.key === key)
    if (row?.status) {
      let newListAttributeSize: IDatasourceAttributeSize[] = listAttributeSize.map((value) => {
        if (value.key === key) {
          return { ...value, isDefault: { ...value.isDefault, value: DEFINE_ISDEFAULT.DEFAULT } }
        } else return { ...value, isDefault: { ...value.isDefault, value: DEFINE_ISDEFAULT.NOT_DEFAULT } }
      })
      setListAttributeSize(newListAttributeSize)
    }
  }

  useEffect(() => {
    if (type === 'GET_ALL') {
      onChange(listAttributeSize)
    } else {
      onChange(listAttributeSize.filter((value) => value.status))
    }
  }, [listAttributeSize])

  useEffect(() => {
    // set table when change price
    setListAttributeSize(
      listAttributeSize.map((value) => {
        return {
          ...value,
          totalPrice: priceInfo + Number(Config.parserFormatNumber(String(value.price.value))),
        }
      })
    )
  }, [priceInfo])

  useEffect(() => {
    defaultData && setListAttributeSize(defaultData)
  }, [defaultData])

  return (
    <div className={'style-box'}>
      <Card
        bordered={false}
        extra={[
          <Button type={'primary'} key={'ProductSize'} icon={Icon.BUTTON.ADD} onClick={onAddAttribute}>
            Thêm thuộc tính
          </Button>,
        ]}
        title={<div className={'title-card'}>Thuộc tính size sản phẩm</div>}
      >
        <TableHoc>
          <Table columns={columnsSize} dataSource={listAttributeSize} />
        </TableHoc>
      </Card>
    </div>
  )
}

export default React.memo(ProductSize)
