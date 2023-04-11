import React, { Children, cloneElement } from 'react'

interface IProps {}

const PopconfirmHoc: React.FC<IProps> = ({ children }) => {
  return (
    <>
      {Children.map(children, (child: any) => {
        const props = {
          okText: 'Xác nhận',
          cancelButtonProps: {
            danger: true,
          },
        }
        return cloneElement(child, props)
      })}
    </>
  )
}

export default PopconfirmHoc
