import React, { useEffect, useState } from 'react'
import { Avatar, BackTop, Layout } from 'antd'
import { HeaderComponent } from './HeaderComponent'
import Sider from 'antd/es/layout/Sider'
import { Content, Footer } from 'antd/es/layout/layout'
import MenuComponent, { dataMenuAdmin } from './MenuComponent'
import AdminRouter from '../../router/AdminRouter'
import { getUserInfo } from '../login/LoginFN'
import Icon from '../../commons/icon/Icon'
import { io } from 'socket.io-client'
import { Notification } from '../../commons/notification/Notification'
import store from './NotificationHeaderStore'
import { DEFAULT_PAGE } from '../Constances'

const socket = io(process.env.REACT_APP_SOCKET as string)

const DEFINE_EVENT_SOCKET = {
  VOUCHER: 'new-voucher-request',
  MENU: 'new-menu-request',
  SHOP: 'new-shop-request',
}

const NotificationSocket = React.memo(() => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected')
      socket.on(DEFINE_EVENT_SOCKET.MENU, (data) => {
        Notification.PushNotification('INFO', data.msg)
        store.getListNotification({ page: DEFAULT_PAGE, limit: 12 })
      })
      socket.on(DEFINE_EVENT_SOCKET.SHOP, (data) => {
        Notification.PushNotification('INFO', data.msg)
        store.getListNotification({ page: DEFAULT_PAGE, limit: 12 })
      })
      socket.on(DEFINE_EVENT_SOCKET.VOUCHER, (data) => {
        Notification.PushNotification('INFO', data.msg)
        store.getListNotification({ page: DEFAULT_PAGE, limit: 12 })
      })
    })
  }, [])
  return <div></div>
})

const LayoutComponent = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)

  const getRouter = () => {
    return <AdminRouter />
  }

  const getMenu = () => {
    return <MenuComponent data={dataMenuAdmin} />
  }

  const handleResizeWindow = () => {
    if (document.body.clientWidth <= 1200) {
      setCollapsed(true)
    } else {
      setCollapsed(false)
    }
  }

  const RenderUserInfo = () => {
    const userInfo = getUserInfo()
    return (
      <div className={'user-info-menu'}>
        <Avatar
          style={{ border: '1px solid black' }}
          size={64}
          src={userInfo.profilePictureUrl || '/assets/img/default-avatar.png'}
        />
        <div className={'user-name'}>{userInfo.name}</div>
      </div>
    )
  }

  useEffect(() => {
    window.addEventListener('resize', handleResizeWindow)
    if (window.screen.width <= 1200) {
      setCollapsed(true)
    } else {
      setCollapsed(false)
    }
    return () => window.removeEventListener('resize', handleResizeWindow)
  }, [])

  return (
    <div className={'layout'}>
      <Layout>
        <HeaderComponent toggle={() => setCollapsed(!collapsed)} />
        <Sider width={220} trigger={null} theme={'light'} collapsible collapsed={collapsed} style={{ marginTop: 55 }}>
          {RenderUserInfo()}
          {getMenu()}
        </Sider>

        <Layout className="layout__site-layout">
          <Content className="layout__site-layout__site-layout-background">
            <div style={{ minHeight: 'calc(100vh - 150px)' }}>{getRouter()}</div>
            <Footer style={{ textAlign: 'center' }}>
              <span style={{ color: 'green', fontWeight: 'bold', fontSize: 15 }}>Zoco</span> ©2021{' '}
            </Footer>
          </Content>
          <BackTop>
            <div
              style={{
                fontSize: 24,
                color: 'white ',
                borderRadius: '50%',
                backgroundColor: 'gray',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 45,
                width: 45,
              }}
            >
              {Icon.BACK_TOP}
            </div>
          </BackTop>
        </Layout>
      </Layout>
      <NotificationSocket />
    </div>
  )
}

export default LayoutComponent
