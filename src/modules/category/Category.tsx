import React, { useEffect, useRef, useState } from 'react'
import { Affix, Button, Col, DatePicker, Input, PageHeader, Row, Select, Table, Tag } from 'antd'
import RangePickerHoc from '../../commons/HOC/RangePickerHOC'
import TableHoc from '../../commons/HOC/TableHOC'
import { IColumn } from '../../services/Interfaces'
import ExpandTable from './component/ExpandTable'
import AddUpdateCate from './component/AddUpdateCate'
import Config from '../../services/Config'
import { getListCateApi } from './CategoryApi'
import { Moment } from '../../services/Moment'
import { IResDataListCate } from './CategoryInterface'
import { DEFAULT_PAGE } from '../Constances'

export interface IDatasourceCate extends IResDataListCate {
  key: number
}

export const DEFINE_STATUS_CATE = {
  DISABLE: 0, // Ngưng hoạt động
  ENABLE: 1, // Đang hoạt động
  ALL: 2, // Tất cả
}

export const RenderTagStatusCate = (status: number, type: 'TAG' | 'TEXT' = 'TAG') => {
  if (status === DEFINE_STATUS_CATE.ENABLE) {
    return <Tag color={'green'}>Đang hoạt động</Tag>
  }
  if (status === DEFINE_STATUS_CATE.DISABLE) {
    return <Tag color={'gray'}>Ngưng hoạt động</Tag>
  }
}

const columns: IColumn[] = [
  {
    title: 'Tên danh mục',
    key: 'name',
    dataIndex: 'name',
    render: (name: string) => <div>{name}</div>,
  },
  {
    title: 'Thứ tự hiển thị',
    key: 'displayOrder',
    dataIndex: 'displayOrder',
    width: 200,
    render: (displayOrder: number) => <div>{displayOrder}</div>,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: (status: number) => <div>{RenderTagStatusCate(status)}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    render: (createAt: string) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
]

const Category = () => {
  const [datasource, setDatasource] = useState<IDatasourceCate[]>([])
  const [arg, setArg] = useState({
    page: 1,
    search: '',
    status: DEFINE_STATUS_CATE.ALL,
    startDate: '',
    endDate: '',
  })
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const openModalAddCate = useRef<Function>()
  const onAddCate = () => {
    openModalAddCate.current && openModalAddCate.current()
  }

  const getListCate = async () => {
    try {
      setLoading(true)
      const res = await getListCateApi(arg.page, arg.search, arg.status, arg.startDate, arg.endDate)
      if (res.body.status === Config._statusSuccessCallAPI) {
        let resDataSource: IDatasourceCate[] = res.body.data.map((value) => {
          return {
            ...value,
            key: value.id,
          }
        })
        setDatasource(resDataSource)
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
      getListCate()
    }, 500)
    return () => clearTimeout(id)
  }, [arg])

  return (
    <div>
      <PageHeader
        title={'Danh mục sản phẩm'}
        extra={
          <Button type={'primary'} onClick={onAddCate}>
            Thêm mới
          </Button>
        }
      />

      <Affix offsetTop={Config._offsetTopAffix}>
        <div className={'style-box'}>
          <Row gutter={[32, 4]} justify={'start'}>
            <Col lg={7} md={24} sm={24} xs={24}>
              <Input
                placeholder={'Nhập tên danh mục'}
                allowClear={true}
                onChange={(event: any) => setArg({ ...arg, search: event.target.value, page: DEFAULT_PAGE })}
              />
            </Col>
            <Col lg={7} md={24} sm={24} xs={24}>
              <Select
                placeholder={'Trạng thái hoạt động'}
                allowClear={true}
                style={{ width: '100%' }}
                onChange={(value) =>
                  setArg({
                    ...arg,
                    status: Number(value !== undefined ? value : DEFINE_STATUS_CATE.ALL),
                    page: DEFAULT_PAGE,
                  })
                }
              >
                <Select.Option value={DEFINE_STATUS_CATE.ALL}>Tất cả</Select.Option>
                <Select.Option value={DEFINE_STATUS_CATE.ENABLE}>Đang hoạt động</Select.Option>
                <Select.Option value={DEFINE_STATUS_CATE.DISABLE}>Ngưng hoạt động</Select.Option>
              </Select>
            </Col>
            <Col lg={7} md={24} sm={24} xs={24}>
              <RangePickerHoc
                onChange={(stringDate) =>
                  setArg({ ...arg, startDate: stringDate[0], endDate: stringDate[1], page: DEFAULT_PAGE })
                }
              >
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </RangePickerHoc>
            </Col>
            <Col lg={3} md={24} sm={24} xs={24}>
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
            loading={loading}
            columns={columns}
            dataSource={datasource}
            pagination={{ onChange: (page) => setArg({ ...arg, page: page }), total: total }}
            expandedRowRender={(record: IDatasourceCate) => (
              <ExpandTable record={record} onCallApiSuccess={() => getListCate()} />
            )}
          />
        </TableHoc>
      </div>

      <AddUpdateCate
        type={'ADD'}
        onOpenModal={(fn) => (openModalAddCate.current = fn)}
        onCallApiSuccess={() => getListCate()}
      />
    </div>
  )
}

export default React.memo(Category)
