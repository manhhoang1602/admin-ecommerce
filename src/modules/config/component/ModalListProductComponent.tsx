import React, { useEffect, useState } from 'react'
import ModalHoc from '../../../commons/HOC/ModalHOC'
import { Col, Input, Modal, Row, Table } from 'antd'
import SelectCategoryComponent from '../../category/component/SelectCategoryComponent'
import { DEFAULT_PAGE } from '../../Constances'
import { getListProductAddPackageApi } from '../ConfigApi'
import { IColumn } from '../../../services/Interfaces'
import { Format } from '../../../services/Format'
import { IResDataProductAddPackage } from '../ConfigInterface'
import Config from '../../../services/Config'
import TableHoc from '../../../commons/HOC/TableHOC'

interface IProps {
  title?: string
  modal?: (modal: Function) => {}
  onSave?: (data: IDataSourceProductAddPackage[]) => any
  defaultSelect?: IDataSourceProductAddPackage[]
}

export interface IDataSourceProductAddPackage extends IResDataProductAddPackage {
  STT: number
  key: any
  option: { key: any }
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
    title: 'Tên món',
    key: 'name',
    dataIndex: 'name',
    render: (name: string) => <div>{name}</div>,
  },
  {
    title: 'Đơn vị tính',
    key: 'unit',
    dataIndex: 'unit',
    align: 'center',
    render: (unit: string) => <div>{unit}</div>,
  },
  {
    title: 'Danh mục',
    key: 'categoryName',
    dataIndex: 'categoryName',
    align: 'center',
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

const ModalListProductComponent: React.FC<IProps> = ({ modal, defaultSelect, onSave, title }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [arg, setArg] = useState({
    page: DEFAULT_PAGE,
    search: '',
    categoryId: 0,
  })

  const [visible, setVisible] = useState<boolean>(false)
  const openModal = () => {
    setVisible(true)
  }
  const closeModal = () => {
    setVisible(false)
  }

  const [listProduct, setListProduct] = useState<IDataSourceProductAddPackage[]>([])
  const [total, setTotal] = useState<number>(0)

  const [selectedRows, setSelectedRows] = useState<IDataSourceProductAddPackage[]>([])

  const getListProduct = async () => {
    try {
      setLoading(true)
      const res = await getListProductAddPackageApi(arg)
      if (res.body.data) {
        setListProduct(
          res.body.data.map((value, index) => {
            return {
              ...value,
              STT: Config.getIndexTable(arg.page, index),
              key: value.uiud,
              option: { key: value.uiud },
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
      getListProduct()
    }, 500)
    return () => clearTimeout(idTimeout)
  }, [arg])

  useEffect(() => {
    modal && modal(openModal)
  })

  useEffect(() => {
    defaultSelect && setSelectedRows(defaultSelect)
  }, [defaultSelect])

  return (
    <ModalHoc>
      <Modal
        title={title}
        width={'80vw'}
        visible={visible}
        onCancel={closeModal}
        onOk={(e) => {
          onSave && onSave(selectedRows)
          closeModal()
        }}
      >
        <div className={'style-box'}>
          <Row gutter={[32, 4]}>
            <Col md={10}>
              <Input
                placeholder={'Tên món'}
                onChange={(event) => setArg({ ...arg, search: event.target.value, page: DEFAULT_PAGE })}
              />
            </Col>
            <Col md={10}>
              <SelectCategoryComponent
                onSelected={(value) => setArg({ ...arg, categoryId: value, page: DEFAULT_PAGE })}
              />
            </Col>
            <Col md={4}>
              <Row justify={'end'} style={{ marginTop: 5 }}>
                Kết quả lọc {total}
              </Row>
            </Col>
          </Row>
        </div>

        <div className={'style-box'}>
          <TableHoc
            isRowSelection={true}
            defaultSelection={selectedRows}
            onChangeSelect={(data) => setSelectedRows(data as IDataSourceProductAddPackage[])}
          >
            <Table
              columns={columns}
              loading={loading}
              dataSource={listProduct}
              pagination={{ onChange: (page) => setArg({ ...arg, page: page }), total: total }}
            />
          </TableHoc>
        </div>
      </Modal>
    </ModalHoc>
  )
}

export default ModalListProductComponent
