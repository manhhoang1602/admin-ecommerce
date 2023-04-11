import React from 'react'
import styled from 'styled-components'
import { Button, Col, Empty, Row, Spin, Tooltip } from 'antd'
import { IResDataPushNotification } from '../../modules/notification/NotificationInterfaces'
import { Moment } from '../../services/Moment'

const NotificationHeaderComponent = (props: {
  title: string
  extra: React.ReactNode[]
  listNotification: IResDataPushNotification[]
  onClick: (data: IResDataPushNotification) => any
  loading?: boolean
  onLoadMore?: () => any
  visibledLoadMore?: boolean
}) => {
  const { title, extra, listNotification, onClick, loading, visibledLoadMore, onLoadMore } = props

  return (
    <Spin spinning={loading}>
      <NotificationHeaderComponentStyle>
        <div className={'header'}>
          <Row gutter={[16, 8]} justify={'space-between'}>
            <Col md={6} className={'title'}>
              {title}
            </Col>
            <Col>
              {extra.map((value, index) => (
                <span key={Date()}>{value}</span>
              ))}
            </Col>
          </Row>
        </div>
        <div className={'list-notification'}>
          {listNotification.map((value) => {
            return (
              <div className={'item'} onClick={(event) => onClick(value)}>
                {value.isRead ? null : <i className="fas fa-circle" />}
                <i className="fas fa-bell" />
                <div>
                  <Tooltip title={value.content}>
                    <div className={'content'}>{value.content}</div>
                  </Tooltip>
                  <div className={'date'}>{Moment.getDate(value.createAt, 'DD/MM/YYYY')}</div>
                </div>
              </div>
            )
          })}
          {listNotification.length === 0 ? (
            <Empty style={{ marginTop: 70 }} description={'Không có thông báo mới nào'} />
          ) : null}
          {visibledLoadMore ? (
            <Row justify={'center'} style={{ marginTop: 10 }}>
              <Button
                style={{ fontSize: 13 }}
                type={'primary'}
                size={'small'}
                onClick={(event) => onLoadMore && onLoadMore()}
              >
                Xem thêm
              </Button>
            </Row>
          ) : null}
        </div>
      </NotificationHeaderComponentStyle>
    </Spin>
  )
}

export default NotificationHeaderComponent

const NotificationHeaderComponentStyle = styled.div`
  width: 400px;
  height: 500px;

  .header {
    border-bottom: 1px solid #f1f1f1;
    padding: 8px;

    .title {
      font-family: 'Open Sans-bold';
      font-size: 15px;
      color: gray;
    }
  }

  .list-notification {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 460px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background-color: white;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #f1f1f1;
      border-radius: 6px;
    }

    .item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f1f1f1;
      padding: 15px 10px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.5s ease;

      &:hover {
        background-color: #f1f1f1;
      }

      .fa-circle {
        color: red;
        margin-right: 10px;
      }

      .fa-bell {
        font-size: 24px;
        margin-right: 10px;
        color: gray;
      }

      .content {
        font-size: 13px;
        font-family: 'Open Sans-bold';

        white-space: nowrap;
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .date {
        font-size: 12px;
        color: gray;
      }
    }
  }
`
