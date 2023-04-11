import React, { useEffect, useRef, useState } from 'react'
import Config from '../../services/Config'
import { Affix, Button, Col, DatePicker, Input, PageHeader, Row, Select, Table, Tag } from 'antd'
import RangePickerHoc from '../../commons/HOC/RangePickerHOC'
import { IColumn } from '../../services/Interfaces'
import { getListShopApi } from './ShopApi'
import TableHoc from '../../commons/HOC/TableHOC'
import { IResDataListShop } from './ShopInterfaces'
import { Moment } from '../../services/Moment'
import AddUpdateShop from './component/AddUpdateShop'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'
import { DEFAULT_PAGE } from '../Constances'
import { Format } from '../../services/Format'

export interface IDataSourceShop extends IResDataListShop {
  key: number
  STT: number
}

export const DEFINE_STATUS_SHOP = {
  INACTIVE: 0, // Ngưng hoạt động
  ACTIVE: 1, // Hoạt động
  ALL: 2, // Tất cả
}

export const RenderStatusShop = (status: number) => {
  if (status === DEFINE_STATUS_SHOP.INACTIVE) {
    return <Tag color={'gray'}>Ngưng hoạt động</Tag>
  }
  if (status === DEFINE_STATUS_SHOP.ACTIVE) {
    return <Tag color={'green'}>Đang hoạt động</Tag>
  }
}

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
    title: 'Tên cửa hàng',
    key: 'nameShop',
    dataIndex: 'nameShop',
    render: (nameShop: string) => <div>{nameShop}</div>,
  },
  {
    title: 'Số điện thoại',
    key: 'phone',
    dataIndex: 'phone',
    render: (phone: string) => <div>{phone}</div>,
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
    render: (email: string) => <div>{email}</div>,
  },
  {
    title: 'Tên người đại diện',
    key: 'name',
    dataIndex: 'name',
    render: (name: string) => <div>{Format.formatString(name)}</div>,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: (status: number) => <div>{RenderStatusShop(status)}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    render: (createAt: string) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
]
const Shop = () => {
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [isFixed, setIsFixed] = useState<boolean>(false)
  const [arg, setArg] = useState({
    page: 1,
    status: DEFINE_STATUS_SHOP.ALL,
    search: '',
    startDate: '',
    endDate: '',
  })
  const [listShop, setListShop] = useState<IDataSourceShop[]>([])

  const openModalAdd = useRef<Function>()

  const onOpenModalAdd = () => {
    openModalAdd.current && openModalAdd.current()
  }

  const getListShop = async () => {
    try {
      setLoading(true)
      const res = await getListShopApi(arg.page, arg.status, arg.search, arg.startDate, arg.endDate)
      if (res.body.status === Config._statusSuccessCallAPI) {
        setListShop(
          res.body.data.map((value, index) => {
            return {
              ...value,
              key: value.id,
              STT: Config.getIndexTable(arg.page, index),
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
    let id = setTimeout(() => {
      getListShop()
    }, 500)
    return () => clearTimeout(id)
  }, [arg])

  return (
    <div>
      <PageHeader
        title={'Danh sách cửa hàng'}
        extra={
          <Button type={'primary'} onClick={onOpenModalAdd}>
            Thêm mới
          </Button>
        }
      />

      <Affix offsetTop={Config._offsetTopAffix} onChange={(affixed) => setIsFixed(affixed as boolean)}>
        <div className={'style-box'}>
          <Row gutter={[32, 4]}>
            <Col lg={7}>
              <Input
                placeholder={'Tên công ty, SĐT, mã số thuế.'}
                allowClear={true}
                onChange={(event) => setArg({ ...arg, search: event.target.value, page: DEFAULT_PAGE })}
              />
            </Col>
            <Col lg={7}>
              <Select
                placeholder={'Trạng thái'}
                style={{ width: '100%' }}
                allowClear={true}
                onChange={(value) => {
                  setArg({
                    ...arg,
                    status: value !== undefined ? Number(value) : DEFINE_STATUS_SHOP.ALL,
                    page: DEFAULT_PAGE,
                  })
                }}
              >
                <Select.Option value={DEFINE_STATUS_SHOP.ALL}>Tất cả</Select.Option>
                <Select.Option value={DEFINE_STATUS_SHOP.INACTIVE}>Ngưng hoạt động</Select.Option>
                <Select.Option value={DEFINE_STATUS_SHOP.ACTIVE}>Đang hoạt động</Select.Option>
              </Select>
            </Col>
            <Col lg={7}>
              <RangePickerHoc
                disableDate={'FEATURE'}
                onChange={(stringDate) => {
                  setArg({ ...arg, startDate: stringDate[0], endDate: stringDate[1], page: DEFAULT_PAGE })
                }}
              >
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </RangePickerHoc>
            </Col>
            <Col lg={3}>
              <div className={`d-flex justify-content-end align-item-center`} style={{ height: '100%', width: '100%' }}>
                {isFixed ? (
                  <Button type={'primary'} onClick={onOpenModalAdd}>
                    Thêm mới
                  </Button>
                ) : (
                  <div>Kết quả lọc: {total}</div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Affix>

      <div className={'style-box'}>
        <TableHoc>
          <Table
            columns={columns}
            loading={loading}
            dataSource={listShop}
            onRow={(record) => {
              return {
                onClick: () => {
                  history.push(ADMIN_ROUTER.SHOP_DETAIL.path + `?index=${record.key}&tab=tab1`)
                },
              }
            }}
            pagination={{ onChange: (page) => setArg({ ...arg, page: page }), total: total }}
          />
        </TableHoc>
      </div>

      <AddUpdateShop
        type={'ADD'}
        callApiSuccess={() => getListShop()}
        onOpenModal={(fn) => (openModalAdd.current = fn)}
      />
    </div>
  )
}

export default Shop
