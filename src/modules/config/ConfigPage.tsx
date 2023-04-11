import React from 'react'
import { PageHeader, Tabs } from 'antd'
import Topping from './component/Topping'
import Unit from './component/Unit'
import history from '../../services/history'
import PackageProduct from './component/PackageProduct'
import Icon from '../../commons/icon/Icon'
import ConfigSystem from './component/ConfigSystem'
import ProvinceConfig from './component/ProvinceConfig'

const ConfigPage = () => {
  const params = new URLSearchParams(window.location.search)
  const tabDefault: string = params.get('tab') as string
  return (
    <div>
      <PageHeader title={'Cấu hình'}></PageHeader>

      <div className={'style-box'}>
        <Tabs
          type={'card'}
          defaultActiveKey={tabDefault}
          onChange={(Tabs) => {
            params.set('tab', Tabs)
            history.push({
              pathname: window.location.pathname,
              search: params.toString(),
            })
          }}
        >
          <Tabs.TabPane
            key={'tab1'}
            tab={
              <span>
                <i className="fal fa-utensils mr-8" />
                <span>Quản lý topping</span>
              </span>
            }
          >
            <Topping />
          </Tabs.TabPane>
          <Tabs.TabPane
            key={'tab2'}
            tab={
              <span>
                <i className="fal fa-sliders-v mr-8" />
                <span>Tùy chọn kèm sản phẩm</span>
              </span>
            }
          >
            {/*<Attribute onAddAttribute={(fn) => console.log(fn)} />*/}
            <Unit />
            <ProvinceConfig />
          </Tabs.TabPane>
          <Tabs.TabPane
            key={'tab3'}
            tab={
              <span>
                <i className="fal fa-box-full mr-8" />
                <span>Quản lý gói sản phẩm</span>
              </span>
            }
          >
            <PackageProduct />
          </Tabs.TabPane>
          <Tabs.TabPane
            key={'tab4'}
            tab={
              <span>
                <span className={'mr-8'}>{Icon.MENU_ICON.CONFIG}</span>
                <span>Quản lý hệ thống</span>
              </span>
            }
          >
            <ConfigSystem />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default ConfigPage
