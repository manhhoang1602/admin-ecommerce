import React, { useEffect, useState } from 'react'
import { Affix, Button, Col, DatePicker, Input, PageHeader, Row, Select, Table, Tag } from 'antd'
import RangePickerHoc from '../../commons/HOC/RangePickerHOC'
import TableHoc from '../../commons/HOC/TableHOC'
import { IColumn } from '../../services/Interfaces'
import Config from '../../services/Config'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'
import { Moment } from '../../services/Moment'
import { IResDataProduct } from './ProductInterface'
import { getListProductApi } from './ProductApi'
import SelectCategoryComponent from '../category/component/SelectCategoryComponent'
import { DEFAULT_PAGE } from '../Constances'

export const DEFINE_STATUS_PRODUCT = {
  INACTIVE: 0,
  ACTIVE: 1,
  ALL: 2,
}

export const RenderStatusProduct = (status: number) => {
  if (status === DEFINE_STATUS_PRODUCT.ACTIVE) {
    return <Tag color={'green'}>Đang hoạt động</Tag>
  }
  if (status === DEFINE_STATUS_PRODUCT.INACTIVE) {
    return <Tag color={'gray'}>Ngưng hoạt động</Tag>
  }
}

interface IDatasourceProduct extends IResDataProduct {
  key: number
  STT: number
}

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    width: 20,
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Mã sản phẩm',
    key: 'code',
    dataIndex: 'code',
    render: (code: string) => <div>{code}</div>,
  },
  {
    title: 'Tên sản phẩm',
    key: 'name',
    dataIndex: 'name',
    render: (name: string) => <div>{name}</div>,
  },
  {
    title: 'Danh mục',
    key: 'categoryName',
    dataIndex: 'categoryName',
    render: (categoryName: string) => <div>{categoryName}</div>,
  },
  {
    title: 'Trạng thái sản phẩm',
    key: 'status',
    dataIndex: 'status',
    render: (status: number) => <div>{RenderStatusProduct(status)}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    render: (createAt) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
]

const Product = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [listProduct, setListProduct] = useState<IDatasourceProduct[]>([])
  const [total, setTotal] = useState<number>(0)
  const [arg, setArg] = useState({
    page: DEFAULT_PAGE,
    search: '',
    categoryId: 0,
    status: DEFINE_STATUS_PRODUCT.ALL,
    startDate: '',
    endDate: '',
  })

  const getListProduct = async () => {
    try {
      setLoading(true)
      const res = await getListProductApi(arg)
      if (res.body.status === Config._statusSuccessCallAPI) {
        setListProduct(
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
    let idTimeOut = setTimeout(() => {
      getListProduct()
    }, Config._timeOutGetData)
    return () => clearTimeout(idTimeOut)
  }, [arg])

  return (
    <>
      <PageHeader
        title={'Sản phẩm'}
        extra={
          <Button type={'primary'} onClick={() => history.push(ADMIN_ROUTER.PRODUCT_ADD_UPDATE.path + '?type=add')}>
            Thêm mới
          </Button>
        }
      />
      <Affix offsetTop={Config._offsetTopAffix}>
        <div className={'style-box'}>
          <Row gutter={[32, 4]} justify={'start'}>
            <Col lg={5} md={24} sm={24} xs={24}>
              <Input
                allowClear={true}
                placeholder={'Tên hoặc mã sản phẩm.'}
                onChange={(event) => setArg({ ...arg, search: event.target.value, page: DEFAULT_PAGE })}
              />
            </Col>
            <Col lg={5} md={24} sm={24} xs={24}>
              <SelectCategoryComponent
                onSelected={(value) => setArg({ ...arg, categoryId: value, page: DEFAULT_PAGE })}
              />
            </Col>
            <Col lg={5} md={24} sm={24} xs={24}>
              <Select
                placeholder={'Trạng thái sản phẩm'}
                style={{ width: '100%' }}
                allowClear={true}
                onChange={(value) => {
                  if (value === undefined) {
                    setArg({ ...arg, status: DEFINE_STATUS_PRODUCT.ALL, page: DEFAULT_PAGE })
                  } else {
                    setArg({ ...arg, status: Number(value), page: DEFAULT_PAGE })
                  }
                }}
              >
                <Select.Option value={DEFINE_STATUS_PRODUCT.ALL}>Tất cả</Select.Option>
                <Select.Option value={DEFINE_STATUS_PRODUCT.ACTIVE}>Đang hoạt động</Select.Option>
                <Select.Option value={DEFINE_STATUS_PRODUCT.INACTIVE}>Ngưng hoạt động</Select.Option>
              </Select>
            </Col>
            <Col lg={5} md={24} sm={24} xs={24}>
              <RangePickerHoc
                disableDate={'FEATURE'}
                onChange={(stringDate) =>
                  setArg({ ...arg, startDate: stringDate[0], endDate: stringDate[1], page: DEFAULT_PAGE })
                }
              >
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </RangePickerHoc>
            </Col>
            <Col lg={4} md={24} sm={24} xs={24}>
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
            loading={loading}
            dataSource={listProduct}
            pagination={{ onChange: (page) => setArg({ ...arg, page: page }), total: total }}
            onRow={(record) => {
              return {
                onClick: () => history.push(ADMIN_ROUTER.PRODUCT_DETAIL.path + `?index=${record.key}`),
              }
            }}
          />
        </TableHoc>
      </div>
    </>
  )
}

export default Product

export const SelectProductComponent: React.FC<{
  categoryId?: number
  disabled?: boolean
  onChange?: (id: number) => any
  defaultValue?: number
}> = ({ disabled, categoryId, onChange, defaultValue }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [listProduct, setListProduct] = useState<IResDataProduct[]>([])
  const [arg, setArg] = useState({
    page: 1,
    search: '',
    categoryId: 0,
    status: DEFINE_STATUS_PRODUCT.ALL,
    startDate: '',
    endDate: '',
    isGetAll: true,
  })
  const [valueSelect, setValueSelect] = useState<number | undefined>()

  const getListProduct = async () => {
    try {
      setLoading(true)
      const res = await getListProductApi(arg)
      if (res.body.status) {
        setListProduct(res.body.data)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListProduct()
  }, [arg])

  useEffect(() => {
    if (categoryId) {
      setArg({ ...arg, categoryId: categoryId })
      setValueSelect(undefined)
    } else {
      setValueSelect(undefined)
    }
  }, [categoryId])

  useEffect(() => {
    defaultValue && setValueSelect(defaultValue)
  }, [defaultValue])

  return (
    <Select
      placeholder={'Chọn sản phẩm'}
      loading={loading}
      showSearch={true}
      filterOption={false}
      value={valueSelect}
      onSearch={(value) => setArg({ ...arg, search: value })}
      disabled={disabled}
      onChange={(value) => {
        onChange && onChange(value as number)
        setValueSelect(value)
      }}
    >
      {listProduct.map((value) => {
        return (
          <Select.Option value={value.id}>
            {value.name}_{value.categoryName}
          </Select.Option>
        )
      })}
    </Select>
  )
}
