import React, { useEffect, useState } from 'react'
import ModalHoc from '../../../../commons/HOC/ModalHOC'
import { Input, Modal, Space, Table } from 'antd'
import { IColumn } from '../../../../services/Interfaces'
import { Format } from '../../../../services/Format'
import SelectCategoryComponent from '../../../category/component/SelectCategoryComponent'
import TableHoc from '../../../../commons/HOC/TableHOC'
import { getListSubProductApi } from '../../../product/ProductApi'
import Config from '../../../../services/Config'
import { DEFAULT_PAGE, DEFINE_STATUS } from '../../../Constances'
import { IDatasourceProductAttach } from '../../../product/page/add-update/component/ProductAttach'

export interface IDataSourceSubProduct extends IDatasourceProductAttach {
  STT: number
  topping: { key: number; productId: number; toppingIds: number[]; totalPriceTopping: number }
  quantity: { key: any; value: number }
}

interface IProps {
  modal: (modal: Function) => any
  defaultSelect: IDataSourceSubProduct[]
  onSave: (listSubProduct: IDataSourceSubProduct[]) => any
  title?: string
}

const columnsListProductAdd: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    width: 20,
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Tên món',
    key: 'productName',
    dataIndex: 'productName',
    render: (productName: string) => <div>{productName}</div>,
  },
  {
    title: 'Thuộc tính',
    key: 'productSizeName',
    dataIndex: 'productSizeName',
    render: (productSizeName: string) => <div>{Format.formatString(productSizeName)}</div>,
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
    key: 'price',
    dataIndex: 'price',
    align: 'center',
    render: (price: number) => <div>{Format.numberWithCommas(price, 'đ')}</div>,
  },
]

const ListProductComponent: React.FC<IProps> = ({ modal, onSave, defaultSelect, title }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)

  const openModal = () => setVisibleModal(true)
  const closeModal = () => {
    setVisibleModal(false)
    setSelectedRows(defaultSelect)
    setArg({
      page: 1,
      search: '',
      categoryId: 0,
    })
  }

  const [arg, setArg] = useState({
    page: 1,
    search: '',
    categoryId: 0,
  })

  const [listSubProduct, setListSubProduct] = useState<IDataSourceSubProduct[]>([])
  const [selectedRows, setSelectedRows] = useState<IDataSourceSubProduct[]>([])
  // const [selectedRowsKey, setSelectedRowsKey] = useState<number[]>([])

  const onAddSubProduct = () => {
    onSave && onSave(selectedRows)
    closeModal()
  }

  const getListSubProduct = async () => {
    try {
      setLoading(true)
      const res = await getListSubProductApi(arg)
      if (res.body.status === Config._statusSuccessCallAPI) {
        setListSubProduct(
          res.body.data.map((value, index) => {
            let key = value.productSize ? value.productSize.id + value.product.id : value.product.id
            return {
              STT: Config.getIndexTable(arg.page, index),
              key: key,
              option: { key: key, status: DEFINE_STATUS.ACTIVE, isDefaultData: 1 },
              id: value.id,
              productId: value.product.id,
              productSizeId: value.productSize?.id,
              productSizeName: value.productSize?.name,
              unitName: value.product.unitName,
              status: DEFINE_STATUS.ACTIVE,
              quantity: { key: key, value: 0 },
              topping: { key: key, productId: value.product.id, toppingIds: [], totalPriceTopping: 0 },
              productName: value.product.name,
              price: value.productSize ? value.productSize.price : value.product.price,
              categoryName: value.product.categoryName,
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
    const idTimeout = setTimeout(() => {
      getListSubProduct()
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [arg])

  useEffect(() => modal(openModal), [])

  useEffect(() => {
    if (defaultSelect) {
      // setSelectedRowsKey(defaultSelect.map((value) => value.key))
      setSelectedRows(defaultSelect)
    }
  }, [defaultSelect])

  return (
    <ModalHoc>
      <Modal
        title={title || 'Thêm sản phẩm phụ'}
        visible={visibleModal}
        onCancel={closeModal}
        width={'80vw'}
        onOk={onAddSubProduct}
      >
        <Space className={'mb-16'}>
          <Input
            placeholder={'Nhập tên món'}
            className={'width-200'}
            allowClear={true}
            value={arg.search}
            onChange={(event) => setArg({ ...arg, search: event.target.value, page: DEFAULT_PAGE })}
          />
          <SelectCategoryComponent
            onSelected={(value) => setArg({ ...arg, categoryId: value, page: DEFAULT_PAGE })}
            style={{ width: 200 }}
            defaultValue={arg.categoryId ? arg.categoryId : undefined}
          />
        </Space>
        <TableHoc
          isRowSelection={true}
          defaultSelection={selectedRows}
          onChangeSelect={(data) => setSelectedRows(data)}
        >
          <Table
            columns={columnsListProductAdd}
            dataSource={listSubProduct}
            loading={loading}
            pagination={{ onChange: (page) => setArg({ ...arg, page: page }), total: total }}
          />
        </TableHoc>
      </Modal>
    </ModalHoc>
  )
}

export default ListProductComponent
