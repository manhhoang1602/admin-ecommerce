import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Form, Input, PageHeader, Spin, Table } from 'antd'
import history from '../../../services/history'
import TableHoc from '../../../commons/HOC/TableHOC'
import { IColumn } from '../../../services/Interfaces'
import ModalListProductComponent, { IDataSourceProductAddPackage } from './ModalListProductComponent'
import { Format } from '../../../services/Format'
import { IReqPackageProduct } from '../ConfigInterface'
import Icon from '../../../commons/icon/Icon'
import { Notification } from '../../../commons/notification/Notification'
import { getDetailPackageProductApi, postPackageProductApi, putPackageProductApi } from '../ConfigApi'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'
import { useForm } from 'antd/es/form/Form'

const AddUpdatePackageProduct = () => {
  const deleteProduct = (key: any) => {
    let newListProduct = listProductInPackage.filter((value) => value.key !== key)
    setListProductInPackage(
      newListProduct.map((value, index) => {
        return { ...value, STT: index + 1 }
      })
    )
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
    {
      title: '',
      key: 'option',
      dataIndex: 'option',
      align: 'center',
      render: (option: { key: any }) => (
        <div style={{ fontSize: 18, color: 'red' }} onClick={(event) => deleteProduct(option.key)}>
          {Icon.BUTTON.DELETE}
        </div>
      ),
    },
  ]

  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index'))

  const modal = useRef<Function>()
  const openModal = () => {
    modal.current && modal.current()
  }

  const [loading, setLoading] = useState({
    getData: false,
    submit: false,
  })
  const [listProductInPackage, setListProductInPackage] = useState<IDataSourceProductAddPackage[]>([])

  const [form] = useForm()

  const onSubmit = async (values: { name: string; note: string }) => {
    try {
      const validate = (): { isValidity: boolean; msg: string } => {
        let rs = {
          isValidity: true,
          msg: '',
        }
        if (listProductInPackage.length === 0) {
          rs = {
            isValidity: false,
            msg: 'Vui lòng chọn sản phẩm.',
          }
        }
        return rs
      }
      if (validate().isValidity) {
        setLoading({ ...loading, submit: true })
        const reqData: IReqPackageProduct = {
          name: values.name,
          node: values.note,
          list_id: listProductInPackage.map((value) => {
            return {
              id: value.id,
              type: value.type,
              uiud: value.uiud,
            }
          }),
        }
        if (id) {
          const res = await putPackageProductApi(id, reqData)
          if (res.body.status) {
            Notification.PushNotification('SUCCESS', 'Sửa gói sản phẩm thành công')
            setTimeout(() => {
              history.push(ADMIN_ROUTER.CONFIG.path + `?tab=tab3`)
            }, 1000)
          }
        } else {
          const res = await postPackageProductApi(reqData)
          if (res.body.status) {
            Notification.PushNotification('SUCCESS', 'Thêm mới gói sản phẩm thành công')
            setTimeout(() => {
              history.push(ADMIN_ROUTER.CONFIG.path + `?tab=tab3`)
            }, 1000)
          }
        }
      } else {
        Notification.PushNotification('ERROR', validate().msg)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, submit: false })
    }
  }

  const getDetail = async () => {
    try {
      setLoading({ ...loading, getData: true })
      const res = await getDetailPackageProductApi(id)
      if (res.body.status) {
        form.setFieldsValue({
          name: res.body.data.name,
          note: res.body.data.node,
        })
        setListProductInPackage(
          res.body.data.packetProducts.map((value, index) => {
            return {
              id: value.id,
              STT: index + 1,
              key: value.product.uiud,
              uiud: value.product.uiud,
              unit: value.product.unit.name,
              option: { key: value.product.uiud },
              type: value.product.type,
              name: value.product.name,
              price: value.product.price,
              categoryName: value.product.category.name,
              categoryId: value.product.category.id,
              unitId: value.product.unit.id,
            }
          })
        )
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getData: false })
    }
  }

  useEffect(() => {
    if (id) {
      getDetail()
    }
  }, [id])

  return (
    <Spin spinning={loading.getData}>
      <PageHeader
        title={id ? 'Sửa gói sản phẩm.' : 'Thêm mới gói sản phẩm.'}
        onBack={() => history.goBack()}
        extra={[
          <Button key={'cancel'} type={'primary'} danger onClick={(event) => history.goBack()}>
            Hủy
          </Button>,
          <Button type={'primary'} onClick={(event) => form.submit()} loading={loading.submit}>
            Lưu
          </Button>,
        ]}
      />
      <div className={'style-box'}>
        <Card title={'Thông tin chung'} bordered={false}>
          <Form layout={'vertical'} onFinish={onSubmit} form={form}>
            <Form.Item
              label={'Tên gói'}
              name={'name'}
              rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập tên gói.' }]}
            >
              <Input placeholder={'Nhập tên gói.'} />
            </Form.Item>
            <Form.Item label={'Ghi chú'} name={'note'}>
              <Input placeholder={'Nhập ghi chú.'} />
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div className={'style-box'}>
        <Card
          title={'Thông tin sản phẩm thuộc gói'}
          bordered={false}
          extra={
            <Button type={'primary'} onClick={openModal}>
              Thêm sản phẩm
            </Button>
          }
        >
          <TableHoc>
            <Table columns={columns} dataSource={listProductInPackage} />
          </TableHoc>
        </Card>
      </div>

      <ModalListProductComponent
        title={'Thêm sản phẩm thuộc gói sản phẩm.'}
        modal={(modal1) => (modal.current = modal1)}
        onSave={(data) =>
          setListProductInPackage(
            data.map((value, index) => {
              return { ...value, STT: index + 1 }
            })
          )
        }
        defaultSelect={listProductInPackage}
      />
    </Spin>
  )
}

export default AddUpdatePackageProduct
