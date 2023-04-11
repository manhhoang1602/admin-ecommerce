import React, { useEffect, useRef, useState } from 'react'
import TableHoc from '../../../commons/HOC/TableHOC'
import { Button, Card, Col, Descriptions, Image, Row, Table, Tag } from 'antd'
import { IColumn } from '../../../services/Interfaces'
import { Moment } from '../../../services/Moment'
import { IResDataTopping } from '../ConfigInterface'
import { deleteToppingApi, getListToppingApi, putChangeStatusToppingApi } from '../ConfigApi'
import Config from '../../../services/Config'
import AddUpdateTopping from './AddUpdateTopping'
import DescriptionsItem from 'antd/es/descriptions/Item'
import { Format } from '../../../services/Format'
import { ButtonChangeStatus, ButtonDelete, ButtonEdit } from '../../../commons/button/Button'
import { Notification } from '../../../commons/notification/Notification'
import Icon from '../../../commons/icon/Icon'
import { renderId } from './Attribute'
import { DEFINE_STATUS } from '../../Constances'

export interface IDataSourceTopping extends IResDataTopping {
  key: number
  STT: number
  option?: { key: any; status: number; isDefaultData?: number }
}

interface IExpandTopping {
  record: IDataSourceTopping
  onCallApiSuccess: () => any
}

const RenderTagStatus = (status: number) => {
  if (status === DEFINE_STATUS.ACTIVE) {
    return <Tag color={'green'}>Hoạt động</Tag>
  }
  if (status === DEFINE_STATUS.INACTIVE) {
    return <Tag color={'gray'}>Ngưng hoạt động</Tag>
  }
}

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    width: 20,
    align: 'center',
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Mã topping',
    key: 'code',
    dataIndex: 'code',
    align: 'center',
    render: (code: string) => <div>{code}</div>,
  },
  {
    title: 'Tên topping',
    key: 'name',
    dataIndex: 'name',
    render: (name: string) => <div>{name}</div>,
  },
  {
    title: 'Giá niêm yết',
    key: 'price',
    dataIndex: 'price',
    render: (price: number) => <div>{price}</div>,
  },
  {
    title: 'Thứ tự hiển thị',
    key: 'displayOrder',
    dataIndex: 'displayOrder',
    align: 'center',
    render: (displayOrder: number) => <div>{displayOrder}</div>,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: (status: number) => <div>{RenderTagStatus(status)}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    render: (createAt: string) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
]

const Topping = () => {
  const [listTopping, setListTopping] = useState<IDataSourceTopping[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [arg, setArg] = useState({
    page: 1,
  })
  const [total, setTotal] = useState<number>(0)

  const openModalAdd = useRef<Function>()

  const onOpenModalAdd = () => {
    openModalAdd.current && openModalAdd.current()
  }

  const getListTopping = async () => {
    try {
      setLoading(true)
      const res = await getListToppingApi(arg.page, '')
      if (res.body.status === Config._statusSuccessCallAPI) {
        setListTopping(
          res.body.data.map((value, index) => {
            return { ...value, key: value.id, STT: Config.getIndexTable(arg.page, index) }
          })
        )
        setTotal(res.body.paging.totalItemCount)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListTopping()
  }, [arg])

  return (
    <div>
      <Card
        extra={[
          <Button key={renderId()} type={'primary'} icon={Icon.BUTTON.ADD} onClick={onOpenModalAdd}>
            Thêm
          </Button>,
        ]}
        bordered={false}
      >
        <TableHoc>
          <Table
            columns={columns}
            loading={loading}
            dataSource={listTopping}
            expandedRowRender={(record) => <ExpandTopping record={record} onCallApiSuccess={() => getListTopping()} />}
            pagination={{ onChange: (page) => setArg({ ...arg, page: page }), total: total, current: arg.page }}
          />
        </TableHoc>
        <AddUpdateTopping
          type={'ADD'}
          openModal={(fn) => (openModalAdd.current = fn)}
          onCallApiSuccess={() => getListTopping()}
        />
      </Card>
    </div>
  )
}

const ExpandTopping: React.FC<IExpandTopping> = ({ onCallApiSuccess, record }) => {
  const [loading, setLoading] = useState({
    changeStatus: false,
    delete: false,
  })

  const openModalAddTopping = useRef<Function>()

  const onChangeStatusTopping = async () => {
    try {
      setLoading({ ...loading, changeStatus: true })
      const res = await putChangeStatusToppingApi(
        record.id,
        record.status === DEFINE_STATUS.ACTIVE ? DEFINE_STATUS.INACTIVE : DEFINE_STATUS.ACTIVE
      )
      if (res.body.status === Config._statusSuccessCallAPI) {
        Notification.PushNotification(
          'SUCCESS',
          `${
            record.status === DEFINE_STATUS.INACTIVE
              ? `Topping ${record.name} đã hoạt động `
              : `Topping ${record.name} đã ngưng hoạt động`
          }`
        )
        onCallApiSuccess()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, changeStatus: false })
    }
  }

  const onUpdateTopping = () => {
    try {
      openModalAddTopping.current && openModalAddTopping.current()
    } catch (e) {
      console.error(e)
    } finally {
    }
  }

  const onDeleteTopping = async () => {
    try {
      setLoading({ ...loading, delete: true })
      const res = await deleteToppingApi(record.id)
      if (res.body.status === Config._statusSuccessCallAPI) {
        Notification.PushNotification('SUCCESS', `Xóa topping ${record.name} thành công.`)
        onCallApiSuccess()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, delete: false })
    }
  }

  return (
    <Card
      title={'Thông tin topping'}
      bordered={false}
      actions={[
        <ButtonChangeStatus
          status={record.status}
          loading={loading.changeStatus}
          onClick={() => onChangeStatusTopping()}
        />,
        <ButtonEdit onClick={() => onUpdateTopping()} />,
        <ButtonDelete
          loading={loading.delete}
          onClick={() => onDeleteTopping()}
          confirmText={'Bạn có chắc muốn xóa topping này?'}
        />,
      ]}
    >
      <Row gutter={[16, 4]}>
        <Col lg={4}>
          <Image src={record.thumbnailUrl} width={120} />
        </Col>
        <Col lg={20}>
          <Descriptions column={2}>
            <DescriptionsItem label={'Mã topping'}>{record.code}</DescriptionsItem>
            <DescriptionsItem label={'Tên topping'}>{record.name}</DescriptionsItem>
            <DescriptionsItem label={'Giá niêm yết'}>{Format.numberWithCommas(record.price, 'đ')}</DescriptionsItem>
            <DescriptionsItem label={'Trạng thái'}>{RenderTagStatus(record.status)}</DescriptionsItem>
            <DescriptionsItem label={'STT hiển thị'}>{Format.numberWithCommas(record.displayOrder)}</DescriptionsItem>
            <DescriptionsItem label={'Ngày tạo'}>{Moment.getDate(record.createAt, 'DD/MM/YYYY')}</DescriptionsItem>
          </Descriptions>
        </Col>
      </Row>
      <AddUpdateTopping
        type={'UPDATE'}
        openModal={(fn) => (openModalAddTopping.current = fn)}
        onCallApiSuccess={() => onCallApiSuccess()}
        defaultData={record}
      />
    </Card>
  )
}

export default Topping
