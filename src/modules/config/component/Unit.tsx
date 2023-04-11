import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Table } from 'antd'
import TableHoc from '../../../commons/HOC/TableHOC'
import { deleteUnitApi, getListUnitApi, getUnitDropListApi, postUnitApi } from '../ConfigApi'
import Config from '../../../services/Config'
import { IResDataUnit } from '../ConfigInterface'
import { IColumn } from '../../../services/Interfaces'
import Icon from '../../../commons/icon/Icon'
import { Moment } from '../../../services/Moment'
import ModalHoc from '../../../commons/HOC/ModalHOC'
import { useForm } from 'antd/es/form/Form'
import { Notification } from '../../../commons/notification/Notification'
import PopconfirmHoc from '../../../commons/HOC/PopconfirmHOC'
import { renderId } from './Attribute'

interface IDataSourceUnit extends IResDataUnit {
  key: number
  STT: number
  id: number
}

const Unit: React.FC = () => {
  const [loading, setLoading] = useState({
    table: false,
    add: false,
  })
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [listUnit, setListUnit] = useState<IDataSourceUnit[]>([])
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [form] = useForm()

  const columns: IColumn[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      width: 20,
      align: 'center',
      render: (STT) => <div>{STT}</div>,
    },
    {
      title: 'Tên đơn vị tính',
      key: 'name',
      dataIndex: 'name',
      render: (name: string) => <div>{name}</div>,
    },
    {
      title: 'Ngày tạo',
      key: 'createAt',
      dataIndex: 'createAt',
      render: (createAt: string) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
    },
    {
      title: '',
      key: 'id',
      dataIndex: 'id',
      width: 80,
      align: 'center',
      render: (id: number) => (
        <div style={{ color: 'red' }}>
          <PopconfirmHoc>
            <Popconfirm onConfirm={() => onDeleteUnit(id)} title={'Bạn có chắc muốn xóa đơn vị này?'}>
              <span style={{ fontSize: 22 }}>{Icon.BUTTON.DELETE}</span>
            </Popconfirm>
          </PopconfirmHoc>
        </div>
      ),
    },
  ]

  const onOpenModal = () => {
    setVisibleModal(true)
  }

  const onCloseModal = () => {
    setVisibleModal(false)
    form.resetFields()
  }

  const onAddUnit = async (values: { name: string }) => {
    try {
      setLoading({ ...loading, add: true })
      const res = await postUnitApi({ name: values.name })
      if (res.body.status === Config._statusSuccessCallAPI) {
        Notification.PushNotification('SUCCESS', 'Thêm mới đơn vị tính thành công.')
        setVisibleModal(false)
        getListUnit()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, add: false })
    }
  }

  const getListUnit = async () => {
    try {
      setLoading({ ...loading, table: true })
      const res = await getListUnitApi(page)
      if (res.body.status === Config._statusSuccessCallAPI) {
        setListUnit(
          res.body.data.map((value, index) => {
            return {
              ...value,
              key: value.id,
              STT: Config.getIndexTable(page, index),
            }
          })
        )
        setTotal(res.body.paging.totalItemCount)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, table: false })
    }
  }

  const onDeleteUnit = async (id: number) => {
    try {
      const res = await deleteUnitApi(id)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Xóa đơn vị tính thành công.')
        getListUnit()
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getListUnit()
  }, [page])

  return (
    <Card
      title={'Đơn vị tính'}
      extra={[
        <Button type={'primary'} icon={Icon.BUTTON.ADD} onClick={onOpenModal} key={renderId()}>
          Thêm mới
        </Button>,
      ]}
      bordered={false}
      className={'box-shadow1'}
    >
      <TableHoc>
        <Table
          dataSource={listUnit}
          loading={loading.table}
          columns={columns}
          pagination={{ onChange: (page) => setPage(page), total: total }}
        />
      </TableHoc>

      <ModalHoc>
        <Modal
          confirmLoading={loading.add}
          title={'Thêm mới đơn vị tính.'}
          visible={visibleModal}
          onCancel={onCloseModal}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={onAddUnit}>
            <Form.Item
              label={'Tên'}
              name={'name'}
              rules={[
                { required: true, whitespace: true, message: 'Vui lòng nhập đơn vị tính.' },
                { type: 'string', min: 2, max: 255, message: 'Tên đơn vị tính từ 2 - 255 ký tự' },
              ]}
            >
              <Input placeholder={'Nhập tên đơn vị'} />
            </Form.Item>
          </Form>
        </Modal>
      </ModalHoc>
    </Card>
  )
}

export const SelectUnitComponent: React.FC<{ onSelect: (id: number | null) => any; defaultSelectId?: number }> = ({
  onSelect,
  defaultSelectId,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [listUnit, setListUnit] = useState<{ id: number; name: string }[]>([])
  const [value, setValue] = useState<number | undefined>(defaultSelectId)

  const getListUnit = async () => {
    try {
      setLoading(true)
      const res = await getUnitDropListApi()
      if (res.body.status === Config._statusSuccessCallAPI) {
        setListUnit(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListUnit()
  }, [])

  useEffect(() => {
    setValue(defaultSelectId)
  }, [defaultSelectId])
  return (
    <Select
      allowClear={true}
      loading={loading}
      placeholder={'Chọn đơn vị tính'}
      onChange={(value) => {
        onSelect(value !== undefined ? Number(value) : null)
        setValue(value)
      }}
      value={value}
    >
      {listUnit.map((value) => (
        <Select.Option value={value.id}>{value.name}</Select.Option>
      ))}
    </Select>
  )
}

export default Unit
