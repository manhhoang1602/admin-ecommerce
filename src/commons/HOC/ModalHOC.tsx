import React, { Children, cloneElement } from 'react'

interface IProps {
  icon?: React.ReactNode
  cancelText?: React.ReactNode
  okText?: React.ReactNode
}

const ModalHoc: React.FC<IProps> = ({
  icon = <i className="fal fa-times" style={{ fontSize: 20, color: 'red' }} />,
  cancelText = 'Hủy',
  okText = 'Lưu',
  children,
}) => {
  return (
    <>
      {Children.map(children, (child: any) => {
        const props = {
          closeIcon: icon,
          cancelText: cancelText,
          destroyOnClose: true,
          okText: okText,
          bordered: false,
          cancelButtonProps: { danger: true },
        }
        return cloneElement(child, props)
      })}
    </>
  )
}

export default ModalHoc
