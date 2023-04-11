import React, { useEffect, useRef, useState } from 'react'
import Config from '../../services/Config'
import { Affix, Button, Col, Input, PageHeader, Row, Select, Table, Tag } from 'antd'
import TableHoc from '../../commons/HOC/TableHOC'
import { IColumn } from '../../services/Interfaces'
import ExpandTable from './component/ExpandTable'
import AddUpdateAccount from './component/AddUpdateAccount'
import { getListAccountApi } from './AccountAPI'
import { IResDataListAccount } from './AccountInterface'
import { getDataSourceAccount } from './AccountFn'
import { DEFAULT_PAGE } from '../Constances'

export const DEFINE_STATUS_ACCOUNT = {
  INACTIVE: 0, // Không hoạt động
  ACTIVE: 1, // Hoạt động
  ALL: 2,
}

export const DEFINE_ROLE_ACCOUNT = {
  ALL: 0,
  ADMIN: 1, // ADMIN
  ACCOUNTANT: 2, // Kết toán
  EDITOR: 3, // Biên tập
  SHOP: 4, // Cửa hàng
  DRIVER: 5, // Tài xế
  CUSTOMER: 6, // Khách hàng
}

export const GetTagStatusAccount = (status: number, type: 'TAG' | 'TEXT' = 'TAG') => {
  if (status === DEFINE_STATUS_ACCOUNT.ACTIVE) {
    return <Tag color={'green'}>Đang hoạt động</Tag>
  }
  if (status === DEFINE_STATUS_ACCOUNT.INACTIVE) {
    return <Tag color={'gray'}>Ngưng hoạt động</Tag>
  }
}

export const GetTagRoleAccount = (role: number, type: 'TAG' | 'TEXT' = 'TAG') => {
  if (role === DEFINE_ROLE_ACCOUNT.ADMIN) {
    return <Tag color={'blue'}>Admin</Tag>
  }
  if (role === DEFINE_ROLE_ACCOUNT.ACCOUNTANT) {
    return <Tag color={'purple'}>Kế toán</Tag>
  }
  if (role === DEFINE_ROLE_ACCOUNT.EDITOR) {
    return <Tag color={'orange'}>Biên tập</Tag>
  }
  if (role === DEFINE_ROLE_ACCOUNT.ALL) {
    return <Tag color={'gold'}>Tất cả</Tag>
  }
  if (role === DEFINE_ROLE_ACCOUNT.DRIVER) {
    return <Tag color={'green'}>Tài xế</Tag>
  }
  if (role === DEFINE_ROLE_ACCOUNT.SHOP) {
    return <Tag color={'pink'}>Cửa hàng</Tag>
  }
  if (role === DEFINE_ROLE_ACCOUNT.CUSTOMER) {
    return <Tag color={'geekblue'}>Khách hàng</Tag>
  }
}

export interface IDatasourceAccount extends IResDataListAccount {
  key: number
  STT: number
}

const columnsListAccount: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    align: 'center',
    width: 20,
    render: (STT: number) => <div>{STT}</div>,
  },
  {
    title: 'Họ tên',
    key: 'name',
    dataIndex: 'name',
    render: (name: string) => <div>{name}</div>,
  },
  {
    title: 'Số điện thoại',
    key: 'phone',
    dataIndex: 'phone',
    render: (phone: string) => <div>{phone}</div>,
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
    render: (value: string) => <div>{value}</div>,
  },
  // {
  //   title: 'Loại tài khoản',
  //   key: 'role',
  //   dataIndex: 'role',
  //   render: (role: number) => <div>{GetTagRoleAccount(role)}</div>,
  // },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: (status: number) => <div>{GetTagStatusAccount(status)}</div>,
  },
]

const Account = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [arg, setArg] = useState({
    page: 1,
    role: DEFINE_ROLE_ACCOUNT.ALL,
    status: DEFINE_STATUS_ACCOUNT.ALL,
    search: '',
  })
  const [isFixed, setIsFixed] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const [listAccount, setListAccount] = useState<IDatasourceAccount[]>([])

  const openModalAddAccount = useRef<Function>()

  const onOpenModalAddAccount = () => {
    openModalAddAccount.current && openModalAddAccount.current()
  }

  const getListAccount = async () => {
    try {
      setLoading(true)
      const res = await getListAccountApi(arg.page, arg.role, arg.status, arg.search)
      if (res.body.status === Config._statusSuccessCallAPI) {
        setListAccount(getDataSourceAccount(res.body.data, arg.page))
        setTotal(res.body.paging.totalItemCount)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let id = setTimeout(() => {
      getListAccount()
    }, 500)
    return () => clearTimeout(id)
  }, [arg])

  return (
    <>
      <PageHeader
        title={'Tài khoản'}
        extra={
          <Button type={'primary'} onClick={onOpenModalAddAccount}>
            Thêm mới
          </Button>
        }
      />
      <Affix offsetTop={Config._offsetTopAffix} onChange={(affixed) => setIsFixed(affixed as boolean)}>
        <div className={'style-box'}>
          <Row gutter={[32, 4]}>
            <Col lg={7}>
              <Input
                placeholder={'Tên hoặc số điện thoại.'}
                onChange={(event) => setArg({ ...arg, search: event.target.value, page: DEFAULT_PAGE })}
              />
            </Col>
            <Col lg={7}>
              <Select
                placeholder={'Trạng thái.'}
                style={{ width: '100%' }}
                onChange={(value) => {
                  setArg({
                    ...arg,
                    status: typeof value === 'undefined' ? DEFINE_STATUS_ACCOUNT.ALL : Number(value),
                    page: DEFAULT_PAGE,
                  })
                }}
                allowClear={true}
              >
                <Select.Option value={DEFINE_STATUS_ACCOUNT.ALL}>Tất cả</Select.Option>
                <Select.Option value={DEFINE_STATUS_ACCOUNT.ACTIVE}>Đang hoạt động</Select.Option>
                <Select.Option value={DEFINE_STATUS_ACCOUNT.INACTIVE}>Ngưng hoạt động</Select.Option>
              </Select>
            </Col>
            <Col lg={7}>
              {/*<Select*/}
              {/*  placeholder={'Loại tài khoản.'}*/}
              {/*  allowClear={true}*/}
              {/*  style={{ width: '100%' }}*/}
              {/*  onClear={() => setArg({ ...arg, role: DEFINE_ROLE_ACCOUNT.ALL, page: DEFAULT_PAGE })}*/}
              {/*  onChange={(value) => setArg({ ...arg, role: Number(value), page: DEFAULT_PAGE })}*/}
              {/*>*/}
              {/*  <Select.Option value={DEFINE_ROLE_ACCOUNT.ALL}>Tất cả</Select.Option>*/}
              {/*  <Select.Option value={DEFINE_ROLE_ACCOUNT.ADMIN}>Admin</Select.Option>*/}
              {/*  <Select.Option value={DEFINE_ROLE_ACCOUNT.ACCOUNTANT}>Kế toán</Select.Option>*/}
              {/*  <Select.Option value={DEFINE_ROLE_ACCOUNT.EDITOR}>Biên tập</Select.Option>*/}
              {/*</Select>*/}
            </Col>
            <Col lg={3}>
              {isFixed ? (
                <div className={'d-flex justify-content-end'}>
                  <Button type={'primary'} onClick={onOpenModalAddAccount}>
                    Thêm mới
                  </Button>
                </div>
              ) : (
                <Row justify={'end'} style={{ marginTop: 5 }}>
                  <span>Kết quả lọc: {total}</span>
                </Row>
              )}
            </Col>
          </Row>
        </div>
      </Affix>

      <div className={'style-box'}>
        <TableHoc>
          <Table
            columns={columnsListAccount}
            dataSource={listAccount}
            loading={loading}
            pagination={{ onChange: (page) => setArg({ ...arg, page: page }), total: total }}
            expandedRowRender={(record) => <ExpandTable record={record} callApiSuccess={() => getListAccount()} />}
          />
        </TableHoc>
      </div>

      <AddUpdateAccount
        type={'ADD'}
        onOpenModal={(fn: any) => {
          openModalAddAccount.current = fn
        }}
        onCallApiSuccess={() => getListAccount()}
      />
    </>
  )
}

export default Account
