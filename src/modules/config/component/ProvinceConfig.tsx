import React, { useEffect, useRef, useState } from 'react'
import { Button, Card } from 'antd'
import TableHoc from '../../../commons/HOC/TableHOC'
import { Table } from 'antd/es'
import { IResDataProvinces } from '../ConfigInterface'
import { DEFAULT_PAGE } from '../../Constances'
import Config from '../../../services/Config'
import { deleteProvincesApi, getListProvinceApi } from '../ConfigApi'
import { IColumn, IValidate } from '../../../services/Interfaces'
import { Moment } from '../../../services/Moment'
import { Notification } from '../../../commons/notification/Notification'
import AddUpdateProvince from './AddUpdateProvince'

const columns: IColumn[] = [
  {
    title: 'STT',
    key: 'STT',
    dataIndex: 'STT',
    render: (STT: number, row, index) => <div>{STT}</div>,
  },
  {
    title: 'Tên Tỉnh/Thành phố',
    key: 'provinceName',
    dataIndex: 'provinceName',
    render: (provinceName: string, row, index) => <div>{provinceName}</div>,
  },
  {
    title: 'Ngày tạo',
    key: 'createAt',
    dataIndex: 'createAt',
    render: (createAt, row, index) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
  },
]

const ProvinceConfig = () => {
  const [loading, setLoading] = useState({
    getList: false,
    delete: false,
  })
  const [listProvince, setListProvince] = useState<IResDataProvinces[]>([])
  const [total, setTotal] = useState<number>(0)
  const [payload, setPayload] = useState<{ page: number; limit: number }>({
    page: DEFAULT_PAGE,
    limit: Config._limit,
  })

  const [idsSelected, setIdsSelected] = useState<number[]>([])

  const modalAddRef = useRef<Function>()

  const getListProvince = async () => {
    try {
      setLoading({ ...loading, getList: true })
      const res = await getListProvinceApi(payload)
      if (res.body.status) {
        setListProvince(res.body.data)
        setTotal(res.body.paging.totalItemCount)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getList: false })
    }
  }

  const deleteProvinces = async () => {
    try {
      const validate = (): IValidate => {
        if (idsSelected.length > 0) {
          return {
            isValidity: true,
            msg: '',
          }
        } else {
          return {
            isValidity: false,
            msg: 'Vui lòng chọn tỉnh thành để có thể xóa.',
          }
        }
      }
      if (validate().isValidity) {
        setLoading({ ...loading, delete: true })
        const res = await deleteProvincesApi(idsSelected)
        if (res.body.status) {
          Notification.PushNotification('SUCCESS', 'Xóa thành công tỉnh thành phố.')
          getListProvince()
        }
      } else {
        Notification.PushNotification('ERROR', validate().msg)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, delete: false })
    }
  }

  useEffect(() => {
    getListProvince()
  }, [payload])

  return (
    <div>
      <Card
        title={'Thông tin tỉnh/ thành phố hoạt động'}
        extra={[
          <Button type={'primary'} danger className={'mr-16'} loading={loading.delete} onClick={deleteProvinces}>
            Xóa
          </Button>,
          <Button type={'primary'} onClick={() => modalAddRef.current && modalAddRef.current()}>
            Thêm mới
          </Button>,
        ]}
      >
        <TableHoc>
          <Table
            columns={columns}
            loading={loading.getList}
            dataSource={listProvince.map((value, index) => {
              return { ...value, STT: Config.getIndexTable(payload.page, index), key: value.id }
            })}
            rowSelection={{
              type: 'checkbox',
              checkStrictly: true,
              preserveSelectedRowKeys: true,
              onChange: (selectedRowKey: any, selectedRows: any) => {
                setIdsSelected(selectedRowKey)
              },
            }}
            pagination={{
              onChange: (page) => setPayload({ ...payload, page: page }),
              total: total,
              current: payload.page,
            }}
          />
        </TableHoc>
      </Card>
      <AddUpdateProvince
        fnOpenModal={(fn) => {
          modalAddRef.current = fn
        }}
        onCallApiSuccess={() => getListProvince()}
      />
    </div>
  )
}

export default ProvinceConfig
