import React, { useEffect, useRef, useState } from 'react'
import { Affix, Button, Modal, PageHeader, Tabs } from 'antd'
import Config from '../../../services/Config'
import InfoShop from './component/InfoShop'
import { deleteShopApi, getDetailShopApi, putStatusShopApi } from '../ShopApi'
import { IResDataDetailShop } from '../ShopInterfaces'
import { Notification } from '../../../commons/notification/Notification'
import history from '../../../services/history'
import { ADMIN_ROUTER } from '../../../router/AdminRouter'
import { DEFINE_STATUS_SHOP } from '../Shop'
import { Moment } from '../../../services/Moment'
import AddUpdateShop from '../component/AddUpdateShop'
import { renderId } from '../../config/component/Attribute'
import AddProductToShop from './component/AddProductToShop'
import OrderComponent from './component/OrderComponent'

const ShopDetail = () => {
  const [loading, setLoading] = useState({
    delete: false,
    changeStatus: false,
    detail: false,
  })
  const params = new URLSearchParams(window.location.search)
  const id: number = Number(params.get('index'))
  const tab: string = params.get('tab') as string

  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [detailShop, setDetailShop] = useState<IResDataDetailShop>()
  const [currentTab, setCurrentTab] = useState<string>(tab)

  const openModalUpdate = useRef<Function>()

  const getFormData = () => {
    if (detailShop) {
      return {
        nameShop: detailShop.nameShop,
        name: detailShop.name,
        phone: detailShop.phone,
        status: detailShop.status,
        email: detailShop.email,
        taxCode: detailShop.taxCode,
        address: detailShop.address,
        provinceId: detailShop.provinceId,
        districtId: detailShop.districtId,
        wardId: detailShop.wardId,
      }
    }
  }

  const onOpenModalUpdate = () => {
    openModalUpdate.current && openModalUpdate.current(getFormData())
  }

  const deleteShop = async () => {
    try {
      Modal.confirm({
        title: 'Bạn có muốn xóa của hàng này ra khỏi hệ thống không?',
        okText: 'Xác nhận',
        onOk: async () => {
          setLoading({ ...loading, delete: true })
          const res = await deleteShopApi(id)
          if (res.body.status === Config._statusSuccessCallAPI) {
            Notification.PushNotification('SUCCESS', 'Xóa cửa hàng thành công.')
            setTimeout(() => {
              history.push(ADMIN_ROUTER.SHOP.path)
            }, 100)
          }
        },
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, delete: false })
    }
  }

  const changeStatus = async () => {
    try {
      setLoading({ ...loading, changeStatus: true })
      const res = await putStatusShopApi(
        id,
        detailShop?.status === DEFINE_STATUS_SHOP.ACTIVE ? DEFINE_STATUS_SHOP.INACTIVE : DEFINE_STATUS_SHOP.ACTIVE
      )
      if (res.body.status === Config._statusSuccessCallAPI) {
        Notification.PushNotification(
          'SUCCESS',
          detailShop?.status === DEFINE_STATUS_SHOP.ACTIVE
            ? `Cửa hàng ${detailShop?.nameShop} đã ngưng hoạt động`
            : `Cửa hàng ${detailShop?.nameShop} đã hoạt động`
        )
        getDetailShop()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, changeStatus: false })
    }
  }

  const getDetailShop = async () => {
    try {
      setLoading({ ...loading, detail: true })
      const res = await getDetailShopApi(id, page)
      if (res.body.status === Config._statusSuccessCallAPI) {
        setDetailShop(res.body.data)
        setTotal(res.body.data.reviewTotal)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, detail: false })
    }
  }

  useEffect(() => {
    getDetailShop()
  }, [])

  useEffect(() => {
    setCurrentTab(tab)
  }, [tab])

  return (
    <div>
      <Affix offsetTop={Config._offsetTopAffix}>
        <PageHeader
          title={'Chi tiết cửa hàng.'}
          onBack={() => history.goBack()}
          extra={[
            <Button onClick={deleteShop} type={'primary'} danger loading={loading.delete}>
              Xóa
            </Button>,
            <Button
              type={'primary'}
              key={renderId()}
              loading={loading.changeStatus}
              onClick={changeStatus}
              className={detailShop?.status === DEFINE_STATUS_SHOP.ACTIVE ? '' : 'btn-secondary'}
            >
              {detailShop?.status === DEFINE_STATUS_SHOP.ACTIVE ? 'Ngưng hoạt động' : 'Hoạt động'}
            </Button>,
            <Button key={renderId()} className={'btn-warning'} onClick={onOpenModalUpdate}>
              Chỉnh sửa
            </Button>,
          ]}
        />
      </Affix>

      <div style={{ padding: '0 8px 0 8px' }}>
        <Tabs
          type={'card'}
          activeKey={currentTab}
          size={'large'}
          onChange={(tab) => {
            params.set('tab', tab)
            history.push({
              pathname: window.location.pathname,
              search: params.toString(),
            })
          }}
        >
          <Tabs.TabPane key={'tab1'} tab={'Thông tin cửa hàng'}>
            <InfoShop
              detailShop={detailShop}
              loading={loading.detail}
              onPageChange={(page1) => setPage(page1)}
              totalReview={total}
              listReviewShop={
                detailShop
                  ? detailShop.reviews.map((value, index) => {
                      return {
                        key: value.id,
                        STT: Config.getIndexTable(page, index),
                        name: value.customer.name,
                        phone: value.customer.phone,
                        star: value.star,
                        createAt: Moment.getDate(value.createAt, 'DD/MM/YYYY'),
                      }
                    })
                  : []
              }
            />
          </Tabs.TabPane>
          <Tabs.TabPane key={'tab2'} tab={'Sản phẩm'}>
            <AddProductToShop />
          </Tabs.TabPane>
          <Tabs.TabPane key={'tab3'} tab={'Đơn hàng'}>
            <OrderComponent />
          </Tabs.TabPane>
        </Tabs>
      </div>

      <AddUpdateShop
        type={'UPDATE'}
        callApiSuccess={() => getDetailShop()}
        onOpenModal={(fn) => (openModalUpdate.current = fn)}
        defaultData={
          detailShop
            ? {
                nameShop: detailShop.nameShop,
                name: detailShop.name,
                phone: detailShop.phone,
                status: detailShop.status,
                email: detailShop.email,
                taxCode: detailShop.taxCode,
                address: detailShop.address,
                provinceId: detailShop.provinceId,
                districtId: detailShop.districtId,
                wardId: detailShop.wardId,
                lat: Number(detailShop.lat),
                long: Number(detailShop.long),
                address_google: detailShop.addressGoogle,
              }
            : undefined
        }
        id={id}
      />
    </div>
  )
}

export default ShopDetail
