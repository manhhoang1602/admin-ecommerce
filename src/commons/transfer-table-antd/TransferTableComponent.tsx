import React from 'react'
import { Table, Transfer, TransferProps } from 'antd'
import { IColumn } from '../../services/Interfaces'
import { difference } from 'lodash'

export interface IProps extends TransferProps<Transfer> {
  leftColumns: IColumn[]
  rightColumns: IColumn[]
  listItemFilter?: any[]
  loading?: boolean
}

const TransferTableComponent = (props: IProps) => {
  const { leftColumns, rightColumns, loading, listItemFilter, ...rest } = props

  return (
    <Transfer {...rest}>
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns

        const rowSelection = {
          getCheckboxProps: (item: any) => ({ disabled: listDisabled || item.disabled }),
          onSelectAll(selected: boolean, selectedRows: any[]) {
            filteredItems = listItemFilter as any
            const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ key }) => key)
            const diffKeys = selected
              ? difference(treeSelectedKeys, listSelectedKeys)
              : difference(listSelectedKeys, treeSelectedKeys)
            onItemSelectAll(diffKeys, selected)
          },
          onSelect({ key }: any, selected: boolean) {
            onItemSelect(key, selected)
          },
          selectedRowKeys: listSelectedKeys,
        }

        return (
          <div>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              loading={loading}
              dataSource={filteredItems}
              size="small"
              onRow={({ key }: any) => ({
                onClick: () => {
                  onItemSelect(key, !listSelectedKeys.includes(key))
                },
              })}
            />
          </div>
        )
      }}
    </Transfer>
  )
}

export default TransferTableComponent
