import React, { useEffect, useState } from 'react'
import { Affix, Button, Col, Input, PageHeader, Row, Spin, Tag } from 'antd'
import SelectCategoryComponent from '../category/component/SelectCategoryComponent'
import SelectStatusComponent from '../../commons/select-status/SelectStatusComponent'
import TableHoc from '../../commons/HOC/TableHOC'
import { Table } from 'antd/es'
import { IColumn } from '../../services/Interfaces'
import { DEFAULT_PAGE, DEFINE_STATUS } from '../Constances'
import Config from '../../services/Config'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'
import { IResDataProductPromotion } from './ProductPromotionInterfaces'
import { getListProductPromotionApi } from './ProductPromotionApi'
import { Format } from '../../services/Format'
import { Moment } from '../../services/Moment'

interface IDataSourceProductPromotion extends IResDataProductPromotion {
  key: number
  STT: number
}

export const RenderTagStatusProductPromotion = (status: number) => {
  return status ? <Tag color={'green'}>Đang khuyến mãi</Tag> : <Tag color={'gray'}>Không khuyến mãi</Tag>
}

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Mã SP',
    key: 'productCode',
    dataIndex: 'productCode',
    render: (productCode: string) => <div>{productCode}</div>,
  },
  {
    title: 'Tên sản phẩm',
    key: 'productName',
    dataIndex: 'productName',
    render: (productName: string) => <div>{productName}</div>,
  },
  {
    title: 'Danh mục',
    key: 'categoryName',
    dataIndex: 'categoryName',
    render: (categoryName: string) => <div>{categoryName}</div>,
  },
  {
    title: 'Giá khuyến mãi',
    key: 'promotionPrice',
    dataIndex: 'promotionPrice',
    render: (promotionPrice: number) => <div>{Format.numberWithCommas(promotionPrice, 'đ')}</div>,
  },
  {
    title: 'Trạng thái khuyến mãi',
    key: 'status',
    dataIndex: 'status',
    render: (status: number) => <div>{RenderTagStatusProductPromotion(status)}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    render: (createAt: string) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
]

const ProductPromotion = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setToatl] = useState<number>(0)
  const [arg, setArg] = useState({
    page: DEFAULT_PAGE,
    search: '',
    category: 0,
    status: DEFINE_STATUS.ALL,
    startDate: '',
    endDate: '',
  })
  const [listProductPromotion, setListProductPromotion] = useState<IDataSourceProductPromotion[]>([])

  const getListProductPromotion = async () => {
    try {
      setLoading(true)
      const res = await getListProductPromotionApi(arg)
      if (res.body.status) {
        setListProductPromotion(
          res.body.data.map((value, index) => {
            return { ...value, key: value.id, STT: Config.getIndexTable(arg.page, index) }
          })
        )
        setToatl(res.body.paging.totalItemCount)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const idTimeOut = setTimeout(() => {
      getListProductPromotion()
    }, 500)

    return () => clearTimeout(idTimeOut)
  }, [arg])

  return (
    <Spin spinning={loading}>
      <PageHeader
        title={'Sản phẩm khuyến mãi'}
        extra={
          <Button type={'primary'} onClick={() => history.push(ADMIN_ROUTER.ADD_UPDATE_PRODUCT_PROMOTION.path)}>
            Thêm mới
          </Button>
        }
      />
      <Affix offsetTop={Config._offsetTopAffix}>
        <div className={'style-box'}>
          <Row gutter={[32, 4]}>
            <Col md={7} sm={24} xs={24}>
              <Input
                placeholder={'Tên hoặc mã sản phẩm'}
                allowClear={true}
                onChange={(event) => setArg({ ...arg, search: event.target.value, page: DEFAULT_PAGE })}
              />
            </Col>
            <Col md={7} sm={24} xs={24}>
              <SelectCategoryComponent
                onSelected={(value) => setArg({ ...arg, category: value, page: DEFAULT_PAGE })}
              />
            </Col>
            <Col md={7} sm={24} xs={24}>
              <SelectStatusComponent
                onChange={(id) => setArg({ ...arg, status: id, page: DEFAULT_PAGE })}
                text={['Đang khuyến mãi', 'Không khuyến mãi']}
              />
            </Col>
            <Col md={3} sm={24} xs={24} style={{ marginTop: 5 }}>
              <Row justify={'end'}>Kết quả lọc: {total}</Row>
            </Col>
          </Row>
        </div>
      </Affix>

      <div className={'style-box'}>
        <TableHoc>
          <Table
            columns={columns}
            dataSource={listProductPromotion}
            pagination={{ onChange: (page) => setArg({ ...arg, page: page }), total: total, current: arg.page }}
            onRow={(record) => {
              return {
                onClick: () => history.push(ADMIN_ROUTER.DETAIL_PRODUCT_PROMOTION.path + `?index=${record.key}`),
              }
            }}
          />
        </TableHoc>
      </div>
    </Spin>
  )
}

export default ProductPromotion
