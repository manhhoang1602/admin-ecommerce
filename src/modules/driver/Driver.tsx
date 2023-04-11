import React, { useEffect, useState } from 'react'
import { Affix, Col, DatePicker, Input, PageHeader, Row } from 'antd'
import SelectShopComponent from '../shop/component/SelectShopComponent'
import { SelectStatus } from '../../commons/select-status/SelectStatusComponent'
import RangePickerHoc from '../../commons/HOC/RangePickerHOC'
import TableHoc from '../../commons/HOC/TableHOC'
import { Table } from 'antd/es'
import { IColumn } from '../../services/Interfaces'
import { RenderStatus } from '../component/Component'
import { Moment } from '../../services/Moment'
import { IPayloadDriver } from './DriverInterface'
import { DEFAULT_PAGE } from '../Constances'
import store, { IDatasourceDriver } from './DriverStore'
import { observer } from 'mobx-react'
import Config from '../../services/Config'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    width: 50,
    render: (STT: number, row, index) => <div>{STT}</div>,
  },
  {
    title: 'Họ tên tài xế',
    key: 'name',
    dataIndex: 'name',
    render: (name: string, row, index) => <div>{name}</div>,
  },
  {
    title: 'Số điện thoại',
    key: 'phone',
    dataIndex: 'phone',
    render: (phone: string, row, index) => <div>{phone}</div>,
  },
  {
    title: 'Tên cửa hàng',
    key: 'shop',
    dataIndex: 'shop',
    render: (shop: { name: string }, row, index) => <div>{shop.name}</div>,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: (status: number, row, index) => <div>{RenderStatus(status)}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    render: (createAt: string, row, index) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
]

const Driver = observer(() => {
  const [payload, setPayload] = useState<IPayloadDriver>({
    page: DEFAULT_PAGE,
    endDate: undefined,
    status: undefined,
    startDate: undefined,
    search: undefined,
    searchShop: undefined,
    limit: Config._limit,
  })

  useEffect(() => {
    const idTimeout = setTimeout(() => {
      store.getListDriver({
        ...payload,
        search: payload.search && payload.search.trim() ? payload.search?.trim() : undefined,
      })
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [payload])

  return (
    <div>
      <PageHeader title={'Tài xế'} />

      <Affix offsetTop={Config._offsetTopAffix}>
        <div className={'style-box'}>
          <Row gutter={[32, 16]}>
            <Col md={5}>
              <Input
                placeholder={'Tên hoặc số điện thoại tài xế'}
                onChange={(event) => setPayload({ ...payload, search: event.target.value, page: DEFAULT_PAGE })}
              />
            </Col>
            <Col md={5}>
              <SelectShopComponent
                onSelect={(value) => setPayload({ ...payload, searchShop: value as number, page: DEFAULT_PAGE })}
              />
            </Col>
            <Col md={5}>
              <SelectStatus onChange={(value) => setPayload({ ...payload, status: value, page: DEFAULT_PAGE })} />
            </Col>
            <Col md={5}>
              <RangePickerHoc
                onChange={(stringDate) =>
                  setPayload({
                    ...payload,
                    startDate: stringDate[0] ? stringDate[0] : undefined,
                    endDate: stringDate[1] ? stringDate[1] : undefined,
                    page: DEFAULT_PAGE,
                  })
                }
              >
                <DatePicker.RangePicker />
              </RangePickerHoc>
            </Col>
            <Col md={4}>
              <Row justify={'end'} style={{ marginTop: 5 }}>
                Kết quả lọc: {store.total}
              </Row>
            </Col>
          </Row>
        </div>
      </Affix>

      <div className={'style-box'}>
        <TableHoc>
          <Table
            loading={store.loading.getList}
            columns={columns}
            dataSource={store.listDriver}
            onRow={(record: IDatasourceDriver) => {
              return {
                onClick: () => {
                  history.push(ADMIN_ROUTER.DRIVER_DETAIL.path + `?index=${record.id}`)
                },
              }
            }}
            pagination={{
              onChange: (page) => setPayload({ ...payload, page: page }),
              total: store.total,
              current: payload.page,
            }}
          />
        </TableHoc>
      </div>
    </div>
  )
})

export default Driver
