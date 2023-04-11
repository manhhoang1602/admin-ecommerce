import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, DatePicker, Input, PageHeader, Row, Select, Spin, Tag } from 'antd'
import RangePickerHoc from '../../commons/HOC/RangePickerHOC'
import TableHoc from '../../commons/HOC/TableHOC'
import { Table } from 'antd/es'
import { IColumn } from '../../services/Interfaces'
import { Moment } from '../../services/Moment'
import AddUpdateNotification from './component/AddUpdateNotification'
import { observer } from 'mobx-react'
import { IPayloadNotification } from './NotificationInterfaces'
import { DEFAULT_PAGE } from '../Constances'
import Config from '../../services/Config'
import store, { DEFINE_NOTIFICATION_STATUS, INotification } from './NotificationStore'
import ExpandTable from './component/ExpandTable'
import { DEFINE_ROLE_ACCOUNT, GetTagRoleAccount } from '../account/Account'

export const SelectTypeAccountNotification = (props: {
  onChange: (value: number | undefined) => any
  defaultValue?: number
}) => {
  const { onChange, defaultValue } = props
  const [value, setValue] = useState<number | undefined>(undefined)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <Select
      placeholder={'Loại tài khoản'}
      allowClear={true}
      value={value}
      onChange={(value) => {
        onChange(value as number | undefined)
        setValue(value)
      }}
    >
      <Select.Option value={DEFINE_ROLE_ACCOUNT.ALL}>Tất cả</Select.Option>
      <Select.Option value={DEFINE_ROLE_ACCOUNT.CUSTOMER}>Khách hàng</Select.Option>
      <Select.Option value={DEFINE_ROLE_ACCOUNT.SHOP}>Cửa hàng</Select.Option>
    </Select>
  )
}

export const SelectStatusNotification = (props: {
  onChange?: (value: number | undefined) => any
  defaultValue?: number | undefined
}) => {
  const { onChange, defaultValue } = props
  const [value, setValue] = useState<number | undefined>()

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <Select
      placeholder={'Trạng thái thông báo'}
      allowClear={true}
      value={value}
      onChange={(value) => {
        onChange && onChange(value as number | undefined)
        setValue(value)
      }}
    >
      <Select.Option value={DEFINE_NOTIFICATION_STATUS.PUBLIC}>Đăng bài</Select.Option>
      <Select.Option value={DEFINE_NOTIFICATION_STATUS.DRAFT}>Lưu nháp</Select.Option>
    </Select>
  )
}

export const RenderNotificationStatus = (status: number) => {
  if (status === DEFINE_NOTIFICATION_STATUS.PUBLIC) {
    return <Tag color={'green'}>Đăng bài</Tag>
  }
  if (status === DEFINE_NOTIFICATION_STATUS.DRAFT) {
    return <Tag color={'purple'}>Lưu nháp</Tag>
  }
}

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    width: 80,
    align: 'center',
    render: (STT: number, row, index) => <div>{STT}</div>,
  },
  {
    title: 'Tiêu đề',
    key: 'title',
    dataIndex: 'title',
    render: (title: string, row, index) => <div>{title}</div>,
  },
  {
    title: 'Loại tài khoản',
    key: 'accountType',
    dataIndex: 'accountType',
    render: (accountType: number, row, index) => <div>{GetTagRoleAccount(accountType)}</div>,
  },
  {
    title: 'Trạng thái',
    key: 'postStatus',
    dataIndex: 'postStatus',
    render: (postStatus: number, row, index) => <div>{RenderNotificationStatus(postStatus)}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    render: (createAt: string, row, index) => <div>{Moment.getDate(createAt, 'HH:mm DD/MM/YYYY')}</div>,
  },
]

const Notification = observer(() => {
  const openModalAdd = useRef<Function>()
  const [payload, setPayload] = useState<IPayloadNotification>({
    page: DEFAULT_PAGE,
    limit: Config._limit,
  })

  useEffect(() => {
    const idTimeout = setTimeout(() => {
      store.getListNotification({ ...payload, search: payload.search?.trim() })
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [payload])

  return (
    <Spin spinning={store.loading.getListNotification}>
      <PageHeader
        title={'Gửi thông báo'}
        extra={
          <Button type={'primary'} onClick={(event) => openModalAdd.current && openModalAdd.current()}>
            Thêm mới
          </Button>
        }
      />

      <div className={'style-box'}>
        <Row gutter={[32, 16]}>
          <Col lg={7} md={7} sm={24} xs={24}>
            <Input
              onChange={(event) => setPayload({ ...payload, search: event.target.value, page: DEFAULT_PAGE })}
              placeholder={'Tiêu đề thông báo'}
              allowClear={true}
            />
          </Col>
          <Col lg={7} md={7} sm={24} xs={24}>
            <SelectTypeAccountNotification
              onChange={(value) => setPayload({ ...payload, account_type: value, page: DEFAULT_PAGE })}
            />
          </Col>
          <Col lg={7} md={7} sm={24} xs={24}>
            <RangePickerHoc
              onChange={(stringDate) =>
                setPayload({ ...payload, startDate: stringDate[0], endDate: stringDate[1], page: DEFAULT_PAGE })
              }
            >
              <DatePicker.RangePicker style={{ width: '100%' }} />
            </RangePickerHoc>
          </Col>
          <Col lg={3} md={3} sm={24} xs={24}>
            <Row justify={'end'} style={{ marginTop: 5 }}>
              Kết quả lọc: {store.totalNotification}
            </Row>
          </Col>
        </Row>
      </div>

      <div className={'style-box'}>
        <TableHoc>
          <Table
            columns={columns}
            dataSource={store.listNotification}
            expandedRowRender={(record: INotification) => {
              return <ExpandTable detailNotification={record} payload={payload} />
            }}
            pagination={{
              onChange: (page) => setPayload({ ...payload, page: page }),
              total: store.totalNotification,
              current: payload.page,
            }}
          />
        </TableHoc>
      </div>

      <AddUpdateNotification type={'ADD'} openCloseModal={(openModalFn) => (openModalAdd.current = openModalFn)} />
    </Spin>
  )
})

export default Notification
