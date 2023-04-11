import React, { useEffect, useState } from 'react'
import { Button, Col, DatePicker, Input, PageHeader, Row, Table } from 'antd'
import { DEFINE_VOUCHER_DISCOUNT_TYPE, SelectVoucherDiscount } from '../approve-voucher/ApproveVoucher'
import RangePickerHoc from '../../../commons/HOC/RangePickerHOC'
import TableHoc from '../../../commons/HOC/TableHOC'
import { IColumn } from '../../../services/Interfaces'
import { Format } from '../../../services/Format'
import { Moment } from '../../../services/Moment'
import { IPayLoadVoucherSystem, IResDataVoucherSystem } from './VoucherSystemInterfaces'
import { DEFAULT_PAGE } from '../../Constances'
import Config from '../../../services/Config'
import { getListVoucherSystemApi } from './VoucherSystemApi'
import history from '../../../services/history'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'

export interface IDataSourceVoucherSystem extends IResDataVoucherSystem {
  key: number
  STT: number
}

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    render: (STT: number, row, index) => <div>{STT}</div>,
  },
  {
    title: 'Mã voucher',
    key: 'code',
    dataIndex: 'code',
    align: 'center',
    render: (code: string, row, index) => <div>{code}</div>,
  },
  {
    title: 'Tên voucher',
    key: 'name',
    dataIndex: 'name',
    render: (name: string, row, index) => <div>{name}</div>,
  },
  {
    title: 'Mức giảm',
    key: 'discountValue',
    dataIndex: 'discountValue',
    align: 'center',
    render: (discountValue: number, row, index) => (
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
    render: (minPriceOrder: number, row, index) => <div>{Format.numberWithCommas(minPriceOrder, 'đ')}</div>,
  },
  {
    title: 'Số lương còn lại',
    key: 'remainQuantity',
    dataIndex: 'remainQuantity',
    align: 'center',
    render: (remainQuantity: number, row, index) => <div>{Format.numberWithCommas(remainQuantity)}</div>,
  },
  {
    title: 'Số lương quy định',
    key: 'quantity',
    dataIndex: 'quantity',
    align: 'center',
    render: (quantity, row, index) => <div>{Format.numberWithCommas(quantity)}</div>,
  },
  {
    title: 'Ngày bắt đầu',
    key: 'startDate',
    dataIndex: 'startDate',
    align: 'center',
    render: (startDate: string, row, index) => <div>{startDate ? Moment.getDate(startDate, 'DD/MM/YYYY') : '___'}</div>,
  },
  {
    title: 'Ngày kết thúc',
    key: 'endDate',
    dataIndex: 'endDate',
    align: 'center',
    render: (endDate, row, index) => <div>{endDate ? Moment.getDate(endDate, 'DD/MM/YYYY') : '___'}</div>,
  },
]

const VoucherSystem = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [payload, setPayload] = useState<IPayLoadVoucherSystem>({
    page: DEFAULT_PAGE,
    discount_type: undefined,
    search: undefined,
    startDate: undefined,
    endDate: undefined,
    limit: Config._limit,
  })

  const [listVoucherSystem, setListVoucherSystem] = useState<IDataSourceVoucherSystem[]>([])
  const [total, setTotal] = useState<number>(0)

  const getListVoucherSystem = async () => {
    try {
      setLoading(true)
      const res = await getListVoucherSystemApi({
        ...payload,
        search: payload.search ? payload.search.trim() : undefined,
      })
      if (res.body.status) {
        setListVoucherSystem(
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
      getListVoucherSystem()
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [payload])

  return (
    <div>
      <PageHeader
        title={'Danh sách voucher hệ thống'}
        extra={
          <Button type={'primary'} onClick={(event) => history.push(ADMIN_ROUTER.ADD_UPDATE_VOUCHER_SYSTEM.path)}>
            Thêm mới
          </Button>
        }
      />

      <div className={'style-box'}>
        <Row gutter={[32, 8]}>
          <Col md={7}>
            <Input
              placeholder={'Tên, mã voucher.'}
              allowClear={true}
              onChange={(event) => setPayload({ ...payload, search: event.target.value })}
            />
          </Col>
          <Col md={7}>
            <SelectVoucherDiscount
              onSelect={(value) => setPayload({ ...payload, discount_type: value, page: DEFAULT_PAGE })}
            />
          </Col>
          <Col md={7}>
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
              <DatePicker.RangePicker placeholder={['Ngày bắt đầu', 'Ngày kết thúc']} />
            </RangePickerHoc>
          </Col>
          <Col md={3}>
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
            dataSource={listVoucherSystem}
            onRow={(record: IDataSourceVoucherSystem) => {
              return {
                onClick: () => history.push(ADMIN_ROUTER.VOUCHER_SYSTEM_DETAIL.path + `?index=${record.id}`),
              }
            }}
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

export default VoucherSystem
