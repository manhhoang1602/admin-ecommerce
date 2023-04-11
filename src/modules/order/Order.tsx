import React, { useEffect, useState } from 'react'
import { Col, DatePicker, Input, PageHeader, Row, Select, Tag } from 'antd'
import RangePickerHoc from '../../commons/HOC/RangePickerHOC'
import { Table } from 'antd/es'
import { DEFAULT_PAGE } from '../Constances'
import { IColumn } from '../../services/Interfaces'
import { getListOrderApi } from './OrderApi'
import { IPayloadOrder, IResDataOrder } from './OrderInterfaeces'
import Config from '../../services/Config'
import TableHoc from '../../commons/HOC/TableHOC'
import { Format } from '../../services/Format'
import { Moment } from '../../services/Moment'
import SelectShopComponent from '../shop/component/SelectShopComponent'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'

export interface IDatasourceOrder extends IResDataOrder {
  STT: number
  key: number
}

export const DEFINE_ORDER_STATUS = {
  PENDING: 1, // chờ xác nhận
  CONFIRMED: 2, // đã xác nhận
  DELIVERING: 3, // đang giao / đang thực hiện
  ARRIVED: 4, // đã đến nơi
  DONE: 5, // hoàn thành
  CANCEL: 6, // hủy
}

export const RenderStatusOrder = (status: number) => {
  if (status === DEFINE_ORDER_STATUS.PENDING) return <Tag color={'orange'}>Chờ xác nhận</Tag>
  if (status === DEFINE_ORDER_STATUS.CONFIRMED) return <Tag color={'blue'}>Đã xác nhận</Tag>
  if (status === DEFINE_ORDER_STATUS.DELIVERING) return <Tag color={'orange'}>Đang giao</Tag>
  if (status === DEFINE_ORDER_STATUS.ARRIVED) return <Tag color={'blue'}>Đã đến nơi</Tag>
  if (status === DEFINE_ORDER_STATUS.DONE) return <Tag color={'green'}>Hoàn thành</Tag>
  if (status === DEFINE_ORDER_STATUS.CANCEL) return <Tag color={'red'}>Hủy</Tag>
}

export const GetStatusOrder = (status: number) => {
  if (status === DEFINE_ORDER_STATUS.PENDING) return 'Chờ xác nhận'
  if (status === DEFINE_ORDER_STATUS.CONFIRMED) return 'Đã xác nhận'
  if (status === DEFINE_ORDER_STATUS.DELIVERING) return 'Đang giao'
  if (status === DEFINE_ORDER_STATUS.ARRIVED) return 'Đã đến nơi'
  if (status === DEFINE_ORDER_STATUS.DONE) return 'Hoàn thành'
  if (status === DEFINE_ORDER_STATUS.CANCEL) return 'Hủy'
}

export const SelectStatusOrderComponent = (props: { onChange?: (value?: number) => any }) => {
  const { onChange } = props
  return (
    <Select placeholder={'Trạng thái'} allowClear={true} onChange={(value) => onChange && onChange(value as number)}>
      <Select.Option value={DEFINE_ORDER_STATUS.PENDING}>Chờ xác nhận</Select.Option>
      <Select.Option value={DEFINE_ORDER_STATUS.CONFIRMED}>Đã xác nhận</Select.Option>
      <Select.Option value={DEFINE_ORDER_STATUS.DELIVERING}>Đang giao</Select.Option>
      <Select.Option value={DEFINE_ORDER_STATUS.ARRIVED}>Đã đến nơi</Select.Option>
      <Select.Option value={DEFINE_ORDER_STATUS.DONE}>Hoàn thành</Select.Option>
      <Select.Option value={DEFINE_ORDER_STATUS.CANCEL}>Hủy</Select.Option>
    </Select>
  )
}

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    width: 50,
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Mã đơn',
    key: 'code',
    dataIndex: 'code',
    align: 'center',
    render: (code: string) => <div>{code}</div>,
  },
  {
    title: 'Khách hàng',
    key: 'name',
    dataIndex: 'name',
    render: (name: string) => <div>{Format.formatString(name)}</div>,
  },
  {
    title: 'Người nhận hàng',
    key: 'customerAddress',
    dataIndex: 'customerAddress',
    align: 'center',
    render: (customerAddress: { name: string }) => (
      <div>{Format.formatString(customerAddress ? customerAddress.name : '')}</div>
    ),
  },
  {
    title: 'Cửa hàng',
    key: 'shop',
    dataIndex: 'shop',
    align: 'center',
    render: (shop: { nameShop: string }) => <div>{Format.formatString(shop ? shop.nameShop : '')}</div>,
  },
  {
    title: 'Số SP',
    key: 'totalQuantity',
    dataIndex: 'totalQuantity',
    align: 'center',
    render: (totalQuantity: number) => <div>{Format.numberWithCommas(totalQuantity)}</div>,
  },
  {
    title: 'Tổng tiền',
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    align: 'center',
    render: (totalPrice: number) => <div>{Format.numberWithCommas(totalPrice, 'đ')}</div>,
  },
  {
    title: 'TT đơn hàng',
    key: 'status',
    dataIndex: 'status',
    align: 'center',
    render: (status: number) => <div>{RenderStatusOrder(status)}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    align: 'center',
    render: (createAt: string) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
]

const TableOrderComponent = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const page: number = Number(searchParams.get('page')) || 1

  const changePage = (page: number) => {
    searchParams.set('page', page.toString())
    history.push({
      pathname: window.location.pathname,
      search: searchParams.toString(),
    })
  }

  const [loading, setLoading] = useState<boolean>(false)
  const [payload, setPayload] = useState<IPayloadOrder>({
    page: page,
    search: undefined,
    status: undefined,
    shop_id: undefined,
    startDate: undefined,
    endDate: undefined,
    limit: Config._limit,
  })

  const [total, setTotal] = useState<number>(0)
  const [listOrder, setListOrder] = useState<IDatasourceOrder[]>([])

  const getListOrder = async () => {
    setLoading(true)
    try {
      const res = await getListOrderApi({ ...payload, search: payload.search?.trim() })
      if (res.body.status) {
        setListOrder(
          res.body.data.map((value, index) => {
            return {
              ...value,
              STT: Config.getIndexTable(payload.page, index),
              key: value.id,
            }
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
    const idTimeout = setTimeout(() => {
      getListOrder()
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [payload])

  return (
    <>
      <div className={'style-box'}>
        <Row gutter={[32, 8]}>
          <Col md={5}>
            <Input
              placeholder={'Nhập mã đơn, Tên khách hàng, SĐT.'}
              allowClear={true}
              onChange={(event) => setPayload({ ...payload, search: event.target.value, page: DEFAULT_PAGE })}
            />
          </Col>
          <Col md={5}>
            <SelectShopComponent
              onSelect={(value) => setPayload({ ...payload, shop_id: value as number | undefined })}
            />
          </Col>
          <Col md={5}>
            <SelectStatusOrderComponent
              onChange={(value) => setPayload({ ...payload, status: value, page: DEFAULT_PAGE })}
            />
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
              Kết quả lọc {total}
            </Row>
          </Col>
        </Row>
      </div>

      <div className={'style-box'}>
        <TableHoc>
          <Table
            columns={columns}
            loading={loading}
            dataSource={listOrder}
            onRow={(record: IDatasourceOrder) => {
              return {
                onClick: () => {
                  history.push(ADMIN_ROUTER.ORDER_DETAIL.path + `?index=${record.id}`)
                },
              }
            }}
            pagination={{
              onChange: (page) => {
                setPayload({ ...payload, page: page })
                changePage(page)
              },
              total: total,
              current: payload.page,
            }}
          />
        </TableHoc>
      </div>
    </>
  )
}

const Order = () => {
  return (
    <div>
      <PageHeader title={'Đơn hàng'} />
      <TableOrderComponent />
    </div>
  )
}

export default Order
