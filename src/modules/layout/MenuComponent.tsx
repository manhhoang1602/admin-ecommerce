import React from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import Icon from '../../commons/icon/Icon'
import { ADMIN_ROUTER } from '../../router/AdminRouter'
import { ENTERPRISE_ROUTER } from '../../router/EnterpriseRouter'

interface ISingleMenu {
  key: string
  value: string
  path: string
  icon?: React.ReactNode
}

interface ISubMenu {
  key: string
  value: string
  icon?: React.ReactNode
  listChild: ISingleMenu[]
}

interface IGroupItem {
  key: string
  title: string
  listChild: ISingleMenu[]
}

interface IGroupMenu {
  key: string
  value: string
  icon?: React.ReactNode
  listChild: IGroupItem[]
}

interface IDataMenu {
  type: 'SINGLE_MENU' | 'SUB_MENU' | 'GROUP_MENU'
  item: ISingleMenu | ISubMenu | IGroupMenu
}

export const dataMenuAdmin: IDataMenu[] = [
  {
    type: 'SINGLE_MENU',
    item: {
      key: ADMIN_ROUTER.DASHBOARD.path,
      path: ADMIN_ROUTER.DASHBOARD.path,
      value: 'Tổng quan',
      icon: Icon.MENU_ICON.DASHBOARD,
    } as ISingleMenu,
  },
  {
    type: 'SINGLE_MENU',
    item: {
      key: ADMIN_ROUTER.CUSTOMER.path,
      path: ADMIN_ROUTER.CUSTOMER.path,
      value: 'Khách hàng',
      icon: Icon.MENU_ICON.CUSTOMER,
    } as ISingleMenu,
  },
  {
    type: 'SUB_MENU',
    item: {
      key: 'product',
      value: 'Sản phẩm',
      icon: Icon.MENU_ICON.PRODUCT,
      listChild: [
        {
          key: ADMIN_ROUTER.PRODUCT_LIST.path,
          path: ADMIN_ROUTER.PRODUCT_LIST.path,
          value: 'Sản phẩm',
        },
        {
          key: ADMIN_ROUTER.CATEGORY.path,
          path: ADMIN_ROUTER.CATEGORY.path,
          value: 'Danh mục sản phẩm',
        },
        {
          key: ADMIN_ROUTER.COMBO.path,
          path: ADMIN_ROUTER.COMBO.path,
          value: 'Combo sản phẩm',
        },
        {
          key: ADMIN_ROUTER.PRODUCT_PROMOTION.path,
          path: ADMIN_ROUTER.PRODUCT_PROMOTION.path,
          value: 'Sản phẩm khuyến mãi',
        },
      ],
    } as ISubMenu,
  },
  {
    type: 'SUB_MENU',
    item: {
      key: 'shop',
      value: 'Cửa hàng',
      icon: Icon.MENU_ICON.SHOP,
      listChild: [
        {
          key: ADMIN_ROUTER.SHOP.path,
          path: ADMIN_ROUTER.SHOP.path,
          value: 'Danh sách cửa hàng',
        },
        {
          key: ADMIN_ROUTER.APPROVE_MENU.path,
          path: ADMIN_ROUTER.APPROVE_MENU.path,
          value: 'Phê duyệt menu CH',
        },
        {
          key: ADMIN_ROUTER.PARTNER_REQUEST.path,
          path: ADMIN_ROUTER.PARTNER_REQUEST.path,
          value: 'Yêu cầu TT Đối tác',
        },
      ],
    } as ISubMenu,
  },
  {
    type: 'SINGLE_MENU',
    item: {
      key: ADMIN_ROUTER.DRIVER.path,
      path: ADMIN_ROUTER.DRIVER.path,
      value: 'Tài xế',
      icon: Icon.MENU_ICON.DRIVER,
    } as ISingleMenu,
  },
  {
    type: 'SINGLE_MENU',
    item: {
      key: ADMIN_ROUTER.ORDER.path,
      path: ADMIN_ROUTER.ORDER.path,
      value: 'Đơn hàng',
      icon: Icon.MENU_ICON.ORDER,
    } as ISingleMenu,
  },
  {
    type: 'SUB_MENU',
    item: {
      key: 'voucher',
      value: 'Voucher khuyến mãi',
      icon: Icon.MENU_ICON.VOUCHER,
      listChild: [
        {
          key: ADMIN_ROUTER.VOUCHER_SYSTEM.path,
          path: ADMIN_ROUTER.VOUCHER_SYSTEM.path,
          value: 'Voucher hệ thống',
        },
        {
          key: ADMIN_ROUTER.VOUCHER_SHOP.path,
          path: ADMIN_ROUTER.VOUCHER_SHOP.path,
          value: 'Voucher cửa hàng',
        },
        {
          key: ADMIN_ROUTER.APPROVE_VOUCHER.path,
          path: ADMIN_ROUTER.APPROVE_VOUCHER.path,
          value: 'Phê duyệt voucher',
        },
      ],
    },
  },
  {
    type: 'SINGLE_MENU',
    item: {
      key: ADMIN_ROUTER.BANNER.path,
      path: ADMIN_ROUTER.BANNER.path,
      value: 'Banner, bài viết',
      icon: Icon.MENU_ICON.BANNER,
    } as ISingleMenu,
  },
  {
    type: 'SINGLE_MENU',
    item: {
      key: ADMIN_ROUTER.NOTIFICATION.path,
      path: ADMIN_ROUTER.NOTIFICATION.path,
      value: 'Gửi thông báo',
      icon: Icon.MENU_ICON.NOTIFICATION,
    } as ISingleMenu,
  },
  {
    type: 'SUB_MENU',
    item: {
      key: 'report',
      value: 'Báo cáo',
      icon: Icon.MENU_ICON.REPOST,
      listChild: [
        {
          key: ADMIN_ROUTER.REPORT_REVENUE.path,
          path: ADMIN_ROUTER.REPORT_REVENUE.path,
          value: 'Báo cáo bán hàng',
        },
        {
          key: ADMIN_ROUTER.REPORT_SHOP.path,
          path: ADMIN_ROUTER.REPORT_SHOP.path,
          value: 'Báo cáo cửa hàng',
        },
      ],
    },
  },
  {
    type: 'SINGLE_MENU',
    item: {
      key: ADMIN_ROUTER.CONFIG.path,
      path: ADMIN_ROUTER.CONFIG.path,
      value: 'Cấu hình',
      icon: Icon.MENU_ICON.CONFIG,
    } as ISingleMenu,
  },
  {
    type: 'SINGLE_MENU',
    item: {
      key: ADMIN_ROUTER.ACCOUNT_LIST.path,
      path: ADMIN_ROUTER.ACCOUNT_LIST.path,
      value: 'Tài khoản',
      icon: Icon.MENU_ICON.ACCOUNT,
    } as ISingleMenu,
  },
]

export const dataMenuEnterPrise: IDataMenu[] = [
  {
    type: 'SINGLE_MENU',
    item: {
      key: '001',
      path: ENTERPRISE_ROUTER.DASHBOARD.path,
      value: 'Tổng Quan',
      icon: Icon.MENU_ICON.DASHBOARD,
    } as ISingleMenu,
  },
]

const MenuComponent: React.FC<{ data: IDataMenu[] }> = ({ data }) => {
  const openKey = (dataMenu: IDataMenu[]): { openKey: string; key: string } => {
    const { pathname } = window.location
    let result: { openKey: string; key: string } = { openKey: '', key: '' }

    dataMenu.forEach((value) => {
      const itemSingle = value.item as ISingleMenu
      const itemSub = value.item as ISubMenu
      const itemGroup = value.item as IGroupMenu

      const getResult = (item: ISingleMenu): boolean => {
        if (item.path.split('?')[0].split('/')[1] === pathname.split('/')[1]) {
          result.key = item.key
          return true
        }
        return false
      }

      if (value.type === 'SINGLE_MENU') {
        if (getResult(itemSingle)) result.openKey = itemSingle.key
      } else if (value.type === 'SUB_MENU') {
        itemSub.listChild.forEach((value1) => {
          if (getResult(value1)) result.openKey = itemSub.key
        })
      } else {
        itemGroup.listChild.forEach((value1) => {
          let check: boolean = false
          value1.listChild.forEach((value2) => {
            if (getResult(value2)) check = true
          })
          if (check) result.openKey = itemGroup.key
        })
      }
    })
    return result
  }

  const renderMenuItem = (value: IDataMenu): React.ReactNode => {
    const itemSingle: ISingleMenu = value.item as ISingleMenu
    const itemSubMenu: ISubMenu = value.item as ISubMenu
    const itemGroup: IGroupMenu = value.item as IGroupMenu

    const renderItemSingleMenu = (item: ISingleMenu): React.ReactNode => {
      return (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.path}>{item.value}</Link>
        </Menu.Item>
      )
    }

    if (value.type === 'SINGLE_MENU') return renderItemSingleMenu(itemSingle)
    else if (value.type === 'SUB_MENU')
      return (
        <Menu.SubMenu key={itemSubMenu.key} icon={itemSubMenu.icon} title={itemSubMenu.value}>
          {itemSubMenu.listChild.map((value1) => renderItemSingleMenu(value1))}
        </Menu.SubMenu>
      )
    else
      return (
        <Menu.SubMenu key={itemGroup.key} icon={itemGroup.icon} title={itemGroup.value}>
          {itemGroup.listChild.map((value1) => {
            return (
              <Menu.ItemGroup key={value1.key} title={value1.title}>
                {value1.listChild.map((value2) => renderItemSingleMenu(value2))}
              </Menu.ItemGroup>
            )
          })}
        </Menu.SubMenu>
      )
  }

  return (
    <div className={'menu'}>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={[openKey(data).key]}
        defaultOpenKeys={[openKey(data).openKey]}
      >
        {data.map((value) => renderMenuItem(value))}
      </Menu>
    </div>
  )
}

export default MenuComponent
