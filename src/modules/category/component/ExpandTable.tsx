import React, { useRef, useState } from 'react'
import { Card, Col, Descriptions, Image, Row } from 'antd'
import AddUpdateCate from './AddUpdateCate'
import { DEFINE_STATUS_CATE, IDatasourceCate, RenderTagStatusCate } from '../Category'
import { Moment } from '../../../services/Moment'
import { deleteCategoryApi, putStatusCategoryApi } from '../CategoryApi'
import Config from '../../../services/Config'
import { Notification } from '../../../commons/notification/Notification'
import { ButtonChangeStatus, ButtonDelete, ButtonEdit } from '../../../commons/button/Button'

interface IProps {
  record: IDatasourceCate
  onCallApiSuccess: () => any
}

const ExpandTable: React.FC<IProps> = ({ record, onCallApiSuccess }) => {
  const [loading, setLoading] = useState({
    changeStatus: false,
    update: false,
    delete: false,
  })

  const openModal = useRef<Function>()

  const onOpenModal = () => {
    openModal.current && openModal.current(record)
  }

  const onChangeStatusCate = async () => {
    try {
      setLoading({ ...loading, changeStatus: true })
      const res = await putStatusCategoryApi(
        record.id,
        record.status === DEFINE_STATUS_CATE.ENABLE ? DEFINE_STATUS_CATE.DISABLE : DEFINE_STATUS_CATE.ENABLE
      )
      if (res.body.status === Config._statusSuccessCallAPI) {
        Notification.PushNotification(
          'SUCCESS',
          `Danh mục ${record.name} đã ${record.status === DEFINE_STATUS_CATE.ENABLE ? 'Ngưng hoạt động' : 'Hoạt động'}`
        )
        onCallApiSuccess()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, changeStatus: false })
    }
  }

  const onDeleteCate = async () => {
    try {
      setLoading({ ...loading, delete: true })
      const res = await deleteCategoryApi(record.id)
      if (res.body.status === Config._statusSuccessCallAPI) {
        Notification.PushNotification('SUCCESS', `Xóa thành công danh mục ${record.name}`)
        onCallApiSuccess()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, delete: false })
    }
  }

  return (
    <Card
      title={'Thông tin danh mục'}
      actions={[
        <ButtonChangeStatus
          loading={loading.changeStatus}
          status={record.status}
          onClick={() => onChangeStatusCate()}
        />,
        <ButtonEdit onClick={() => onOpenModal()} />,
        <ButtonDelete
          loading={loading.delete}
          onClick={() => onDeleteCate()}
          confirmText={'Bạn có muốn xóa danh mục này không?'}
        />,
      ]}
    >
      <Row>
        <Col md={4}>
          <Image src={record.iconUrl} width={120} />
        </Col>
        <Col md={20}>
          <Descriptions column={2}>
            <Descriptions.Item label={'Tên danh mục'}>{record.name}</Descriptions.Item>
            <Descriptions.Item label={'Trạng thái'}>{RenderTagStatusCate(record.status)}</Descriptions.Item>
            <Descriptions.Item label={'Ngày tạo'}>{Moment.getDate(record.createAt, 'DD/MM/YYYY')}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <AddUpdateCate
        onOpenModal={(fn) => {
          openModal.current = fn
        }}
        onCallApiSuccess={() => onCallApiSuccess()}
        dataDefault={record}
      />
    </Card>
  )
}

export default ExpandTable
