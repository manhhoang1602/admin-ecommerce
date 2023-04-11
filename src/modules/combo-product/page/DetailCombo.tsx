import React, { useEffect, useState } from 'react'
import { Button, Card, Checkbox, Descriptions, Image, Modal, PageHeader, Space, Spin } from 'antd'
import DescriptionsItem from 'antd/es/descriptions/Item'
import TableHoc from '../../../commons/HOC/TableHOC'
import { Table } from 'antd/es'
import { IColumn } from '../../../services/Interfaces'
import history from '../../../services/history'
import { deleteComboApi, getDetailComboApi, putComboStatusApi } from '../ComboProductApi'
import { IResDataDetailCombo } from '../ComboProductInterface'
import { Notification } from '../../../commons/notification/Notification'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'
import { ButtonChangeStatus } from '../../../commons/button/Button'
import { DEFINE_STATUS } from '../../Constances'
import { Format } from '../../../services/Format'

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    width: 50,
    align: 'center',
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Tên món',
    key: 'name',
    dataIndex: 'name',
    render: (name: number) => <div>{name}</div>,
  },
  {
    title: 'Thuộc tính',
    key: 'sizeName',
    dataIndex: 'sizeName',
    render: (sizeName: string) => <div>{Format.formatString(sizeName)}</div>,
  },
  {
    title: 'Topping đi kèm',
    key: 'productComboToppings',
    dataIndex: 'productComboToppings',
    render: (productComboToppings: string) => <div>{productComboToppings}</div>,
  },
  {
    title: 'Số lượng',
    key: 'quantity',
    dataIndex: 'quantity',
    render: (quantity: number) => <div>{Format.numberWithCommas(quantity)}</div>,
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
    align: 'center',
    render: (categoryName: string) => <div>{categoryName}</div>,
  },
]

const DetailCombo = () => {
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index'))

  const [loading, setLoading] = useState({
    changeStatus: false,
    detail: false,
    delete: false,
  })

  const [detail, setDetail] = useState<IResDataDetailCombo>()

  const onChangeStatus = async () => {
    try {
      Modal.confirm({
        title: 'Bạn có chắc muốn chuyển trạng thái combo sản phẩm này',
        onOk: async () => {
          setLoading({ ...loading, changeStatus: true })
          const res = await putComboStatusApi(id, detail?.status ? DEFINE_STATUS.INACTIVE : DEFINE_STATUS.ACTIVE)
          if (res.body.status) {
            Notification.PushNotification(
              'SUCCESS',
              `Com bo ${detail?.name} đã ${detail?.status ? 'ngưng hoạt động' : 'hoạt động'}`
            )
            getDetail()
          }
        },
        okText: 'Xác nhận',
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, changeStatus: false })
    }
  }

  const onDelete = async () => {
    try {
      Modal.confirm({
        title: `Bạn có chắc muốn xóa combo ${detail?.name} không?`,
        onOk: async () => {
          setLoading({ ...loading, delete: true })
          const res = await deleteComboApi(id)
          if (res.body.status) {
            Notification.PushNotification('SUCCESS', `Xóa thành công combo ${detail?.name}`)
            history.push(ADMIN_ROUTER.COMBO.path)
          }
        },
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, delete: false })
    }
  }

  const getDetail = async () => {
    try {
      setLoading({ ...loading, detail: true })
      const res = await getDetailComboApi(id)
      if (res.body.status) {
        setDetail(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, detail: false })
    }
  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <Spin spinning={loading.detail}>
      <PageHeader
        title={`Chi tiết combo`}
        subTitle={detail?.name}
        onBack={(e) => history.goBack()}
        extra={[
          <ButtonChangeStatus
            status={detail?.status as number}
            loading={loading.changeStatus}
            onClick={() => onChangeStatus()}
            isPrimary={true}
          />,
          <Button
            className={'btn-warning'}
            onClick={() => history.push(ADMIN_ROUTER.ADD_UPDATE_COMBO.path + `?index=${id}`)}
          >
            Chỉnh sửa
          </Button>,
          <Button type={'primary'} danger={true} onClick={onDelete} loading={loading.delete}>
            Xóa
          </Button>,
        ]}
      />

      <div className={'style-box'}>
        <Card title={'Thông tin chung.'} bordered={false}>
          <Descriptions column={2}>
            <DescriptionsItem label={'Mã combo sản phẩm'}>
              {Format.formatString(detail?.code as string)}
            </DescriptionsItem>
            <DescriptionsItem label={'Tên combo sản phẩm'}>{Format.formatString(detail?.name)}</DescriptionsItem>
            <DescriptionsItem label={'Giá niêm yết'}>{Format.numberWithCommas(detail?.price, 'đ')}</DescriptionsItem>
            <DescriptionsItem label={'STT hiển thị'}>{detail?.displayOrder}</DescriptionsItem>
            <Space size={'large'}>
              <Checkbox className={'mr-16'} checked={detail?.isDisplayHome ? true : false} />
              <span>Hiển thị nổi bật trên màn home</span>
            </Space>
          </Descriptions>
          <Descriptions column={1}>
            <DescriptionsItem label={'Ảnh sản phẩm'}>
              <Space>
                {detail?.comboMedia &&
                  detail.comboMedia.map((value) => {
                    return <Image src={value.mediaUrl} height={120} width={120} />
                  })}
              </Space>
            </DescriptionsItem>
          </Descriptions>
          <Descriptions column={1}>
            <DescriptionsItem label={'Mô tả'}>
              <p dangerouslySetInnerHTML={{ __html: detail?.description as string }} />
            </DescriptionsItem>
          </Descriptions>
        </Card>
      </div>

      <div className={'style-box'}>
        <Card title={'Thông tin sản phẩm combo.'} bordered={false}>
          <TableHoc>
            <Table
              columns={columns}
              dataSource={
                detail?.productCombos
                  ? detail.productCombos.map((value, index) => {
                      return {
                        ...value,
                        key: value.id,
                        STT: index + 1,
                        name: value.byProduct.name,
                        sizeName: value.byProduct.sizeName,
                        unitName: value.byProduct.unitName,
                        categoryName: value.byProduct.categoryName,
                        productComboToppings: value.productComboToppings.map((value1, index) =>
                          Format.formatString(value1.name, undefined, !index ? '' : ',')
                        ),
                      }
                    })
                  : []
              }
              pagination={{ total: detail ? detail.productCombos.length : 0 }}
            />
          </TableHoc>
        </Card>
      </div>
    </Spin>
  )
}

export default DetailCombo
