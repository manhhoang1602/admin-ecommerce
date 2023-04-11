import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Input, Popconfirm, Popover, Select, Space, Table } from 'antd'
import TableHoc from '../../../commons/HOC/TableHOC'
import { IColumn } from '../../../services/Interfaces'
import Icon from '../../../commons/icon/Icon'
import { v4 as uuidv4 } from 'uuid'
import { Notification } from '../../../commons/notification/Notification'
import {
  deleteAttributeApi,
  getAttributeDropListApi,
  getListAttributeApi,
  postAttributeApi,
  putAttributeApi,
} from '../ConfigApi'
import Config from '../../../services/Config'
import PopconfirmHoc from '../../../commons/HOC/PopconfirmHOC'
import { IReqAttribute } from '../ConfigInterface'
import { splitArray } from '../../../services/Functions'

interface IProps {
  onAddAttribute: (fn: Function) => any
}

interface IDatasource {
  key: any
  title: { id: any; title: string; isValidity: boolean }
  value: { data: { valueAttribute: string; index: number; id?: any }[]; id: any; isValidity: boolean }
  option: { data: { valueAttribute: string; index: number }[]; id: any; title: string }
  isDefault: boolean
}

export const renderId = (): string => {
  return uuidv4()
}

const reLoadPage = () => {
  window.location.reload()
}

interface IPropsMultiSelect {
  data: { data: { valueAttribute: string; index: number }[]; id: any; isValidity: boolean }
  addValueAttribute: (id: any, valueAttribute: string) => any
  deleteValueAttribute: (idAttribute: any, valueAttribute: string) => any
  onBlur?: () => any
}

const RenderMultiselect: React.FC<IPropsMultiSelect> = ({ data, addValueAttribute, deleteValueAttribute, onBlur }) => {
  const [valueAttribute, setValueAttribute] = useState<string>()

  return (
    <Select
      showSearch={true}
      mode={'multiple'}
      key={data.id}
      style={{ width: '100%' }}
      dropdownStyle={{ display: 'none' }}
      searchValue={valueAttribute}
      value={data.data.map((value) => value.valueAttribute)}
      onBlur={(event) => {
        valueAttribute && addValueAttribute(data.id, valueAttribute as string)
        setValueAttribute('')
        onBlur && onBlur()
      }}
      autoClearSearchValue={false}
      open={true}
      onDeselect={(value, option) => deleteValueAttribute(data.id, value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && valueAttribute) {
          addValueAttribute(data.id, valueAttribute as string)
          setValueAttribute('')
        }
      }}
      onSearch={(value1) => {
        setValueAttribute(value1 as string)
      }}
    />
  )
}

const Attribute: React.FC<IProps> = ({ onAddAttribute }) => {
  const columns: IColumn[] = [
    {
      title: 'Lựa chọn đi kèm',
      key: 'title',
      dataIndex: 'title',
      render: (data: { id: any; title: string; isValidity: boolean }) => (
        <div>
          <Input
            style={!data.isValidity ? { border: '1px solid red' } : {}}
            value={data.title}
            onChange={(event) => editValueAttribute(data.id, event.target.value)}
          />
        </div>
      ),
    },
    {
      title: 'Giá trị',
      key: 'value',
      dataIndex: 'value',
      render: (value: { data: { valueAttribute: string; index: number }[]; id: any; isValidity: boolean }) => (
        <RenderMultiselect
          data={value}
          addValueAttribute={(id, valueAttribute) => addValueAttribute(id, valueAttribute)}
          deleteValueAttribute={(idAttribute, valueAttribute) => deleteValueAttribute(idAttribute, valueAttribute)}
        />
      ),
    },
    {
      title: '',
      key: 'option',
      dataIndex: 'option',
      align: 'center',
      render: (data: { data: { valueAttribute: string; index: number }[]; id: any; title: any }) => (
        <Space size={'middle'}>
          <PopconfirmHoc>
            <Popconfirm title={'Bạn có chắc muốn xóa thuộc tính này không?'} onConfirm={() => deleteAttribute(data.id)}>
              <span style={{ fontSize: 22, color: 'red' }}>{Icon.BUTTON.DELETE}</span>
            </Popconfirm>
          </PopconfirmHoc>

          <Popover
            content={
              <RenderFormEditValueAttribute
                data={data.data.map((value, index) => {
                  return {
                    key: index,
                    value: { key: index, value: value.valueAttribute },
                    displayOrder: { key: index, value: value.index },
                    option: index,
                  }
                })}
                title={data.title}
                id={data.id}
              />
            }
            placement={'left'}
            trigger={'click'}
          >
            <span style={{ fontSize: 22, color: 'orange' }}>{Icon.BUTTON.EDIT}</span>
          </Popover>

          {/*<span style={{ fontSize: 22 }}>{Icon.BUTTON.SAVE}</span>*/}
        </Space>
      ),
    },
  ]

  const [loading, setLoading] = useState({
    submit: false,
    getData: false,
  })
  const [total, setTotal] = useState<number>(0)
  const [listAttribute, setListAttribute] = useState<IDatasource[]>([])
  const listAttibuteDefault = useRef<IDatasource[]>([])

  const RenderFormEditValueAttribute: React.FC<{
    data: { key: any; displayOrder: { key: any; value: number }; value: { key: any; value: string }; option: any }[]
    title: string
    id: number
  }> = ({ data, title, id }) => {
    const columnsEditValueAttribute: IColumn[] = [
      {
        title: 'Thứ tự',
        key: 'displayOrder',
        dataIndex: 'displayOrder',
        width: 30,
        align: 'center',
        render: (displayOrder: number) => (
          <div>
            <Input defaultValue={displayOrder} />
          </div>
        ),
      },
      {
        title: 'Giá trị',
        key: 'value',
        dataIndex: 'value',
        width: 120,
        render: (value: string) => (
          <div>
            <Input defaultValue={value} />
          </div>
        ),
      },
      {
        title: '',
        key: 'option',
        dataIndex: 'option',
        width: 100,
        align: 'center',
        render: (option: any) => (
          <div onClick={(event) => onDelete(option)} style={{ color: 'red' }}>
            {Icon.BUTTON.DELETE}
          </div>
        ),
      },
    ]

    const [datasource, setDatasource] = useState<any>()
    useEffect(() => {
      setDatasource(data)
    }, [data])

    const onDelete = (key: any) => {
      setDatasource(datasource.filter((value: any) => value.key !== key))
    }

    return (
      <Card bordered={false} extra={<Button type={'primary'}>Lưu</Button>}>
        <TableHoc>
          <Table columns={columnsEditValueAttribute} dataSource={datasource} />
        </TableHoc>
      </Card>
    )
  }

  const addAttribute = () => {
    const id = renderId()
    const newListAttribute = [...listAttribute]
    newListAttribute.push({
      key: id,
      title: { id: id, title: '', isValidity: true },
      option: { id: id, data: [], title: '' },
      isDefault: false,
      value: { data: [], id: id, isValidity: true },
    })
    setListAttribute(newListAttribute)
  }
  const deleteAttribute = async (id: any) => {
    try {
      setListAttribute(listAttribute.filter((value) => value.key !== id))
      if (typeof id === 'number') {
        const res = await deleteAttributeApi(id)
        if (res.body.status === Config._statusSuccessCallAPI) {
          Notification.PushNotification('SUCCESS', 'Xóa thuộc tính thành công')
        } else {
          reLoadPage()
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const addValueAttribute = (idAttribute: any, valueAttribute: string) => {
    const newListAttribute: IDatasource[] = listAttribute.map((item) => {
      if (item.key === idAttribute) {
        return {
          key: idAttribute,
          title: item.title,
          option: {
            id: item.key,
            data: [
              ...item.value.data,
              { valueAttribute: valueAttribute, index: item.value.data.length + 1, id: idAttribute },
            ],
            title: item.title.title,
          },
          value: {
            id: item.key,
            data: [...item.value.data, { valueAttribute: valueAttribute, index: item.value.data.length + 1 }],
            isValidity: true,
          },
          isDefault: item.isDefault,
        }
      } else return item
    })
    setListAttribute(newListAttribute)
  }

  const editValueAttribute = (idAttribute: any, titleAttribute: string) => {
    try {
      const newListAttribute: IDatasource[] = listAttribute.map((value) => {
        if (value.key === idAttribute) {
          return {
            ...value,
            title: { id: value.title.id, title: titleAttribute, isValidity: titleAttribute.trim() ? true : false },
          }
        } else return value
      })
      setListAttribute(newListAttribute)
    } catch (e) {
      console.error(e)
      reLoadPage()
    }
  }
  const deleteValueAttribute = (idAttribute: any, valueAttribute: string) => {
    const newListAttribute: IDatasource[] = listAttribute.map((item) => {
      if (item.key === idAttribute) {
        return {
          ...item,
          value: {
            id: item.key,
            data: item.value.data.filter((value) => value.valueAttribute !== valueAttribute),
            isValidity: item.value.data.length === 1 ? false : true,
          },
        }
      } else return item
    })

    setListAttribute(newListAttribute)
  }

  const getListAttribute = async () => {
    try {
      setLoading({ ...loading, getData: true })
      const res = await getListAttributeApi(1)
      if (res.body.status === Config._statusSuccessCallAPI) {
        const resListAttribute = res.body.data.map((value) => {
          return {
            key: value.id,
            title: { id: value.id, title: value.name, isValidity: true },
            value: {
              data: value.attributeOptions.map((value1) => {
                return { index: value1.displayOrder, valueAttribute: value1.value, id: value1.id }
              }),
              id: value.id,
              isValidity: true,
            },
            option: {
              data: value.attributeOptions.map((value1) => {
                return { index: value1.displayOrder, valueAttribute: value1.value }
              }),
              id: value.id,
              title: value.name,
            },
            isDefault: true,
          }
        })
        setListAttribute(resListAttribute)
        listAttibuteDefault.current = resListAttribute
        setTotal(res.body.paging.totalItemCount)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getData: false })
    }
  }

  const onPut = (row: IDatasource) => {
    const rowDefault = listAttibuteDefault.current.find((value) => value.key === row.key)
    const putValue = splitArray(row.value.data, rowDefault!.value.data, 'valueAttribute')

    const reqData: IReqAttribute = {
      name: row.title.title,
      new: putValue.newArray.map((value) => {
        return {
          value: value.valueAttribute,
          price: 0,
          display_order: value.index,
        }
      }),
      delete: putValue.deleteArray.map((value) => value.id),
      update: putValue.mergeArray.map((value) => {
        return {
          id: value.id,
          value: value.valueAttribute,
          price: 0,
          display_order: value.index,
        }
      }),
    }
    putAttributeApi(row.key, reqData)
  }

  const onPost = async (row: IDatasource) => {
    postAttributeApi({
      name: row.title.title,
      new: row.value.data.map((value) => {
        return { value: value.valueAttribute, price: 0, display_order: value.index }
      }),
      delete: [],
      update: [],
    })
  }

  const onSubmit = (id: any) => {
    try {
      listAttribute.forEach((value) => {
        if (!value.isDefault) {
          onPost(value)
        } else {
          onPut(value)
        }
      })
    } catch (e) {
      console.error(e)
    } finally {
      setTimeout(() => {
        Notification.PushNotification('SUCCESS', 'Thay đổi cấu hình thông tin đi kèm sản phẩm thành công.')
      }, 1000)
    }
  }

  useEffect(() => {
    getListAttribute()
  }, [])

  return (
    <div className={'box-shadow1 mb-16 mt-16'}>
      <Card
        title={'Cấu hình thông tin đi kèm sản phẩm.'}
        bordered={false}
        extra={[
          <Button key={renderId()} type={'primary'} icon={Icon.BUTTON.ADD} onClick={addAttribute}>
            Thêm thuộc tính
          </Button>,
          <Button type={'primary'} className={'ml-8'} onClick={onSubmit}>
            Lưu
          </Button>,
        ]}
      >
        <TableHoc>
          <Table columns={columns} dataSource={listAttribute} loading={loading.getData} pagination={{ total: total }} />
        </TableHoc>
      </Card>
    </div>
  )
}

export default Attribute

export const MultiSelectAttributeComponent: React.FC<{ onSelect: (value: number[]) => any; defaultSelect?: number[] }> =
  ({ onSelect, defaultSelect }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [listAttribute, setListAttribute] = useState<{ id: number; name: string }[]>([])
    const [value, setValue] = useState<number[]>(defaultSelect ? defaultSelect : [])

    const getListAttribute = async () => {
      try {
        setLoading(true)
        const res = await getAttributeDropListApi()
        if (res.body.status === Config._statusSuccessCallAPI) {
          setListAttribute(res.body.data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      getListAttribute()
    }, [])

    useEffect(() => {
      defaultSelect && setValue(defaultSelect as number[])
    }, [defaultSelect])

    return (
      <Select
        placeholder={'Chọn cấu hình'}
        loading={loading}
        mode={'multiple'}
        value={value}
        onChange={(value1) => {
          setValue(value1 as number[])
          onSelect(value1)
        }}
      >
        {listAttribute.map((value) => (
          <Select.Option value={value.id}>{value.name}</Select.Option>
        ))}
      </Select>
    )
  }
