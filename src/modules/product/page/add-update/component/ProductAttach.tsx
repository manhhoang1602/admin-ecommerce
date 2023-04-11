import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Space, Table } from 'antd'
import Icon from '../../../../../commons/icon/Icon'
import { IColumn } from '../../../../../services/Interfaces'
import TableHoc from '../../../../../commons/HOC/TableHOC'
import { Format } from '../../../../../services/Format'
import { DEFINE_STATUS } from '../../../../Constances'
import ListProductComponent, {
  IDataSourceSubProduct,
} from '../../../../combo-product/page/component/ListProductComponent'
import { splitArray } from '../../../../../services/Functions'

export interface IDatasourceProductAttach {
  key: any
  STT: number
  option: { key: any; status?: number; isDefaultData?: number }
  id: number
  productId: number
  productSizeId: number | undefined | null
  productSizeName: string | undefined | null
  unitName: string
  categoryName: string
  productName: string
  price: number
  status: number
}

const ProductAttach: React.FC<{
  onChange: (data: IDatasourceProductAttach[]) => any
  defaultData?: IDatasourceProductAttach[]
}> = ({ onChange, defaultData }) => {
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
      render: (productSizeName: string) => <div>{productSizeName}</div>,
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

  const modalListSubProduct = useRef<Function>()
  const openModalSubProduct = () => {
    modalListSubProduct.current && modalListSubProduct.current()
  }

  const [listSubProductSelected, setListSubProductSelected] = useState<IDatasourceProductAttach[]>([])

  const deleteSubProduct = (key: any) => {
    try {
      const newListSubProductSelected = listSubProductSelected.filter((value) => value.key !== key)
      setListSubProductSelected(newListSubProductSelected)
    } catch (e) {
      console.error(e)
    }
  }

  const changeStatusSubProduct = (key: any, status: number) => {
    try {
      setListSubProductSelected(
        listSubProductSelected.map((value) => {
          if (value.key === key) {
            return {
              ...value,
              status: status,
              option: { ...value.option, status: status },
            }
          } else return value
        })
      )
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    onChange(listSubProductSelected)
  }, [listSubProductSelected])

  useEffect(() => {
    if (defaultData) {
      setListSubProductSelected(defaultData)
    }
  }, [defaultData])

  return (
    <div className={'style-box'}>
      <Card
        bordered={false}
        extra={[
          <Button key={'addProduct'} type={'primary'} icon={Icon.BUTTON.ADD} onClick={openModalSubProduct}>
            Thêm sản phẩm
          </Button>,
        ]}
        title={<div className={'title-card'}>Thông tin sản phẩm bán cùng</div>}
      >
        <TableHoc>
          <Table
            columns={[
              ...columnsListProductAdd,
              {
                title: '',
                key: 'option',
                dataIndex: 'option',
                width: 120,
                align: 'center',
                render: (option: { key: number; status: number }) => (
                  <div>
                    <Space>
                      <span
                        style={{ fontSize: 10 }}
                        onClick={() =>
                          changeStatusSubProduct(
                            option.key,
                            option.status ? DEFINE_STATUS.INACTIVE : DEFINE_STATUS.ACTIVE
                          )
                        }
                      >
                        {option.status ? Icon.BUTTON.ENABLE : Icon.BUTTON.DISABLE}
                      </span>
                      <span style={{ fontSize: 18, color: 'red' }} onClick={() => deleteSubProduct(option.key)}>
                        {Icon.BUTTON.DELETE}
                      </span>
                    </Space>
                  </div>
                ),
              },
            ]}
            dataSource={listSubProductSelected}
          />
        </TableHoc>
      </Card>
      <ListProductComponent
        modal={(modal) => (modalListSubProduct.current = modal)}
        defaultSelect={listSubProductSelected as IDataSourceSubProduct[]}
        onSave={(listSubProduct) => {
          let splitSubProduct = splitArray(listSubProduct, listSubProductSelected, 'key', 'defaultArray')
          setListSubProductSelected(splitSubProduct.mergeArray.concat(splitSubProduct.newArray) as any)
        }}
      />
    </div>
  )
}

export default React.memo(ProductAttach)
