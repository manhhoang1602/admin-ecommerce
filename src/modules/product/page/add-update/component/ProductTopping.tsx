import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Input, Modal, Space, Table } from 'antd'
import Icon from '../../../../../commons/icon/Icon'
import TableHoc from '../../../../../commons/HOC/TableHOC'
import ModalHoc from '../../../../../commons/HOC/ModalHOC'
import { IColumn } from '../../../../../services/Interfaces'
import { Format } from '../../../../../services/Format'
import AddUpdateTopping from '../../../../config/component/AddUpdateTopping'
import { IDataSourceTopping } from '../../../../config/component/Topping'
import { getListToppingApi } from '../../../../config/ConfigApi'
import Config from '../../../../../services/Config'
import { DEFINE_STATUS } from '../../../../Constances'
import { splitArray } from '../../../../../services/Functions'

const ProductTopping: React.FC<{ onChange: (data: IDataSourceTopping[]) => any; defaultData?: IDataSourceTopping[] }> =
  ({ onChange, defaultData }) => {
    const columnsListTopping: IColumn[] = [
      {
        title: 'STT',
        key: 'STT',
        dataIndex: 'STT',
        width: 20,
        align: 'center',
        render: (STT: number) => <div>{STT}</div>,
      },
      {
        title: 'Mã topping',
        key: 'code',
        dataIndex: 'code',
        render: (code: string) => <div>{code}</div>,
      },
      {
        title: 'Tên topping',
        key: 'name',
        dataIndex: 'name',
        render: (name: string) => <div>{name}</div>,
      },
      {
        title: 'Giá niêm yết',
        key: 'price',
        dataIndex: 'price',
        align: 'center',
        render: (price: number) => <div>{Format.numberWithCommas(price, 'đ')}</div>,
      },
      {
        title: 'STT hiển thị',
        key: 'displayOrder',
        dataIndex: 'displayOrder',
        width: 120,
        align: 'center',
        render: (displayOrder: number) => <div>{Format.numberWithCommas(displayOrder)}</div>,
      },
    ]

    const [visibleModalAddTopping, setVisibleModalAddTopping] = useState<boolean>(false)
    const openModalAddNewTopping = useRef<Function>()

    const [loadingGetTopping, setLoadingGetTopping] = useState<boolean>(false)
    const [totalListTopping, setTotalListTopping] = useState<number>(0)
    const [arg, setArg] = useState({
      page: 1,
      search: '',
    })

    const [listTopping, setListTopping] = useState<IDataSourceTopping[]>([])
    const [listToppingSelected, setListToppingSelected] = useState<IDataSourceTopping[]>([])
    const [selectedRows, setSelectedRows] = useState<IDataSourceTopping[]>([])

    const openModalAddTopping = () => setVisibleModalAddTopping(true)
    const closeModalAddTopping = () => setVisibleModalAddTopping(false)

    const getListTopping = async () => {
      try {
        setLoadingGetTopping(true)
        const res = await getListToppingApi(arg.page, arg.search, DEFINE_STATUS.ACTIVE)
        if (res.body.status === Config._statusSuccessCallAPI) {
          setListTopping(
            res.body.data.map((value, index) => {
              return {
                ...value,
                key: value.id,
                STT: Config.getIndexTable(arg.page, index),
                option: { key: value.id, status: value.status },
              }
            })
          )
          setTotalListTopping(res.body.paging.totalItemCount)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingGetTopping(false)
      }
    }

    const onAddToppingToProduct = () => {
      try {
        const splitArr = splitArray(selectedRows, listToppingSelected, 'key', 'defaultArray')
        let newListSubProductSelect: IDataSourceTopping[] = splitArr.mergeArray.concat(
          splitArr.newArray
        ) as IDataSourceTopping[]
        setListToppingSelected(newListSubProductSelect)
        setVisibleModalAddTopping(false)
      } catch (e) {
        console.error(e)
      }
    }

    const onChangeStatusTopping = (key: any) => {
      try {
        setListToppingSelected(
          listToppingSelected.map((value) => {
            if (value.key === key) {
              const newStatus = value.status ? DEFINE_STATUS.INACTIVE : DEFINE_STATUS.ACTIVE
              return {
                ...value,
                status: newStatus,
                option: {
                  key: value.key,
                  status: newStatus,
                },
              }
            } else return value
          })
        )
      } catch (e) {
        console.error(e)
      }
    }

    const onDeleteTopping = (key: any) => {
      try {
        const newListToppingSelected = listToppingSelected.filter((value) => value.key !== key)
        setListToppingSelected(newListToppingSelected)
        setSelectedRows(newListToppingSelected)
      } catch (e) {
        console.error(e)
      }
    }

    useEffect(() => {
      getListTopping()
    }, [arg])

    useEffect(() => {
      onChange(listToppingSelected)
    }, [listToppingSelected])

    useEffect(() => {
      if (defaultData) {
        setListToppingSelected(defaultData)
        setSelectedRows(defaultData)
      }
    }, [defaultData])

    return (
      <div className={'style-box'}>
        <Card
          bordered={false}
          extra={[
            <Button type={'primary'} key={'addProduct'} icon={Icon.BUTTON.ADD} onClick={openModalAddTopping}>
              Thêm topping
            </Button>,
          ]}
          title={<div className={'title-card'}>Thông tin topping bán kèm</div>}
        >
          <TableHoc>
            <Table
              columns={[
                ...columnsListTopping,
                {
                  title: '',
                  key: 'option',
                  dataIndex: 'option',
                  width: 200,
                  align: 'center',
                  render: (option: { key: any; status: number }) => (
                    <div>
                      <Space>
                        <span onClick={() => onChangeStatusTopping(option.key)} style={{ fontSize: 10 }}>
                          {option.status ? Icon.BUTTON.ENABLE : Icon.BUTTON.DISABLE}
                        </span>
                        <span onClick={(event) => onDeleteTopping(option.key)} style={{ fontSize: 18, color: 'red' }}>
                          {Icon.BUTTON.DELETE}
                        </span>
                      </Space>
                    </div>
                  ),
                },
              ]}
              dataSource={listToppingSelected}
            />
          </TableHoc>
        </Card>
        <ModalHoc>
          <Modal
            title={'Thêm topping.'}
            visible={visibleModalAddTopping}
            onCancel={(e) => {
              closeModalAddTopping()
              setSelectedRows(listToppingSelected)
            }}
            width={'80vw'}
            onOk={onAddToppingToProduct}
          >
            <Space className={'mb-16'}>
              <Input
                placeholder={'Tìm theo tên topping.'}
                className={'width-200'}
                allowClear={true}
                onChange={(event) => setArg({ ...arg, search: event.target.value })}
              />
              <Button
                type={'primary'}
                icon={Icon.BUTTON.ADD}
                onClick={() => openModalAddNewTopping.current && openModalAddNewTopping.current()}
              >
                Thêm topping
              </Button>
            </Space>
            <TableHoc>
              <Table
                columns={columnsListTopping}
                loading={loadingGetTopping}
                dataSource={listTopping}
                pagination={{ onChange: (page) => setArg({ ...arg, page: page }), total: totalListTopping }}
                rowSelection={{
                  selectedRowKeys: selectedRows.map((value) => {
                    return value.key
                  }),
                  onSelect: (record, selected) => {
                    if (selected) {
                      setSelectedRows([...selectedRows, record])
                    } else {
                      setSelectedRows(selectedRows.filter((value) => value.key !== record.key))
                    }
                  },
                  onSelectAll: (selected: boolean, selectedListRow: Array<any>, changeListRow: Array<any>) => {
                    if (selected) {
                      setSelectedRows(selectedRows.concat(changeListRow))
                    } else {
                      setSelectedRows(splitArray(selectedRows, changeListRow, 'key').newArray as any)
                    }
                  },
                }}
              />
            </TableHoc>
          </Modal>
        </ModalHoc>

        <AddUpdateTopping
          type={'ADD'}
          openModal={(fn) => {
            openModalAddNewTopping.current = fn
          }}
          onCallApiSuccess={() => getListTopping()}
        />
      </div>
    )
  }

export default React.memo(ProductTopping)
