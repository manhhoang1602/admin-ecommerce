import { notification, message } from 'antd'

export class Notification {
  public static PushNotification(
    _type: 'INFO' | 'WARRING' | 'ERROR' | 'SUCCESS',
    _mes: string,
    _duration: number = 3.5,
    _pathNavigate?: string,
    _onClick?: () => any,
    _titleNotification?: string
  ) {
    if (_type === 'INFO') {
      notification.info({
        message: `Thông báo: ${_titleNotification ? _titleNotification : ''}`,
        description: _mes,
        placement: 'topRight',
        duration: _duration,
        onClick: () => {
          _onClick && _onClick()
        },
      })
    } else if (_type === 'SUCCESS') {
      notification.success({
        message: `Thông báo thành công`,
        description: _mes,
        placement: 'topRight',
        duration: _duration,
        onClick: () => {
          _onClick && _onClick()
        },
      })
    } else if (_type === 'ERROR') {
      notification.error({
        message: `Thông báo lỗi`,
        description: _mes,
        placement: 'topRight',
        duration: _duration,
        onClick: () => {
          _onClick && _onClick()
        },
      })
    } else {
      notification.warning({
        message: `Cảnh báo`,
        description: _mes,
        placement: 'topRight',
        duration: _duration,
        onClick: () => {
          _onClick && _onClick()
        },
      })
    }
  }

  public static PushMassage(
    _type: 'INFO' | 'WARRING' | 'ERROR' | 'SUCCESS',
    _msg: string,
    _duration: number = 1.5,
    _onClose?: () => any
  ) {
    if (_type === 'ERROR') message.error(_msg, _duration, _onClose)
    if (_type === 'SUCCESS') message.success(_msg, _duration, _onClose)
    if (_type === 'INFO') message.info(_msg, _duration, _onClose)
    if (_type === 'WARRING') message.warning(_msg, _duration, _onClose)
  }
}
