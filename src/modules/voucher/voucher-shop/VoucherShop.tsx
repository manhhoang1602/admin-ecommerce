import React, { useEffect, useState } from 'react'
import { Button, Col, DatePicker, Input, PageHeader, Row } from 'antd'
import SelectShopComponent from '../../shop/component/SelectShopComponent'
import { DEFINE_VOUCHER_DISCOUNT_TYPE, SelectVoucherDiscount } from '../approve-voucher/ApproveVoucher'
import RangePickerHoc from '../../../commons/HOC/RangePickerHOC'
import TableHoc from '../../../commons/HOC/TableHOC'
import { Table } from 'antd/es'
import { IColumn } from '../../../services/Interfaces'
import { getListVoucherShopApi } from './VoucherShopApi'
import { IPayloadVoucherShop, IResDataVoucherShop } from './VoucherShopInterface'
import { DEFAULT_PAGE } from '../../Constances'
import Config from '../../../services/Config'
import { Format } from '../../../services/Format'
import { Moment } from '../../../services/Moment'
import history from '../../../services/history'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'

interface IDatasourceVoucherShop extends IResDataVoucherShop {
  key: number
  STT: number
}

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Mã voucher',
    key: 'code',
    dataIndex: 'code',
    render: (code: string) => <div>{code}</div>,
  },
  {
    title: 'Tên voucher',
    key: 'name',
    dataIndex: 'name',
    render: (name: string) => <div>{name}</div>,
  },
  {
    title: 'Cửa hàng',
    key: 'nameShop',
    dataIndex: 'nameShop',
    align: 'center',
    render: (nameShop: string) => <div>{Format.formatString(nameShop)}</div>,
  },
  {
    title: 'Mức giảm',
    key: 'discountValue',
    dataIndex: 'discountValue',
    align: 'center',
    render: (discountValue: number, row: IResDataVoucherShop) => (
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
    render: (minPriceOrder: number) => <div>{Format.numberWithCommas(minPriceOrder, 'đ')}</div>,
  },
  {
    title: 'Số lượng còn lại',
    key: 'remainQuantity',
    dataIndex: 'remainQuantity',
    align: 'center',
    render: (remainQuantity) => <div>{Format.numberWithCommas(remainQuantity)}</div>,
  },
  {
    title: 'Số lượng quy định',
    key: 'quantity',
    dataIndex: 'quantity',
    align: 'center',
    render: (quantity: number) => <div>{quantity}</div>,
  },
  {
    title: 'Ngày bắt đầu',
    key: 'startDate',
    dataIndex: 'startDate',
    render: (startDate: string) => <div>{Moment.getDate(startDate, 'DD/MM/YYYY')}</div>,
  },
  {
    title: 'Ngày kết thúc',
    key: 'endDate',
    dataIndex: 'endDate',
    render: (endDate: string) => <div>{Moment.getDate(endDate, 'DD/MM/YYYY')}</div>,
  },
]

const VoucherShop = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [payload, setPayload] = useState<IPayloadVoucherShop>({
    page: DEFAULT_PAGE,
    search: undefined,
    endDate: undefined,
    startDate: undefined,
    limit: Config._limit,
    shop_id: undefined,
    discount_type: undefined,
  })
  const [listVoucherShop, setListVoucherShop] = useState<IDatasourceVoucherShop[]>([])
  const [total, setTotal] = useState<number>(0)

  const getListVoucherShop = async () => {
    try {
      setLoading(true)
      const res = await getListVoucherShopApi(payload)
      if (res.body.status) {
        setListVoucherShop(
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
      getListVoucherShop()
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [payload])

  return (
    <div>
      <PageHeader
        title={`Danh sách voucher cửa hàng`}
        extra={
          <Button type={'primary'} onClick={(event) => history.push(ADMIN_ROUTER.VOUCHER_SHOP_ADD_UPDATE.path)}>
            Thêm mới
          </Button>
        }
      />

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
              onSelect={(value) => setPayload({ ...payload, shop_id: value as number | undefined, page: DEFAULT_PAGE })}
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
                setPayload({ ...payload, startDate: stringDate[0], endDate: stringDate[1], page: DEFAULT_PAGE })
              }
            >
              <DatePicker.RangePicker placeholder={['Ngày bắt đầu', 'Ngày kết thúc']} />
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
            onRow={(record: IResDataVoucherShop) => {
              return {
                onClick: () => history.push(ADMIN_ROUTER.VOUCHER_SHOP_DETAIL.path + `?index=${record.id}`),
              }
            }}
            loading={loading}
            dataSource={listVoucherShop}
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

export default VoucherShop
