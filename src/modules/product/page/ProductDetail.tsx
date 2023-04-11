import React, { useEffect, useState } from 'react'
import { Affix, Button, Card, Descriptions, Image, Modal, PageHeader, Radio, Space, Spin, Table } from 'antd'
import TableHoc from '../../../commons/HOC/TableHOC'
import { IColumn } from '../../../services/Interfaces'
import history from '../../../services/history'
import Config from '../../../services/Config'
import { IResDataDetailProduct } from '../ProductInterface'
import { changeStatusProductApi, deleteProductApi, getDetailProductApi } from '../ProductApi'
import { Format } from '../../../services/Format'
import { DEFINE_STATUS_PRODUCT, RenderStatusProduct } from '../Product'
import { RenderStatus } from '../../component/Component'
import { Notification } from '../../../commons/notification/Notification'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'
import ReactShowMoreText from 'react-show-more-text'

const columnsSize: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Thuộc tính',
    key: 'name',
    dataIndex: 'name',
    render: (name: string) => <div>{name}</div>,
  },
  {
    title: 'Giá bán',
    key: 'price',
    dataIndex: 'price',
    render: (price: number) => <div>{Format.numberWithCommas(price)}</div>,
  },
  {
    title: 'Mặc định',
    key: 'isDefault',
    dataIndex: 'isDefault',
    render: (isDefault: number) => (
      <div>
        <Radio checked={isDefault ? true : false} />
      </div>
    ),
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    align: 'center',
    render: (status: number) => <div>{RenderStatus(status)}</div>,
  },
]

const columnsProductAttach: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    width: 20,
    align: 'center',
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Tên món',
    key: 'productName',
    dataIndex: 'productName',
    render: (productName: string) => <div>{productName}</div>,
  },
  {
    title: 'Đơn vị tính',
    key: 'unitName',
    dataIndex: 'unitName',
    align: 'center',
    render: (unitName: string) => <div>{unitName}</div>,
  },
  {
    title: 'Danh mục',
    key: 'categoryName',
    dataIndex: 'categoryName',
    render: (categoryName: string) => <div>{categoryName}</div>,
  },
  {
    title: 'Giá bán',
    key: 'productPrice',
    dataIndex: 'productPrice',
    align: 'center',
    render: (productPrice: number) => <div>{Format.numberWithCommas(productPrice, 'đ')}</div>,
  },
  {
    title: 'Trạng thái size',
    key: 'status',
    dataIndex: 'status',
    align: 'center',
    render: (status: number) => <div>{RenderStatus(status)}</div>,
  },
]

const columnsTopping: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Tên topping',
    key: 'name',
    dataIndex: 'name',
    render: (name: string) => <div>{name}</div>,
  },
  {
    title: 'Giá niêm yết',
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
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    align: 'center',
    render: (status: number) => <div>{RenderStatus(status)}</div>,
  },
]

const ProductDetail = () => {
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index'))

  const [loading, setLoading] = useState({
    delete: false,
    changeStatus: false,
    getDetail: false,
  })
  const [detailProduct, setDetailProduct] = useState<IResDataDetailProduct>()

  const getDetailProduct = async () => {
    try {
      setLoading({ ...loading, getDetail: true })
      const res = await getDetailProductApi(id)
      if (res.body.status === Config._statusSuccessCallAPI) {
        setDetailProduct(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getDetail: false })
    }
  }

  const onChangeStatus = async () => {
    try {
      Modal.confirm({
        title: 'Bạn có chắc muốn chuyển trạng thái sản phẩm này',
        okText: 'Xác nhận',
        onOk: async () => {
          setLoading({ ...loading, changeStatus: true })
          const res = await changeStatusProductApi(
            id,
            detailProduct?.status ? DEFINE_STATUS_PRODUCT.INACTIVE : DEFINE_STATUS_PRODUCT.ACTIVE
          )
          if (res.body.status) {
            Notification.PushNotification(
              'SUCCESS',
              detailProduct?.status ? 'Sản phẩm đã ngưng hoạt động' : 'Sản phẩm đã hoạt động'
            )
            getDetailProduct()
          }
        },
      })
    } catch (e) {
    } finally {
      setLoading({ ...loading, changeStatus: false })
    }
  }

  const onDeleteProduct = async () => {
    const onDelete = async () => {
      setLoading({ ...loading, delete: true })
      const res = await deleteProductApi(id)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Xóa sản phẩm thành công.')
        setTimeout(() => {
          history.push(ADMIN_ROUTER.PRODUCT_LIST.path)
        }, 500)
      }
    }
    try {
      Modal.confirm({
        title: `Bạn có muốn xóa sản phẩm ${detailProduct?.name} không?`,
        onOk: onDelete,
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, delete: false })
    }
  }

  useEffect(() => {
    getDetailProduct()
  }, [])

  return (
    <Spin spinning={loading.getDetail}>
      <Affix offsetTop={Config._offsetTopAffix}>
        <PageHeader
          onBack={() => history.push(ADMIN_ROUTER.PRODUCT_LIST.path)}
          title={'Chi tiết sản phẩm'}
          subTitle={detailProduct?.name}
          extra={[
            <Button type={'primary'} danger key={'delete'} loading={loading.delete} onClick={onDeleteProduct}>
              Xóa
            </Button>,
            <Button
              type={'primary'}
              className={detailProduct?.status ? '' : 'btn-secondary'}
              key={'status'}
              onClick={onChangeStatus}
              loading={loading.changeStatus}
            >
              {detailProduct?.status ? 'Ngưng hoạt động' : 'Hoạt động'}
            </Button>,
            <Button
              type={'primary'}
              className={'btn-warning'}
              key={'edit'}
              onClick={() => history.push(ADMIN_ROUTER.PRODUCT_ADD_UPDATE.path + `?type=update&index=${id}`)}
            >
              Chỉnh sửa
            </Button>,
          ]}
        />
      </Affix>

      <div className={'style-box'}>
        <Card title={<div className={'title-card'}>Thông tin chung</div>} bordered={false}>
          <Descriptions column={2}>
            <Descriptions.Item label={'Mã sản phẩm'}>{Format.formatString(detailProduct?.code)}</Descriptions.Item>
            <Descriptions.Item label={'Tên sản phẩm'}>{Format.formatString(detailProduct?.name)}</Descriptions.Item>
            <Descriptions.Item label={'Giá niêm yết sản phẩm'}>
              {Format.numberWithCommas(detailProduct?.price, 'đ')}
            </Descriptions.Item>
            <Descriptions.Item label={'Trạng thái sản phẩm'}>
              {RenderStatusProduct(detailProduct?.status as number)}
            </Descriptions.Item>
            <Descriptions.Item label={'Danh mục'}>{Format.formatString(detailProduct?.categoryName)}</Descriptions.Item>
            <Descriptions.Item label={'Đơn vị tính'}>{Format.formatString(detailProduct?.unitName)}</Descriptions.Item>
            <Descriptions.Item label={'Cấu hình'}>
              {detailProduct && detailProduct.productAttributes.length > 0
                ? detailProduct.productAttributes.map((value, index) =>
                    Format.formatString(value.name, undefined, index ? ',' : undefined)
                  )
                : '___'}
            </Descriptions.Item>
            <Descriptions.Item label={'Mô tả'}>
              <ReactShowMoreText lines={3} more={'Xem thêm'} less={'Ẩn'} width={700}>
                <div dangerouslySetInnerHTML={{ __html: Format.formatString(detailProduct?.description) }} />
              </ReactShowMoreText>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <div className={'style-box'}>
        <Card title={<div className={'title-card'}>Thông tin hình ảnh</div>} bordered={false}>
          <Space size={'large'}>
            {detailProduct?.productMedia.map((value) => {
              return <Image src={value.mediaUrl} width={150} height={150} />
            })}
          </Space>
        </Card>
      </div>

      <div className={'style-box'}>
        <Card title={<div className={'title-card'}>Thuộc tính size sản phẩm</div>} bordered={false}>
          <TableHoc>
            <Table
              columns={columnsSize}
              dataSource={
                detailProduct &&
                detailProduct.productSizes.map((value, index) => {
                  return { ...value, key: value.name, STT: index + 1, price: value.price + detailProduct.price }
                })
              }
            />
          </TableHoc>
        </Card>
      </div>

      <div className={'style-box'}>
        <Card title={<div className={'title-card'}>Thông tin sản phẩm phụ bán cùng</div>} bordered={false}>
          <TableHoc>
            <Table
              columns={columnsProductAttach}
              dataSource={
                detailProduct &&
                detailProduct.parentProduct.map((value, index) => {
                  return {
                    key: value.id,
                    STT: index + 1,
                    productName:
                      Format.formatString(value.subProduct.name, true) +
                      Format.formatString(value.subProduct.sizeName, true, value.subProduct.name ? '/' : undefined),
                    unitName: value.subProduct.unitName,
                    categoryName: value.subProduct.categoryName,
                    productPrice: value.subProduct.price,
                    status: value.status,
                  }
                })
              }
            />
          </TableHoc>
        </Card>
      </div>

      <div className={'style-box'}>
        <Card title={<div className={'title-card'}>Thông tin topping bán kèm</div>} bordered={false}>
          <TableHoc>
            <Table
              columns={columnsTopping}
              dataSource={
                detailProduct &&
                detailProduct.productToppings.map((value, index) => {
                  return { ...value, key: value.id, STT: index + 1 }
                })
              }
              pagination={{ total: detailProduct ? detailProduct.productToppings.length : 0 }}
            />
          </TableHoc>
        </Card>
      </div>
    </Spin>
  )
}

export default ProductDetail
