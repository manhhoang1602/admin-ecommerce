import React from 'react'
import Dashboard from '../modules/dashboad/Dashboard'
import { Route, Switch } from 'react-router-dom'
import Category from '../modules/category/Category'
import Product from '../modules/product/Product'
import ProductDetail from '../modules/product/page/ProductDetail'
import Account from '../modules/account/Account'
import ConfigPage from '../modules/config/ConfigPage'
import Shop from '../modules/shop/Shop'
import ShopDetail from '../modules/shop/page/ShopDetail'
import AddUpdateProduct from '../modules/product/page/add-update/AddUpdateProduct'
import ComboProduct from '../modules/combo-product/ComboProduct'
import DetailCombo from '../modules/combo-product/page/DetailCombo'
import AddUpdateCombo from '../modules/combo-product/page/AddUpdateCombo'
import ProductPromotion from '../modules/product-promotion/ProductPromotion'
import AddUpdateProductPromotion from '../modules/product-promotion/page/AddUpdateProductPromotion'
import DetailProductPromotion from '../modules/product-promotion/page/DetailProductPromotion'
import AddUpdatePackageProduct from '../modules/config/component/AddUpdatePackageProduct'
import ApproveMenu from '../modules/approve-menu/ApproveMenu'
import ApproveDetail from '../modules/approve-menu/page/ApproveDetail'
import Order from '../modules/order/Order'
import DetailOrder from '../modules/order/page/DetailOrder'
import VoucherSystem from '../modules/voucher/voucher-system/VoucherSystem'
import VoucherShop from '../modules/voucher/voucher-shop/VoucherShop'
import ApproveVoucher from '../modules/voucher/approve-voucher/ApproveVoucher'
import DetailVoucherSystem from '../modules/voucher/voucher-system/page/DetailVoucherSystem'
import AddUpdateVoucherSystem from '../modules/voucher/voucher-system/page/AddUpdateVoucherSystem'
import DetailVoucherShop from '../modules/voucher/voucher-shop/DetailVoucherShop'
import AddUpdateVoucherShop from '../modules/voucher/voucher-shop/AddUpdateVoucherShop'
import Banner from '../modules/banner/Banner'
import AddUpdateBanner from '../modules/banner/AddUpdateBanner'
import Driver from '../modules/driver/Driver'
import DetailDriver from '../modules/driver/page/DetailDriver'
import Notification from '../modules/notification/Notification'
import ReportRevenue from '../modules/report/report-revenue/ReportRevenue'
import ReportShop from '../modules/report/report-shop/ReportShop'
import PartnerRequest from '../modules/partner-request/PartnerRequest'
import Customer from '../modules/custommer/Customer'
import CustomerDetail from '../modules/custommer/CustomerDetail'
import DetailReportRevenue from '../modules/report/report-revenue/page/DetailReportRevenue'

export const ADMIN_ROUTER = {
  DASHBOARD: {
    path: '/dashboard',
    component: Dashboard,
  },
  CATEGORY: {
    path: '/category',
    component: Category,
  },
  PRODUCT_LIST: {
    path: '/product-list',
    component: Product,
  },
  PRODUCT_DETAIL: {
    path: '/product-list/product-detail',
    component: ProductDetail,
  },
  PRODUCT_ADD_UPDATE: {
    path: '/product-list/product-add-update',
    component: AddUpdateProduct,
  },
  ACCOUNT_LIST: {
    path: '/account-list',
    component: Account,
  },
  CONFIG: {
    path: '/config',
    component: ConfigPage,
  },
  SHOP: {
    path: '/shop',
    component: Shop,
  },
  SHOP_DETAIL: {
    path: '/shop/detail',
    component: ShopDetail,
  },
  COMBO: {
    path: '/combo',
    component: ComboProduct,
  },
  COMBO_DETAIL: {
    path: '/combo/detail',
    component: DetailCombo,
  },
  ADD_UPDATE_COMBO: {
    path: '/combo/add-update',
    component: AddUpdateCombo,
  },
  PRODUCT_PROMOTION: {
    path: '/product-promotion',
    component: ProductPromotion,
  },
  ADD_UPDATE_PRODUCT_PROMOTION: {
    path: '/product-promotion/add-update',
    component: AddUpdateProductPromotion,
  },
  DETAIL_PRODUCT_PROMOTION: {
    path: '/product-promotion/detail',
    component: DetailProductPromotion,
  },
  ADD_UPDATE_PACKAGE_PRODUCT: {
    path: '/config/add-update-package-product',
    component: AddUpdatePackageProduct,
  },
  APPROVE_MENU: {
    path: '/approve-menu',
    component: ApproveMenu,
  },
  APPROVE_MENU_DETAIL: {
    path: '/approve-menu/detail',
    component: ApproveDetail,
  },
  ORDER: {
    path: '/order',
    component: Order,
  },
  ORDER_DETAIL: {
    path: '/order/detail',
    component: DetailOrder,
  },
  VOUCHER_SYSTEM: {
    path: '/voucher-system',
    component: VoucherSystem,
  },
  VOUCHER_SYSTEM_DETAIL: {
    path: '/voucher-system/detail',
    component: DetailVoucherSystem,
  },
  ADD_UPDATE_VOUCHER_SYSTEM: {
    path: '/voucher-system/add-update',
    component: AddUpdateVoucherSystem,
  },
  VOUCHER_SHOP: {
    path: '/voucher-shop',
    component: VoucherShop,
  },
  VOUCHER_SHOP_DETAIL: {
    path: '/voucher-shop/detail',
    component: DetailVoucherShop,
  },
  VOUCHER_SHOP_ADD_UPDATE: {
    path: '/voucher-shop/add-update',
    component: AddUpdateVoucherShop,
  },
  APPROVE_VOUCHER: {
    path: '/approve-voucher',
    component: ApproveVoucher,
  },
  BANNER: {
    path: '/banner',
    component: Banner,
  },
  BANNER_ADD_UPDATE: {
    path: '/banner/add-update',
    component: AddUpdateBanner,
  },
  DRIVER: {
    path: '/driver',
    component: Driver,
  },
  DRIVER_DETAIL: {
    path: '/driver/detail',
    component: DetailDriver,
  },
  NOTIFICATION: {
    path: '/notification',
    component: Notification,
  },
  REPORT_REVENUE: {
    path: '/report-revenue',
    component: ReportRevenue,
  },
  REPORT_REVENUE_DETAIL: {
    path: '/report-revenue/detail',
    component: DetailReportRevenue,
  },
  REPORT_SHOP: {
    path: '/report-shop',
    component: ReportShop,
  },
  PARTNER_REQUEST: {
    path: '/partner-request',
    component: PartnerRequest,
  },
  CUSTOMER: {
    path: '/customer',
    component: Customer,
  },
  CUSTOMER_DETAIL: {
    path: '/customer/detail',
    component: CustomerDetail,
  },
}

const AdminRouter: React.FC = () => {
  let arrAdminRouter = Object.values(ADMIN_ROUTER)
  return (
    <Switch>
      {arrAdminRouter.map((value: any) => (
        <Route key={value.path} exact path={value.path} component={value.component} />
      ))}
    </Switch>
  )
}

export default AdminRouter
