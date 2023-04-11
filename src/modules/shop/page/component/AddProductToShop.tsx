import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Empty, Input, Modal, Popconfirm, Row, Space, Table } from 'antd'
import SelectCategoryComponent from '../../../category/component/SelectCategoryComponent'
import SelectStatusComponent from '../../../../commons/select-status/SelectStatusComponent'
import Icon from '../../../../commons/icon/Icon'
import TableHoc from '../../../../commons/HOC/TableHOC'
import ModalHoc from '../../../../commons/HOC/ModalHOC'
import TransferTableComponent from '../../../../commons/transfer-table-antd/TransferTableComponent'
import { IColumn } from '../../../../services/Interfaces'
import { Format } from '../../../../services/Format'
import {
  deleteProductOfShopApi,
  getDetailPackageProductApi,
  getListProductInShopApi,
  getListProductInShopDetailPageApi,
  getListProductNotInShopApi,
  postProductInShopApi,
} from '../../ShopApi'
import { IResDataProductOfShop } from '../../ShopInterfaces'
import { Notification } from '../../../../commons/notification/Notification'
import { DEFAULT_PAGE, DEFINE_STATUS } from '../../../Constances'
import { RenderStatus } from '../../../component/Component'
import history from '../../../../services/history'
import { ADMIN_ROUTER } from '../../../../router/AdminRouter'
import PopconfirmHoc from '../../../../commons/HOC/PopconfirmHOC'
import SelectProductPackage from './SelectProductPackage'
import { splitArray } from '../../../../services/Functions'

interface IDataSourceListProductInShop {
  key: number
  STT: number
  code: string
  name: string
  category: string
  status: number
  detail: { idProduct: number }
  option: { idRow: number }
}

const AddProductToShop = () => {
  const columns: IColumn[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      align: 'center',
      width: 40,
      render: (STT: number) => <div>{STT}</div>,
    },
    {
      title: 'Mã sản phẩm',
      key: 'code',
      dataIndex: 'code',
      align: 'center',
      render: (code: string) => <div>{Format.formatString(code)}</div>,
    },
    {
      title: 'Tên sản phẩm',
      key: 'name',
      dataIndex: 'name',
      render: (name: string) => <div>{name}</div>,
    },
    {
      title: 'Danh mục',
      key: 'category',
      dataIndex: 'category',
      render: (category: string) => <div>{category}</div>,
    },
    {
      title: 'Trạng thái hoạt động',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (status: number) => <div>{RenderStatus(status)}</div>,
    },
    {
      title: 'Chi tiết',
      key: 'detail',
      dataIndex: 'detail',
      align: 'center',
      width: 80,
      render: (detail: { idProduct: number }, row) => (
        <div
          onClick={() => {
            if (row.code) {
              history.push(ADMIN_ROUTER.PRODUCT_DETAIL.path + `?index=${detail.idProduct}`)
            } else {
              history.push(ADMIN_ROUTER.COMBO_DETAIL.path + `?index=${detail.idProduct}`)
            }
          }}
          style={{ fontSize: 16 }}
        >
          {Icon.DETAIL}
        </div>
      ),
    },
    {
      title: 'Xóa',
      key: 'option',
      dataIndex: 'option',
      align: 'center',
      width: 100,
      render: (option: { idRow: number }) => (
        <PopconfirmHoc>
          <Popconfirm
            title={'Bạn có chắc là muốn xóa sản phẩm này khỏi của hàng.'}
            onConfirm={(e) => deleteProductsOfShop([option.idRow])}
          >
            <div style={{ fontSize: 18, color: 'red' }}>{Icon.BUTTON.DELETE}</div>
          </Popconfirm>
        </PopconfirmHoc>
      ),
    },
  ]
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index') as string)

  const modal = useRef<Function>()
  const openModal = () => {
    modal.current && modal.current()
  }

  const [loading, setLoading] = useState({
    delete: false,
    getList: false,
  })
  const [arg, setArg] = useState({
    page: DEFAULT_PAGE,
    search: '',
    categoryId: 0,
    status: DEFINE_STATUS.ALL,
  })

  const [listProductInShop, setListProductInShop] = useState<IDataSourceListProductInShop[]>([])
  const [total, setTotal] = useState<number>(0)

  const [selectedRows, setSelectedRows] = useState<IDataSourceProductInShop[]>([])

  const getListProductInShop = async () => {
    try {
      setLoading({ ...loading, getList: true })
      const res = await getListProductInShopDetailPageApi(id, arg)
      if (res.body.status) {
        setListProductInShop(
          res.body.data.map((value, index) => {
            if (value.product) {
              return {
                STT: index + 1,
                key: value.id,
                category: value.product.category.name,
                code: value.product.code,
                name: value.product.name,
                status: value.product.status,
                detail: { idProduct: value.product.id },
                option: { idRow: value.id },
              }
            } else {
              return {
                STT: index + 1,
                key: value.id,
                category: value.combo.categoryName,
                code: '',
                name: value.combo.name,
                status: 1,
                detail: { idProduct: value.combo.id },
                option: { idRow: value.id },
              }
            }
          })
        )
        setTotal(res.body.paging.totalItemCount)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getList: false })
    }
  }

  const deleteProductsOfShop = async (productIds: number[]) => {
    try {
      setLoading({ ...loading, delete: true })
      const res = await deleteProductOfShopApi(id, productIds)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', `Sản phẩm đã được xóa khỏi cửa hàng.`)
        getListProductInShop()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, delete: false })
    }
  }

  useEffect(() => {
    const idTimeOut = setTimeout(() => {
      getListProductInShop()
    }, 500)
    return () => clearTimeout(idTimeOut)
  }, [arg])

  return (
    <div className={'style-box'} style={{ margin: '8px 0px' }}>
      <Row gutter={[16, 4]}>
        <Col md={8}>
          <Input
            placeholder={'Tên hoặc mã sản phẩm.'}
            allowClear={true}
            onChange={(event) => setArg({ ...arg, search: event.target.value, page: DEFAULT_PAGE })}
          />
        </Col>
        <Col md={8}>
          <SelectCategoryComponent onSelected={(value) => setArg({ ...arg, categoryId: value })} />
        </Col>
        <Col md={8}>
          <SelectStatusComponent onChange={(id) => setArg({ ...arg, status: id, page: DEFAULT_PAGE })} />
        </Col>
      </Row>
      <Row gutter={[16, 4]} className={'mt-8'} justify={'space-between'}>
        <Col md={12}>Kết quả lọc: {total}</Col>
        <Col md={12}>
          <Row justify={'end'} style={{ marginTop: 5 }}>
            <Space>
              <Button
                icon={Icon.BUTTON.MINUS}
                type={'primary'}
                disabled={selectedRows.length === 0 ? true : false}
                danger={true}
                onClick={() => {
                  Modal.confirm({
                    title: 'Bạn có chắc muốn xóa các sản phẩm đã chọn ra khỏi cửa hàng.',
                    okText: 'Xác nhận',
                    onOk: () => {
                      deleteProductsOfShop(selectedRows.map((value) => value.key))
                    },
                  })
                }}
              >
                Xóa
              </Button>
              <Button type={'primary'} icon={Icon.BUTTON.ADD} onClick={openModal}>
                Thêm sản phẩm
              </Button>
            </Space>
          </Row>
        </Col>
      </Row>

      <div className={'mt-8'}>
        <TableHoc isRowSelection={true} onChangeSelect={(data) => setSelectedRows(data)}>
          <Table
            loading={loading.getList}
            columns={columns}
            dataSource={listProductInShop}
            pagination={{ onChange: (page) => setArg({ ...arg, page: page }), total: total, current: arg.page }}
            locale={{
              emptyText: (
                <Empty
                  description={'Không có sản phẩm nào trong cửa hàng.'}
                  image={<span style={{ fontSize: 70 }}>{Icon.BAG}</span>}
                />
              ),
            }}
          />
        </TableHoc>
      </div>

      <ModalAdd modal={(modal1) => (modal.current = modal1)} onSave={getListProductInShop} />
    </div>
  )
}

export default AddProductToShop

interface IDataSourceProductInShop extends IResDataProductOfShop {
  key: any
}

const ModalAdd: React.FC<{ onSave?: () => any; modal?: (modal: Function) => any }> = ({ modal, onSave }) => {
  const columns: IColumn[] = [
    {
      title: 'Tên món',
      key: 'name',
      dataIndex: 'name',
      render: (name: string) => <div>{name}</div>,
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

  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index') as string)

  const [visible, setVisible] = useState<boolean>(false)
  const openModal = () => {
    setVisible(true)
    getListProductOfShop()
  }
  const closeModal = () => {
    setListProductInPackage(undefined)
    setVisible(false)
  }

  const [loading, setLoading] = useState({
    getListProductOfShop: false,
    submit: false,
  })

  const [listProductOfShop, setListProductOfShop] = useState<IDataSourceProductInShop[]>([])
  const [listProductKeyInShop, setListProductKeyInShop] = useState<any[]>([])
  const [listProductInPackage, setListProductInPackage] = useState<IDataSourceProductInShop[] | undefined>(undefined)

  const getListProductOfShop = async () => {
    try {
      setLoading({ ...loading, getListProductOfShop: true })
      const resProductNotIn = await getListProductNotInShopApi(id)
      const resProductIn = await getListProductInShopApi(id)
      if (resProductNotIn.body.status && resProductIn.body.status) {
        const listProductNotInShop = resProductNotIn.body.data.map((value) => {
          return { ...value, key: value.uiud }
        })
        const listProductInShop: IDataSourceProductInShop[] = resProductIn.body.data.map((value) => {
          if (value.product) {
            return {
              id: value.product.id,
              key: value.product.uiud,
              productId: value.productId,
              categoryId: value.product.category.id,
              type: value.product.type,
              uiud: value.product.uiud,
              name: value.product.name,
              categoryName: value.product.category.name,
              price: value.product.price,
            }
          } else {
            return {
              id: value.combo ? value.combo.id : 0,
              key: value.combo ? value.combo.uiud : '',
              productId: value.combo ? value.combo.id : 0,
              categoryId: value.combo ? value.combo.categoryId : 0,
              type: value.combo ? value.combo.type : 0,
              uiud: value.combo ? value.combo.uiud : '',
              name: value.combo ? value.combo.name : '',
              categoryName: value.combo ? value.combo.categoryName : '',
              price: value.combo ? value.combo.price : 0,
            }
          }
        })
        setListProductOfShop(listProductNotInShop.concat(listProductInShop))
        setListProductKeyInShop(listProductInShop.map((value) => value.key))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getListProductOfShop: false })
    }
  }

  const submit = async () => {
    try {
      setLoading({ ...loading, submit: true })
      const listId = listProductOfShop.filter((value) => listProductKeyInShop.find((value1) => value1 === value.key))
      const res = await postProductInShopApi({
        shop_id: id,
        list_id: listId.map((value) => {
          return {
            id: value.id,
            type: value.type,
            uiud: value.uiud,
          }
        }),
      })
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', 'Cập nhập sản phẩm vào cửa hàng thành công.')
        setTimeout(() => {
          closeModal()
          onSave && onSave()
        }, 500)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, submit: false })
    }
  }

  const getListProductInPackage = async (id: number | undefined) => {
    try {
      if (id === undefined) {
        setListProductInPackage(undefined)
      } else {
        setLoading({ ...loading, getListProductOfShop: true })
        const res = await getDetailPackageProductApi(id)
        if (res.body.status) {
          const resListProductInPackage = res.body.data.map((value) => {
            return {
              key: value.uiud,
              productId: value.productId,
              categoryId: value.categoryId,
              name: value.name,
              price: value.price,
              uiud: value.uiud,
              id: value.id,
              type: value.type,
              categoryName: value.categoryName,
            }
          })

          const resListProductInShop = listProductOfShop.filter((itemDefaultArr) => {
            return listProductKeyInShop.find((itemInputArr) => itemDefaultArr.key === itemInputArr)
          })

          const splitArrayInShopVsInPackage = splitArray(resListProductInShop, resListProductInPackage, 'key')

          setListProductInPackage(
            splitArrayInShopVsInPackage.mergeArray
              .concat(splitArrayInShopVsInPackage.newArray)
              .concat(splitArrayInShopVsInPackage.deleteArray) as any
          )
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getListProductOfShop: false })
    }
  }

  useEffect(() => {
    modal && modal(openModal)
  }, [])

  return (
    <ModalHoc>
      <Modal
        title={'Sửa sản phẩm thuộc cửa hàng'}
        width={'80vw'}
        visible={visible}
        onCancel={closeModal}
        confirmLoading={loading.submit}
        onOk={() => {
          submit()
        }}
      >
        <TransferTableComponent
          leftColumns={columns}
          rightColumns={columns}
          loading={loading.getListProductOfShop}
          showSearch={true}
          dataSource={listProductInPackage ? listProductInPackage : (listProductOfShop as any)}
          listItemFilter={listProductInPackage}
          filterOption={(inputValue, item: any) =>
            Format.slug(item.name.toLocaleLowerCase()).indexOf(Format.slug(inputValue.toLocaleLowerCase())) !== -1 ||
            Format.slug(item.categoryName.toLocaleLowerCase()).indexOf(Format.slug(inputValue.toLocaleLowerCase())) !==
              -1
          }
          locale={{ searchPlaceholder: 'Nhập tên món, tên danh mục.' }}
          targetKeys={listProductKeyInShop}
          onChange={(targetKeys) => setListProductKeyInShop(targetKeys)}
          titles={[
            <span>
              <SelectProductPackage onSelect={(value) => getListProductInPackage(value)} />
              <span style={{ fontFamily: 'open sans-bold', fontSize: 16, color: 'rgb(24, 144, 255)' }}>Chưa chọn</span>
            </span>,
            <span style={{ fontFamily: 'open sans-bold', fontSize: 16, color: 'rgb(24, 144, 255)' }}>Đã chọn</span>,
          ]}
        />
      </Modal>
    </ModalHoc>
  )
}
