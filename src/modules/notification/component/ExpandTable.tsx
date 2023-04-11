import React, { useRef } from 'react'
import { Card, Descriptions } from 'antd'
import DescriptionsItem from 'antd/es/descriptions/Item'
import store, { DEFINE_NOTIFICATION_STATUS, INotification } from '../NotificationStore'
import { ButtonDelete, ButtonEdit } from '../../../commons/button/Button'
import { IPayloadNotification } from '../NotificationInterfaces'
import AddUpdateNotification from './AddUpdateNotification'
import { Moment } from '../../../services/Moment'
import { RenderNotificationStatus } from '../Notification'
import { GetTagRoleAccount } from '../../account/Account'

const ExpandTable = (props: { detailNotification: INotification; payload: IPayloadNotification }) => {
  const { detailNotification, payload } = props
  const refAddUpdateNotification = useRef<Function>()
  const onOpenModal = () => {
    refAddUpdateNotification.current && refAddUpdateNotification.current()
  }

  return (
    <div>
      <Card
        title={'Chi tiết thông báo'}
        bordered={false}
        actions={
          detailNotification.postStatus === DEFINE_NOTIFICATION_STATUS.DRAFT
            ? [
                <ButtonEdit onClick={() => onOpenModal()} />,
                <ButtonDelete
                  loading={false}
                  onClick={() => {
                    store.deleteNotification(detailNotification.id, payload)
                  }}
                  confirmText={'Bạn có chắc muốn xóa thông báo này ra khỏi hệ thống?'}
                />,
              ]
            : [
                <ButtonDelete
                  loading={false}
                  onClick={() => {
                    store.deleteNotification(detailNotification.id, payload)
                  }}
                  confirmText={'Bạn có chắc muốn xóa thông báo này ra khỏi hệ thống?'}
                />,
              ]
        }
      >
        <Descriptions column={2}>
          <DescriptionsItem label={'Tiêu đề'}>{detailNotification.title}</DescriptionsItem>
          {/*<DescriptionsItem label={'Số điện thoại'}>{}</DescriptionsItem>*/}
          <DescriptionsItem label={'Trạng thái'}>
            {RenderNotificationStatus(detailNotification.postStatus)}
          </DescriptionsItem>
          <DescriptionsItem label={'Loại khách hàng'}>
            {GetTagRoleAccount(detailNotification.accountType)}
          </DescriptionsItem>
          {/*<DescriptionsItem label={'Nội dung'}>{}</DescriptionsItem>*/}
          <DescriptionsItem label={'Ngày tạo'}>
            {Moment.getDate(detailNotification.createAt, 'DD/MM/YYYY')}
          </DescriptionsItem>
        </Descriptions>
      </Card>
      <AddUpdateNotification
        type={'UPDATE'}
        defaultData={detailNotification}
        payload={payload}
        openCloseModal={(openModalFn) => (refAddUpdateNotification.current = openModalFn)}
      />
    </div>
  )
}

export default ExpandTable
