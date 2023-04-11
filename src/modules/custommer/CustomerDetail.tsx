import React, { useState } from 'react'
import { Button, PageHeader, Tabs } from 'antd'
import DetailInfo from './component/DetailInfo'
import store from './CustomerStore'
import { observer } from 'mobx-react'
import ListOrder from './component/ListOrder'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'

const CustomerDetail = observer(() => {
  const searchParams = new URLSearchParams(window.location.search)
  const id: number = Number(searchParams.get('index') as string)
  const defaultTab = searchParams.get('tabs')

  const [key, setKey] = useState<string>(defaultTab || 'tab1')

  const onChangeTabs = (key: any) => {
    setKey(key)
    searchParams.set('tabs', key)
    history.push({
      pathname: window.location.pathname,
      search: searchParams.toString(),
    })
  }

  return (
    <div>
      <PageHeader
        title={'Chi tiết khách hàng'}
        onBack={(e) => history.push(ADMIN_ROUTER.CUSTOMER.path)}
        extra={
          !store.detailCustomer?.status ? (
            <Button className={'btn-secondary'} type={'primary'} onClick={(event) => store.changeStatus(id)}>
              Hoạt động
            </Button>
          ) : (
            <Button type={'primary'} onClick={(event) => store.changeStatus(id)}>
              Ngưng hoạt động
            </Button>
          )
        }
      />

      <div className={'style-box'}>
        <Tabs type={'card'} size={'large'} activeKey={key} onChange={onChangeTabs}>
          <Tabs.TabPane tab={'Thông tin cá nhân'} key={'tab1'}>
            <DetailInfo />
          </Tabs.TabPane>
          <Tabs.TabPane tab={'Danh sách đơn hàng'} key={'tab2'}>
            <ListOrder />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
})

export default CustomerDetail
