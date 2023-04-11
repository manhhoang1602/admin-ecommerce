import React, { useEffect, useState } from 'react'
import { Affix, Button, Col, DatePicker, Input, PageHeader, Row } from 'antd'
import SelectStatusComponent from '../../commons/select-status/SelectStatusComponent'
import { DEFAULT_PAGE, DEFINE_STATUS } from '../Constances'
import RangePickerHoc from '../../commons/HOC/RangePickerHOC'
import Config from '../../services/Config'
import TableHoc from '../../commons/HOC/TableHOC'
import { Table } from 'antd/es'
import { getListComboApi } from './ComboProductApi'
import { IResDataCombo } from './ComboProductInterface'
import { IColumn } from '../../services/Interfaces'
import { Format } from '../../services/Format'
import { RenderStatus } from '../component/Component'
import { Moment } from '../../services/Moment'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'

export interface IDataSourceCombo extends IResDataCombo {
  key: number
  STT: number
}

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    width: 50,
    align: 'center',
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Mã combo',
    key: 'code',
    dataIndex: 'code',
    width: 50,
    align: 'center',
    render: (code: string) => <div>{code}</div>,
  },
  {
    title: 'Tên combo',
    key: 'name',
    dataIndex: 'name',
    render: (name: string) => <div>{name}</div>,
  },
  {
    title: 'Số sản phẩm trong combo',
    key: 'totalQuantityProduct',
    dataIndex: 'totalQuantityProduct',
    render: (totalQuantityProduct: number) => <div>{totalQuantityProduct} sản phẩm</div>,
  },
  {
    title: 'Giá combo',
    key: 'price',
    dataIndex: 'price',
    align: 'center',
    render: (price: number) => <div>{Format.numberWithCommas(price, 'đ')}</div>,
  },
  {
    title: 'STT hiển thị',
    key: 'displayOrder',
    dataIndex: 'displayOrder',
    align: 'center',
    render: (displayOrder: number) => <div>{displayOrder}</div>,
  },
  {
    title: 'Trạng thái hoạt động',
    key: 'status',
    dataIndex: 'status',
    align: 'center',
    render: (status: number) => <div>{RenderStatus(status)}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    align: 'center',
    render: (createAt: string) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
]

const ComboProduct = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const [arg, setArg] = useState({
    page: DEFAULT_PAGE,
    search: '',
    status: DEFINE_STATUS.ALL,
    startDate: '',
    endDate: '',
  })
  const [listCombo, setListCombo] = useState<IDataSourceCombo[]>([])

  const getListComboProduct = async () => {
    try {
      setLoading(true)
      const res = await getListComboApi(arg)
      if (res.body.status) {
        setListCombo(
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
    const idTimeout = setTimeout(() => {
      getListComboProduct()
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [arg])

  return (
    <div>
      <PageHeader
        title={'Combo sản phẩm'}
        extra={
          <Button type={'primary'} onClick={(event) => history.push(ADMIN_ROUTER.ADD_UPDATE_COMBO.path)}>
            Thêm mới
          </Button>
        }
      />

      <Affix offsetTop={Config._offsetTopAffix}>
        <div className={'style-box'}>
          <Row gutter={[32, 4]}>
            <Col md={7} sm={24} xs={24}>
              <Input
                placeholder={'Tên hoặc mã combo sản phẩm'}
                allowClear={true}
                onChange={(event) => setArg({ ...arg, search: event.target.value, page: DEFAULT_PAGE })}
              />
            </Col>
            <Col md={7} sm={24} xs={24}>
              <SelectStatusComponent onChange={(id) => setArg({ ...arg, status: id, page: DEFAULT_PAGE })} />
            </Col>
            <Col md={7} sm={24} xs={24}>
              <RangePickerHoc
                onChange={(stringDate) =>
                  setArg({ ...arg, startDate: stringDate[0], endDate: stringDate[1], page: DEFAULT_PAGE })
                }
              >
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </RangePickerHoc>
            </Col>
            <Col md={3} sm={24} xs={24}>
              <Row justify={'end'} style={{ marginTop: 5 }}>
                Kết quả lọc: {total}
              </Row>
            </Col>
          </Row>
        </div>
      </Affix>

      <div className={'style-box'}>
        <TableHoc>
          <Table
            columns={columns}
            dataSource={listCombo}
            loading={loading}
            onRow={(record) => {
              return {
                onClick: () => history.push(ADMIN_ROUTER.COMBO_DETAIL.path + `?index=${record.id}`),
              }
            }}
            pagination={{ onChange: (page) => setArg({ ...arg, page: page }), total: total }}
          />
        </TableHoc>
      </div>
    </div>
  )
}

export default ComboProduct
