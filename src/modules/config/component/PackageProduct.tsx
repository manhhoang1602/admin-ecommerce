import React, { useEffect, useState } from 'react'
import { Button, Card, Popconfirm, Row, Space, Table } from 'antd'
import TableHoc from '../../../commons/HOC/TableHOC'
import { IColumn } from '../../../services/Interfaces'
import { Format } from '../../../services/Format'
import { Moment } from '../../../services/Moment'
import { IResDataPackageProduct } from '../ConfigInterface'
import { DEFAULT_PAGE } from '../../Constances'
import { deletePackageApi, getListPackageProductApi } from '../ConfigApi'
import Config from '../../../services/Config'
import Icon from '../../../commons/icon/Icon'
import PopconfirmHoc from '../../../commons/HOC/PopconfirmHOC'
import { Notification } from '../../../commons/notification/Notification'
import history from '../../../services/history'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'

interface IDatasourcePackageProduct extends IResDataPackageProduct {
  key: any
  STT: number
  option: IResDataPackageProduct
}

const PackageProduct = () => {
  const columns: IColumn[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      align: 'center',
      width: 50,
      render: (STT: number) => <div>{STT}</div>,
    },
    {
      title: 'Tên gói',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      render: (name: string) => <div>{name}</div>,
    },
    {
      title: 'Số lượng sản phẩm trong gói',
      key: 'countProduct',
      dataIndex: 'countProduct',
      align: 'center',
      render: (countProduct: number) => <div>{Format.numberWithCommas(countProduct, 'sản phẩm')}</div>,
    },
    {
      title: 'Ngày tạo',
      key: 'createAt',
      dataIndex: 'createAt',
      align: 'center',
      render: (createAt: string) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
    },
    {
      title: '',
      key: 'option',
      dataIndex: 'option',
      align: 'center',
      render: (option: IResDataPackageProduct) => (
        <Space>
          <span
            style={{ fontSize: 18, color: 'orange' }}
            onClick={(event) => history.push(ADMIN_ROUTER.ADD_UPDATE_PACKAGE_PRODUCT.path + `?index=${option.id}`)}
          >
            {Icon.BUTTON.EDIT}
          </span>
          <PopconfirmHoc>
            <Popconfirm
              title={'Bạn có muốn xóa gói sản phẩm này không.'}
              onConfirm={(e) => deletePackageProduct(option.id, option.name)}
            >
              <span style={{ fontSize: 18, color: 'red' }}>{Icon.BUTTON.DELETE}</span>
            </Popconfirm>
          </PopconfirmHoc>
        </Space>
      ),
    },
  ]

  const [listProductPromotion, setListProductPromotion] = useState<IDatasourcePackageProduct[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [arg, setArg] = useState({
    page: DEFAULT_PAGE,
  })
  const [total, setTotal] = useState<number>(0)

  const getListProductPackage = async () => {
    try {
      setLoading(true)
      const res = await getListPackageProductApi(arg)
      if (res.body.status) {
        setListProductPromotion(
          res.body.data.map((value, index) => {
            return { ...value, key: value.id, STT: Config.getIndexTable(arg.page, index), option: value }
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

  const deletePackageProduct = async (id: number, name: string) => {
    try {
      const res = await deletePackageApi(id)
      if (res.body.status) {
        Notification.PushNotification('SUCCESS', `Xóa thành công gói sản phẩm ${name}`)
        getListProductPackage()
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getListProductPackage()
  }, [])

  return (
    <div>
      <Card
        title={'Thông tin gói sản phẩm áp dụng cho cửa hàng.'}
        extra={
          <Button type={'primary'} onClick={(event) => history.push(ADMIN_ROUTER.ADD_UPDATE_PACKAGE_PRODUCT.path)}>
            Thêm mới
          </Button>
        }
        bordered={false}
      >
        <Row justify={'start'} className={'mb-8'}>
          Kết quả lọc: {total}
        </Row>
        <TableHoc>
          <Table
            columns={columns}
            loading={loading}
            dataSource={listProductPromotion}
            pagination={{ onChange: (page) => setArg({ ...arg, page: page }), total: total }}
          />
        </TableHoc>
      </Card>
    </div>
  )
}

export default PackageProduct
