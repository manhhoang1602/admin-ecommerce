import React, { useEffect, useState } from 'react'
import { Col, DatePicker, Input, Row, Table } from 'antd'
import RangePickerHoc from '../../../../commons/HOC/RangePickerHOC'
import TableHoc from '../../../../commons/HOC/TableHOC'
import { IColumn } from '../../../../services/Interfaces'
import { IPayloadOrderShop, IResDataOrderShop } from '../../ShopInterfaces'
import { DEFAULT_PAGE } from '../../../Constances'
import Config from '../../../../services/Config'
import { getListOrderShopApi } from '../../ShopApi'
import { RenderStatusOrder, SelectStatusOrderComponent } from '../../../order/Order'
import { Moment } from '../../../../services/Moment'
import Icon from '../../../../commons/icon/Icon'
import history from '../../../../services/history'
import { ADMIN_ROUTER } from '../../../../router/AdminRouter'

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Mã đơn',
    key: 'code',
    dataIndex: 'code',
    render: (code: string) => <div>{code}</div>,
  },
  {
    title: 'Khách hàng',
    key: 'customerName',
    dataIndex: 'customerName',
    render: (customerName: string) => <div>{customerName}</div>,
  },
  {
    title: 'Số điện thoại',
    key: 'customerPhone',
    dataIndex: 'customerPhone',
    render: (customerPhone: string) => <div>{customerPhone}</div>,
  },
  {
    title: 'Số SP',
    key: 'countProduct',
    dataIndex: 'countProduct',
    render: (countProduct) => <div>{countProduct}</div>,
  },
  {
    title: 'Tổng tiền',
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    render: (totalPrice: number) => <div>{totalPrice}</div>,
  },
  {
    title: 'Trạng thái đơn hàng',
    key: 'status',
    dataIndex: 'status',
    render: (status: number) => <div>{RenderStatusOrder(status)}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    render: (createAt: string) => <div>{Moment.getDate(createAt, 'HH:mm DD/MM/YYYY')}</div>,
  },
  {
    title: 'Chi tiết',
    key: 'id',
    dataIndex: 'id',
    align: 'center',
    render: (id: number) => (
      <div onClick={(event) => history.push(ADMIN_ROUTER.ORDER_DETAIL.path + `?index=${id}`)}>{Icon.DETAIL}</div>
    ),
  },
]

const OrderComponent = () => {
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index'))

  const [loading, setLoading] = useState<boolean>(false)
  const [listOrder, setListOrder] = useState<IResDataOrderShop[]>([])
  const [total, setTotal] = useState<number>(0)
  const [payload, setPayload] = useState<IPayloadOrderShop>({
    page: DEFAULT_PAGE,
    limit: Config._limit,
  })

  const getListOrder = async () => {
    try {
      setLoading(true)
      const res = await getListOrderShopApi(id, { ...payload, search: payload.search?.trim() })
      if (res.body.status) {
        setListOrder(res.body.data)
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
    <div>
      <div className={'style-box'} style={{ margin: '8px 0px' }}>
        <Row gutter={[32, 8]}>
          <Col md={7}>
            <Input
              placeholder={'Nhập mã đơn, Tên, SĐT khách hàng'}
              allowClear={true}
              onChange={(event) => setPayload({ ...payload, search: event.target.value, page: DEFAULT_PAGE })}
            />
          </Col>
          <Col md={7}>
            <SelectStatusOrderComponent
              onChange={(value) => setPayload({ ...payload, status: value, page: DEFAULT_PAGE })}
            />
          </Col>
          <Col md={7}>
            <RangePickerHoc
              onChange={(stringDate) => setPayload({ ...payload, startDate: stringDate[0], endDate: stringDate[1] })}
            >
              <DatePicker.RangePicker />
            </RangePickerHoc>
          </Col>
          <Col md={3}>
            <Row justify={'end'} style={{ marginTop: 5 }}>
              Kết quả lọc {total}
            </Row>
          </Col>
        </Row>
      </div>

      <div className={'style-box'} style={{ margin: '8px 0px' }}>
        <TableHoc>
          <Table
            columns={columns}
            loading={loading}
            dataSource={listOrder.map((value, index) => {
              return { ...value, STT: Config.getIndexTable(payload.page, index), key: value.id }
            })}
          />
        </TableHoc>
      </div>
    </div>
  )
}

export default OrderComponent
