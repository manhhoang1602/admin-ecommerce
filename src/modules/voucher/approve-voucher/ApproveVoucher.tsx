import React, { useEffect, useState } from 'react'
import { Col, DatePicker, Input, PageHeader, Row, Select, Table, Tag } from 'antd'
import RangePickerHoc from '../../../commons/HOC/RangePickerHOC'
import TableHoc from '../../../commons/HOC/TableHOC'
import { IColumn } from '../../../services/Interfaces'
import { IReqPayloadVoucherRequest, IResDataVoucherRequest } from './ApproveVoucherInterfaces'
import { DEFAULT_PAGE } from '../../Constances'
import { getListVoucherRequestApi } from './ApproveVoucherApi'
import Config from '../../../services/Config'
import { Format } from '../../../services/Format'
import { Moment } from '../../../services/Moment'
import SelectShopComponent from '../../shop/component/SelectShopComponent'
import ExpandTable from './componets/ExpandTable'

export interface IDatasourceApproveVoucher extends IResDataVoucherRequest {
  STT: number
  key: number
}

export const DEFINE_VOUCHER_DISCOUNT_TYPE = {
  PERCENT: 1, // giảm giá theo theo phần trăm
  MONEY: 2, //  giảm giá theo theo số tiền
}

export const SelectVoucherDiscount = (props: {
  onSelect?: (value: number | undefined) => any
  defaultValue?: number
}) => {
  const { onSelect, defaultValue } = props

  const [value, setValue] = useState<number | undefined>()

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <Select
      value={value}
      optionFilterProp={'children'}
      placeholder={'Loại giảm'}
      allowClear={true}
      onChange={(value) => {
        onSelect && onSelect(value as number)
        setValue(value)
      }}
    >
      <Select.Option value={DEFINE_VOUCHER_DISCOUNT_TYPE.PERCENT}>Giảm giá theo phần trăm</Select.Option>
      <Select.Option value={DEFINE_VOUCHER_DISCOUNT_TYPE.MONEY}>Giảm giá theo số tiền</Select.Option>
    </Select>
  )
}

export const RenderTagTypeVoucherDiscount = (type: number) => {
  if (type === DEFINE_VOUCHER_DISCOUNT_TYPE.MONEY) return <Tag color={'purple'}>Giảm giá theo số tiền</Tag>
  if (type === DEFINE_VOUCHER_DISCOUNT_TYPE.PERCENT) return <Tag color={'blue'}>Giảm giá theo phần trăm</Tag>
}

export const DEFINE_VOUCHER_STATUS = {
  INACTIVE_ADMIN: 0, // ngừng hoạt động admin
  ACTIVE: 1, // hoạt động
  PENDING: 2, //  chờ duyệt
  REFUSE: 3, //  từ chối
  INACTIVE_SHOP: 3, //  ngừng hoạt động shop
}

const RenderStatusApproveVoucher = (status: number) => {
  if (status === DEFINE_VOUCHER_STATUS.PENDING) {
    return <Tag color={'orange'}>Chờ duyệt</Tag>
  }
  if (status === DEFINE_VOUCHER_STATUS.REFUSE) {
    return <Tag color={'red'}>Từ chối</Tag>
  }
}

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    render: (STT, row, index) => <div>{STT}</div>,
  },
  {
    title: 'Mã voucher',
    key: 'code',
    dataIndex: 'code',
    align: 'center',
    render: (code, row, index) => <div>{code}</div>,
  },
  {
    title: 'Tên voucher',
    key: 'name',
    dataIndex: 'name',
    render: (name, row, index) => <div>{name}</div>,
  },
  {
    title: 'Cửa hàng',
    key: 'nameShop',
    dataIndex: 'nameShop',
    render: (nameShop, row, index) => <div>{nameShop}</div>,
  },
  {
    title: 'Mức giảm',
    key: 'discountValue',
    dataIndex: 'discountValue',
    align: 'center',
    render: (discountValue, row, index) => (
      <div>
        {Format.numberWithCommas(discountValue, row.discountType === DEFINE_VOUCHER_DISCOUNT_TYPE.MONEY ? 'đ' : '%')}
      </div>
    ),
  },
  {
    title: 'Giá trị đơn hàng tối thiểu',
    key: 'minPriceOrder',
    dataIndex: 'minPriceOrder',
    align: 'center',
    render: (minPriceOrder, row, index) => <div>{Format.numberWithCommas(minPriceOrder, 'đ')}</div>,
  },
  {
    title: 'Số lượng quy định',
    key: 'quantity',
    dataIndex: 'quantity',
    align: 'center',
    render: (quantity, row, index) => <div>{quantity}</div>,
  },
  {
    title: 'Ngày bắt đầu',
    key: 'startDate',
    dataIndex: 'startDate',
    align: 'center',
    render: (startDate, row, index) => <div>{startDate ? Moment.getDate(startDate, 'DD/MM/YYYY') : '___'}</div>,
  },
  {
    title: 'Ngày kết thúc',
    key: 'endDate',
    dataIndex: 'endDate',
    align: 'center',
    render: (endDate, row, index) => <div>{endDate ? Moment.getDate(endDate, 'DD/MM/YYYY') : '___'}</div>,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    align: 'center',
    render: (status, row, index) => <div>{RenderStatusApproveVoucher(status)}</div>,
  },
]

const ApproveVoucher = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [payload, setPayload] = useState<IReqPayloadVoucherRequest>({
    page: DEFAULT_PAGE,
    discount_type: undefined,
    search: null,
    shop_id: undefined,
    startDate: null,
    endDate: null,
    limit: Config._limit,
  })

  const [total, setTotal] = useState<number>(0)
  const [listApproveVoucher, setListApproveVoucher] = useState<IDatasourceApproveVoucher[]>([])

  const getListApproveVoucher = async () => {
    try {
      setLoading(true)
      const res = await getListVoucherRequestApi({
        ...payload,
        search: payload.search ? payload.search.trim() : null,
      })
      if (res.body.status) {
        setListApproveVoucher(
          res.body.data.map((value, index) => {
            return { ...value, STT: Config.getIndexTable(payload.page, index), key: value.id }
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
      getListApproveVoucher()
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [payload])

  return (
    <div>
      <PageHeader title={'Phê duyệt voucher'} />
      <div className={'style-box'}>
        <Row gutter={[32, 8]}>
          <Col md={5}>
            <Input
              placeholder={'Tên, mã voucher.'}
              allowClear={true}
              onChange={(event) => setPayload({ ...payload, search: event.target.value, page: DEFAULT_PAGE })}
            />
          </Col>
          <Col md={5}>
            <SelectShopComponent
              onSelect={(value) => {
                setPayload({ ...payload, shop_id: value as number | undefined, page: DEFAULT_PAGE })
              }}
            />
          </Col>
          <Col md={5}>
            <SelectVoucherDiscount
              onSelect={(value) => setPayload({ ...payload, discount_type: value, page: DEFAULT_PAGE })}
            />
          </Col>
          <Col md={5}>
            <RangePickerHoc
              onChange={(stringDate) =>
                setPayload({
                  ...payload,
                  startDate: stringDate[0] ? stringDate[0] : null,
                  endDate: stringDate[1] ? stringDate[1] : null,
                })
              }
            >
              <DatePicker.RangePicker />
            </RangePickerHoc>
          </Col>
          <Col md={4}>
            <Row justify={'end'} style={{ marginTop: 5 }}>
              Kết quả lọc: {total}
            </Row>
          </Col>
        </Row>
      </div>

      <div className={'style-box'}>
        <TableHoc>
          <Table
            columns={columns}
            loading={loading}
            dataSource={listApproveVoucher}
            expandedRowRender={(record) => (
              <ExpandTable record={record} onChangeStatusSuccess={() => getListApproveVoucher()} />
            )}
            pagination={{
              onChange: (page) => setPayload({ ...payload, page: page }),
              total: total,
              current: payload.page,
            }}
          />
        </TableHoc>
      </div>
    </div>
  )
}

export default ApproveVoucher
